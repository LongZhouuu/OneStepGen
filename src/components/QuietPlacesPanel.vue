<template>
  <div class="panel">
    <button class="back-btn" type="button" @click="$emit('back')">
      ← Back
    </button>
    <h2>Melbourne Focus Map</h2>
    <p class="sub">Find nearby work/reset spots with opening times and distance.</p>

    <div class="controls">
      <button class="locate-btn" type="button" @click="useBrowserLocation" :disabled="isLocating">
        {{ isLocating ? 'Getting location...' : 'Use my location' }}
      </button>

      <div class="search-row">
        <input
          v-model.trim="locationQuery"
          type="text"
          class="location-input"
          placeholder="Enter Melbourne address or suburb"
          @keydown.enter.prevent="searchLocation"
        />
        <button class="search-btn" type="button" @click="searchLocation" :disabled="isSearching">
          {{ isSearching ? 'Searching...' : 'Search' }}
        </button>
      </div>
    </div>

    <p v-if="statusMessage" class="status-message">{{ statusMessage }}</p>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="tab-btn"
        :class="{ 'tab-btn--active': activeTab === tab.id }"
        @click="setActiveTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="content-grid">
      <div ref="mapEl" class="map"></div>

      <div class="results">
        <h3>Nearby Places</h3>
        <p v-if="!userLocation" class="empty-text">Set your location to see nearby places.</p>
        <p v-else-if="isLoadingData" class="empty-text">Loading places from your datasets...</p>
        <p v-else-if="!visiblePlaces.length" class="empty-text">
          No places loaded yet. Put CSV files in `public/focus-data` and verify paths in
          `src/data/focusMapSources.js`.
        </p>

        <ul v-else class="places-list">
          <li v-for="place in visiblePlaces" :key="place.id" class="place-card">
            <p class="place-name">{{ place.name }}</p>
            <p class="place-meta">
              <span class="place-pin" aria-hidden="true">📍</span>
              {{ place.category || 'Workspace' }}
            </p>
            <p class="place-meta">Distance from you: {{ formatDistance(place.distanceKm) }}</p>
            <p class="place-meta">Opening: {{ place.openingHours || 'Not provided' }}</p>
            <p v-if="place.address" class="place-meta">{{ place.address }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { focusMapSources } from '@/data/focusMapSources'

defineEmits(['back'])

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const mapEl = ref(null)
const map = ref(null)
const userLocation = ref(null)
const locationQuery = ref('')
const statusMessage = ref('')
const isLocating = ref(false)
const isSearching = ref(false)
const isLoadingData = ref(false)
const activeTab = ref(focusMapSources[0]?.id || '')

const placeMarkers = ref([])
const userMarker = ref(null)
const userRadius = ref(null)
const allPlaces = ref([])

const tabs = computed(() => focusMapSources.map((source) => ({ id: source.id, label: source.label })))

const placesWithDistance = computed(() => {
  if (!userLocation.value) return []

  return allPlaces.value
    .map((place) => ({
      ...place,
      distanceKm: haversineKm(
        userLocation.value.lat,
        userLocation.value.lng,
        place.lat,
        place.lng
      ),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
})

const visiblePlaces = computed(() => {
  if (!activeTab.value) return []
  return placesWithDistance.value
    .filter((place) => place.sourceId === activeTab.value)
    .slice(0, 20)
})

async function loadAllPlaces() {
  isLoadingData.value = true
  statusMessage.value = ''

  const loaded = await Promise.all(focusMapSources.map(loadSource))
  allPlaces.value = loaded.flat()
  isLoadingData.value = false
  statusMessage.value = `Loaded ${allPlaces.value.length} places.`
}

async function loadSource(source) {
  if (!source.url) return []

  try {
    const response = await fetch(source.url)
    if (!response.ok) return []

    let rows = []
    if (source.format === 'csv') {
      const csvText = await response.text()
      rows = parseCsv(csvText)
    } else {
      const data = await response.json()
      rows = Array.isArray(data) ? data : data?.results || data?.data || []
    }

    if (!Array.isArray(rows)) return []

    const filteredRows =
      Array.isArray(source.includeKeywords) && source.includeKeywords.length
        ? rows.filter((row) => isRelevantLandmarkRow(row, source.includeKeywords))
        : rows

    return filteredRows
      .map((row, index) => normalizePlace(row, source, index))
      .filter(Boolean)
  } catch {
    return []
  }
}

function normalizePlace(row, source, index) {
  const coords = getCoordinates(row, source.fieldMap)
  if (!coords) return null

  const { lat, lng } = coords
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null

  const name = getField(row, source.fieldMap.name) || `${source.label} ${index + 1}`

  return {
    id: `${source.id}-${index}-${name}`,
    sourceId: source.id,
    sourceLabel: source.label,
    name,
    lat,
    lng,
    openingHours: getField(row, source.fieldMap.openingHours) || source.defaultOpeningHours || '',
    category: getField(row, source.fieldMap.category) || source.label,
    address: getField(row, source.fieldMap.address),
  }
}

function getCoordinates(row, fieldMap) {
  if (fieldMap.lat && fieldMap.lng) {
    const lat = Number(getField(row, fieldMap.lat))
    const lng = Number(getField(row, fieldMap.lng))
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng }
    }
  }

  if (fieldMap.latLng) {
    const point = parseLatLngString(getField(row, fieldMap.latLng))
    if (point) return point
  }

  return null
}

function getField(obj, key) {
  if (!obj || !key) return ''
  return obj[key]
}

function parseCsv(csvText) {
  if (!csvText) return []
  const lines = csvText.replace(/\r/g, '').split('\n').filter((line) => line.trim().length)
  if (!lines.length) return []

  const headers = splitCsvLine(lines[0])
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line)
    const row = {}
    headers.forEach((header, index) => {
      row[header] = values[index] ?? ''
    })
    return row
  })
}

function splitCsvLine(line) {
  const values = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    const next = line[i + 1]

    if (char === '"' && inQuotes && next === '"') {
      current += '"'
      i += 1
      continue
    }

    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  values.push(current.trim())
  return values
}

function parseLatLngString(rawValue) {
  if (!rawValue) return null
  const parts = String(rawValue).split(',').map((value) => Number(value.trim()))
  if (parts.length < 2) return null
  if (!Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) return null
  return { lat: parts[0], lng: parts[1] }
}

function isRelevantLandmarkRow(row, keywords) {
  const haystack = `${row.Theme || ''} ${row['Sub Theme'] || ''} ${row['Feature Name'] || ''}`.toLowerCase()
  return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()))
}

async function useBrowserLocation() {
  if (!navigator.geolocation) {
    statusMessage.value = 'Geolocation is not available in this browser.'
    return
  }

  isLocating.value = true
  statusMessage.value = ''

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setUserLocation(position.coords.latitude, position.coords.longitude)
      isLocating.value = false
      statusMessage.value = 'Location updated.'
    },
    () => {
      isLocating.value = false
      statusMessage.value = 'Could not access your location. Please enter it manually.'
    },
    { enableHighAccuracy: true, timeout: 10000 }
  )
}

async function searchLocation() {
  if (!locationQuery.value) return

  isSearching.value = true
  statusMessage.value = ''

  try {
    const encoded = encodeURIComponent(`${locationQuery.value}, Melbourne`)
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encoded}`)
    const results = await res.json()
    const first = Array.isArray(results) ? results[0] : null

    if (!first) {
      statusMessage.value = 'Location not found. Try a more specific address.'
      return
    }

    setUserLocation(Number(first.lat), Number(first.lon))
    statusMessage.value = 'Location set from search.'
  } catch {
    statusMessage.value = 'Search failed. Please try again.'
  } finally {
    isSearching.value = false
  }
}

function setUserLocation(lat, lng) {
  userLocation.value = { lat, lng }
  renderMarkers()
  if (map.value) {
    map.value.setView([lat, lng], 14)
  }
}

function renderMarkers() {
  if (!map.value) return

  placeMarkers.value.forEach((marker) => marker.remove())
  placeMarkers.value = []

  if (userMarker.value) {
    userMarker.value.remove()
    userMarker.value = null
  }
  if (userRadius.value) {
    userRadius.value.remove()
    userRadius.value = null
  }

  if (userLocation.value) {
    const youIcon = L.divIcon({
      className: 'user-location-icon-wrapper',
      html: '<span class="user-location-dot"></span>',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    })

    userMarker.value = L.marker([userLocation.value.lat, userLocation.value.lng], { icon: youIcon })
      .addTo(map.value)
      .bindPopup('<strong>Your location</strong>')

    userRadius.value = L.circle([userLocation.value.lat, userLocation.value.lng], {
      radius: 130,
      color: '#2f80ed',
      fillColor: '#2f80ed',
      fillOpacity: 0.12,
      weight: 1.3,
    }).addTo(map.value)
  }

  visiblePlaces.value.forEach((place) => {
    const markerColor = getCategoryMarkerColor(place)
    const placeIcon = L.divIcon({
      className: 'place-marker-icon-wrapper',
      html: `<span class="place-marker-dot" style="background:${markerColor};"></span>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })

    const marker = L.marker([place.lat, place.lng])
      .setIcon(placeIcon)
      .addTo(map.value)
      .bindPopup(
        `<strong>${escapeHtml(place.name)}</strong><br/>${escapeHtml(place.category || place.sourceLabel || 'Place')}<br/>Opening: ${escapeHtml(place.openingHours || 'Not provided')}<br/>Distance from you: ${formatDistance(place.distanceKm)}`
      )
    placeMarkers.value.push(marker)
  })
}

function setActiveTab(tabId) {
  activeTab.value = tabId
  renderMarkers()
}

function getCategoryMarkerColor(place) {
  if (place.sourceId === 'libraries') return '#2f80ed'
  if (place.sourceId === 'coworking') return '#e74c3c'
  if (place.sourceId === 'landmarks') return '#27ae60'
  return '#8e8e8e'
}

function formatDistance(km) {
  return `${km.toFixed(2)} km`
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180
  const earthRadius = 6371

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadius * c
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

onMounted(async () => {
  await nextTick()

  if (!mapEl.value) return
  map.value = L.map(mapEl.value, {
    zoomControl: true,
    attributionControl: true,
  }).setView([-37.8136, 144.9631], 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map.value)

  await loadAllPlaces()
  renderMarkers()
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
    map.value = null
  }
})
</script>

<style scoped>
.panel {
  padding-top: 8px;
}

.back-btn {
  border: none;
  background: none;
  cursor: pointer;
  margin-bottom: 18px;
  font-size: 15px;
}

h2 {
  margin: 0;
  font-size: 26px;
  color: #2f261f;
}

.sub {
  color: #7b6a5c;
  margin: 10px 0 16px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-row {
  display: flex;
  gap: 8px;
}

.location-input {
  flex: 1;
  border: 1px solid #d8c7ba;
  border-radius: 10px;
  padding: 10px 12px;
  font-family: inherit;
}

.locate-btn,
.search-btn {
  border: 1px solid #b66a48;
  background: #fff7f2;
  color: #6d422d;
  border-radius: 10px;
  padding: 9px 12px;
  cursor: pointer;
  font-family: inherit;
}

.locate-btn:disabled,
.search-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.status-message {
  margin: 10px 0 0;
  color: #6d422d;
  font-size: 14px;
}

.tabs {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tab-btn {
  border: 1px solid #d7c7bb;
  background: #fff;
  color: #6a4a38;
  border-radius: 999px;
  padding: 7px 12px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
}

.tab-btn--active {
  border-color: #b66a48;
  background: #fff2e9;
  color: #5f351f;
}

.content-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 14px;
  align-items: start;
}

.map {
  min-height: 420px;
  width: 100%;
  border-radius: 14px;
  border: 1px solid #e8ddd4;
}

.results {
  background: #fffaf7;
  border: 1px solid #eadfd7;
  border-radius: 14px;
  padding: 12px;
  min-height: 420px;
  max-height: 420px;
  overflow: auto;
}

.results h3 {
  margin: 0 0 10px;
  font-size: 17px;
  color: #38281f;
}

.empty-text {
  color: #7b6a5c;
  margin: 0;
}

.places-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.place-card {
  border: 1px solid #ecded2;
  border-radius: 10px;
  background: white;
  padding: 10px;
}

.place-name {
  margin: 0 0 5px;
  font-weight: 700;
  color: #2f261f;
}

.place-meta {
  margin: 0;
  color: #6e5a4a;
  font-size: 13.5px;
}

.place-pin {
  margin-right: 4px;
}

:deep(.user-location-dot) {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #2f80ed;
  border: 2.5px solid #ffffff;
  box-shadow:
    0 0 0 6px rgba(47, 128, 237, 0.2),
    0 2px 10px rgba(24, 84, 163, 0.35);
}

:deep(.place-marker-dot) {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.28);
}

@media (max-width: 960px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
