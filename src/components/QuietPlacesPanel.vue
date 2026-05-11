<template>
  <div class="panel">
    <h2>Melbourne CBD Focus Map</h2>
    <p class="sub">
      Find nearby coworking, library, and relax spots. Crowd levels use City of Melbourne pedestrian
      sensors near each place.
    </p>

    <div class="controls">
      <div class="location-actions">
        <div class="search-row">
          <input
            v-model.trim="locationQuery"
            type="text"
            class="location-input"
            placeholder="Enter Melbourne address or suburb"
            @input="onLocationInput"
            @focus="showSuggestions = true"
            @keydown.enter.prevent="searchLocation"
          />
          <button class="search-btn" type="button" @click="searchLocation" :disabled="isSearching">
            {{ isSearching ? 'Searching...' : 'Search' }}
          </button>
        </div>
        <button class="locate-btn" type="button" @click="useBrowserLocation" :disabled="isLocating">
          {{ isLocating ? 'Getting location...' : 'Use my location' }}
        </button>
      </div>
      <ul v-if="showSuggestions && locationSuggestions.length" class="suggestions-list">
        <li
          v-for="(item, index) in locationSuggestions"
          :key="`${item.lat}-${item.lon}-${index}`"
          class="suggestion-item"
          role="button"
          tabindex="0"
          @click="selectSuggestion(item)"
          @keydown.enter.prevent="selectSuggestion(item)"
        >
          {{ item.display_name }}
        </li>
      </ul>
    </div>

    <p v-if="selectedAddress" class="selected-address">
      Selected address: {{ selectedAddress }}
    </p>

    <p v-if="statusMessage" class="status-message">{{ statusMessage }}</p>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="tab-btn"
        :class="{ 'tab-btn--active': activeTab === tab.id }"
        :style="getTabStyle(tab.id, activeTab === tab.id)"
        @click="setActiveTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="crowd-toolbar">
      <button
        type="button"
        class="refresh-crowd-btn"
        :disabled="isRefreshingCrowd || isLoadingData"
        @click="refreshCrowdData"
      >
        {{ isRefreshingCrowd ? 'Refreshing…' : 'Refresh Crowd Data' }}
      </button>
      <button type="button" class="help-link" @click="showCrowdHelp = true">What is crowd level?</button>
      <p v-if="crowdUpdatedAtDateTimeLabel" class="crowd-updated-summary">
        Crowd data updated: {{ crowdUpdatedAtDateTimeLabel }}
      </p>
    </div>

    <div class="content-grid">
      <div ref="mapEl" class="map"></div>

      <div class="results">
        <div class="results-fixed">
          <h3>{{ nearbyHeading }}</h3>
          <div v-if="userLocation && !isLoadingData" class="sort-row">
            <label class="sort-label" for="quiet-sort">Sort by</label>
            <select
              id="quiet-sort"
              v-model="sortMode"
              class="sort-select"
              @change="onSortChange"
            >
              <option value="recommended">Recommended (crowd + distance)</option>
              <option value="quietest">Quietest (Least Crowded)</option>
              <option value="nearest">Nearest</option>
            </select>
          </div>
          <div v-if="selectedPlace" class="selected-place-row">
            <p class="selected-place-text">
              Selected: <strong>{{ selectedPlace.name }}</strong>
            </p>
            <button class="directions-btn" type="button" @click="openNavigationPopup">
              Get directions
            </button>
          </div>
        </div>
        <div class="results-scroll">
          <p v-if="!userLocation" class="empty-text">Set your location to see nearby places.</p>
          <p v-else-if="isLoadingData" class="empty-text">Loading places from your datasets...</p>
          <p v-else-if="!visiblePlaces.length" class="empty-text">
            No places loaded yet. Put CSV files in `public/focus-data` and verify paths in
            `src/data/focusMapSources.js`.
          </p>

          <ul v-else class="places-list">
          <li
            v-for="place in visiblePlaces"
            :key="place.id"
            class="place-card"
            role="button"
            tabindex="0"
            @click="focusPlaceOnMap(place)"
            @keydown.enter.prevent="focusPlaceOnMap(place)"
            @keydown.space.prevent="focusPlaceOnMap(place)"
          >
            <p class="place-name">{{ place.name }}</p>
            <p v-if="place.id === recommendedQuietPlaceId" class="recommended-badge" role="status">
              Recommended Quiet Place
            </p>
            <p
              v-if="place.id === recommendedQuietPlaceId"
              class="place-meta recommended-reason"
            >
              Recommended because it balances lower crowd with shorter distance.
            </p>
            <p class="place-meta">
              <span class="place-pin" aria-hidden="true">📍</span>
              {{ place.category || 'Workspace' }}
            </p>
            <p class="place-meta">Distance from you: {{ formatDistance(place.distanceKm) }}</p>
            <p class="place-meta crowd-line">
              <span class="crowd-inline-label">Crowd level:</span>
              <strong v-if="place.crowdAvailable" class="crowd-level-pill">{{ place.crowdLevelLabel }}</strong>
              <span v-else class="crowd-na">Crowd level not available</span>
            </p>
            <p v-if="crowdUpdatedAtLabel" class="place-meta crowd-updated-line">
              Crowd updated at {{ crowdUpdatedAtLabel }}
            </p>
            <p v-if="place.website" class="place-meta">
              Website:
              <a :href="place.website" target="_blank" rel="noopener noreferrer" @click.stop>Visit site</a>
            </p>
            <p v-if="place.address" class="place-meta">{{ place.address }}</p>
          </li>
        </ul>
        </div>
      </div>
    </div>

    <div v-if="showNavigationPopup && selectedPlace" class="nav-popup-overlay" @click.self="closeNavigationPopup">
      <div class="nav-popup">
        <h3>Navigate to {{ selectedPlace.name }}</h3>
        <p class="nav-popup-sub">Choose how you want to travel:</p>

        <div class="nav-mode-actions">
          <button type="button" class="nav-mode-btn" @click="openDirections('walk')">
            Walk
          </button>
          <button type="button" class="nav-mode-btn" @click="openDirections('car')">
            Drive
          </button>
          <button type="button" class="nav-mode-btn" @click="openDirections('transit')">
            Public transport
          </button>
        </div>

        <p class="nav-google-note">This will take you to Google Maps for turn-by-turn directions.</p>

        <button type="button" class="nav-exit-btn" @click="closeNavigationPopup">
          Exit navigation mode
        </button>
      </div>
    </div>

    <div v-if="showCrowdHelp" class="nav-popup-overlay" @click.self="showCrowdHelp = false">
      <div class="nav-popup">
        <h3>What is crowd level?</h3>
        <p class="nav-popup-sub">
          Crowd level is based on City of Melbourne pedestrian count data published as open data. Each
          place is matched to the nearest active foot-traffic sensor (within about 400 metres), using
          that sensor’s pedestrian totals aggregated over roughly the past hour (from readings in the
          feed). Levels <strong>Low</strong>, <strong>Medium</strong>, and <strong>High</strong> compare
          that sensor’s volume to others at the moment. The city publishes this information on roughly
          an hourly rhythm (with fine-grained rows as updates arrive — often about every 15 minutes);
          use “Refresh Crowd Data” to pull the latest. The “Crowd updated at” time reflects the newest
          reading we received for the feed after your last refresh.
        </p>
        <button type="button" class="nav-exit-btn" @click="showCrowdHelp = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { focusMapSources } from '@/data/focusMapSources'
import {
  estimateCrowdForPoint,
  fetchMelbourneCrowdContext,
  footTrafficMarkerColor,
  haversineKm,
  volumeTertileBounds,
} from '@/data/melbourneFootTraffic'


const placeSources = focusMapSources.filter((source) => Boolean(source.url))

const RECOMMEND_MAX_KM = 8

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
const selectedPlace = ref(null)
const showNavigationPopup = ref(false)
const selectedAddress = ref('')
const locationSuggestions = ref([])
const showSuggestions = ref(false)
let suggestionTimer = null

const placeMarkers = ref([])
const placeMarkerById = ref({})
const userMarker = ref(null)
const userRadius = ref(null)
const allPlaces = ref([])
const crowdContext = ref({ sensors: [], updatedAt: null, ok: false })
const isRefreshingCrowd = ref(false)
const sortMode = ref('recommended')
const showCrowdHelp = ref(false)

const tabs = computed(() => focusMapSources.map((source) => ({ id: source.id, label: source.label })))
const nearbyHeading = computed(() => {
  const activeSource = focusMapSources.find((source) => source.id === activeTab.value)
  return activeSource ? `Nearby ${activeSource.label}` : 'Nearby Places'
})

const crowdUpdatedAtLabel = computed(() => {
  const d = crowdContext.value.updatedAt
  if (!d) return ''
  try {
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  } catch {
    return ''
  }
})

const crowdUpdatedAtDateTimeLabel = computed(() => {
  const d = crowdContext.value.updatedAt
  if (!d) return ''
  try {
    return d.toLocaleString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
})

const volumeBounds = computed(() => {
  const vols = crowdContext.value.sensors
    .filter((s) => s.status === 'A')
    .map((s) => s.volume)
  return volumeTertileBounds(vols)
})

const placesWithCrowd = computed(() => {
  const ctx = crowdContext.value
  const sensors = ctx.sensors || []
  const bounds = volumeBounds.value
  const ok = ctx.ok

  return allPlaces.value.map((place) => {
    if (!ok || !sensors.length) {
      return {
        ...place,
        crowdAvailable: false,
        crowdLevelLabel: null,
        crowdVolume: null,
        sensorDistanceKm: null,
      }
    }
    return { ...place, ...estimateCrowdForPoint(place.lat, place.lng, sensors, bounds) }
  })
})

const categoryPlacesWithDistance = computed(() => {
  if (!userLocation.value) return []
  const u = userLocation.value
  return placesWithCrowd.value
    .filter((place) => place.sourceId === activeTab.value)
    .map((place) => ({
      ...place,
      distanceKm: haversineKm(u.lat, u.lng, place.lat, place.lng),
    }))
})

const recommendedQuietPlaceId = computed(() => {
  const withData = categoryPlacesWithDistance.value.filter((p) => p.crowdAvailable)
  if (!withData.length) return null
  const maxV = Math.max(1, ...withData.map((p) => p.crowdVolume))
  let best = withData[0]
  let bestScore = recommendScore(best, maxV, RECOMMEND_MAX_KM)
  for (const p of withData.slice(1)) {
    const score = recommendScore(p, maxV, RECOMMEND_MAX_KM)
    if (score < bestScore) {
      best = p
      bestScore = score
    } else if (score === bestScore && p.distanceKm < best.distanceKm) {
      best = p
      bestScore = score
    }
  }
  return best.id
})

function recommendScore(place, maxV, maxD) {
  if (!place.crowdAvailable) return 9999
  const cv = place.crowdVolume / maxV
  const cd = Math.min(place.distanceKm, maxD) / maxD
  return 0.6 * cv + 0.4 * cd
}

const visiblePlaces = computed(() => {
  if (!userLocation.value || !activeTab.value) return []
  const list = categoryPlacesWithDistance.value.map((p) => ({ ...p }))

  if (sortMode.value === 'nearest') {
    list.sort((a, b) => a.distanceKm - b.distanceKm)
  } else if (sortMode.value === 'quietest') {
    list.sort((a, b) => {
      if (a.crowdAvailable !== b.crowdAvailable) {
        return a.crowdAvailable ? -1 : 1
      }
      if (!a.crowdAvailable) return 0
      if (a.crowdVolume !== b.crowdVolume) return a.crowdVolume - b.crowdVolume
      return a.distanceKm - b.distanceKm
    })
  } else {
    const withCrowd = list.filter((p) => p.crowdAvailable)
    const maxV = Math.max(1, ...withCrowd.map((p) => p.crowdVolume))
    list.sort((a, b) => {
      const sa = recommendScore(a, maxV, RECOMMEND_MAX_KM)
      const sb = recommendScore(b, maxV, RECOMMEND_MAX_KM)
      if (sa !== sb) return sa - sb
      return a.distanceKm - b.distanceKm
    })
  }
  return list.slice(0, 20)
})

watch(visiblePlaces, () => {
  nextTick(() => renderMarkers())
})

async function loadAllPlaces() {
  isLoadingData.value = true
  statusMessage.value = ''

  const loaded = await Promise.all(placeSources.map(loadSource))
  allPlaces.value = loaded.flat()
  isLoadingData.value = false
}

async function loadCrowdData() {
  crowdContext.value = await fetchMelbourneCrowdContext()
}

function crowdErrorSuffix() {
  const detail = crowdContext.value.errorMessage
  return detail ? ` — ${detail}` : ''
}

async function refreshCrowdData() {
  isRefreshingCrowd.value = true
  statusMessage.value = ''
  try {
    crowdContext.value = await fetchMelbourneCrowdContext()
    statusMessage.value = crowdContext.value.ok
      ? 'Crowd data updated.'
      : `Could not refresh crowd data${crowdErrorSuffix()} Crowd labels may stay unavailable until the request succeeds — check your connection, or use a proxy (VITE_MELBOURNE_ODATA_BASE → /melbourne-ods-api ; see melbourneFootTraffic.js).`
  } finally {
    isRefreshingCrowd.value = false
  }
  renderMarkers()
}

function onSortChange() {
  renderMarkers()
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
    website: normalizeWebsite(getField(row, source.fieldMap.website)),
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

function normalizeWebsite(rawValue) {
  if (!rawValue) return ''
  const trimmed = String(rawValue).trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.includes('.')) return `https://${trimmed}`
  return ''
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

    selectedAddress.value = first.display_name || locationQuery.value
    showSuggestions.value = false
    setUserLocation(Number(first.lat), Number(first.lon))
    statusMessage.value = 'Location set from search.'
  } catch {
    statusMessage.value = 'Search failed. Please try again.'
  } finally {
    isSearching.value = false
  }
}

function onLocationInput() {
  showSuggestions.value = true
  if (suggestionTimer) {
    clearTimeout(suggestionTimer)
  }
  suggestionTimer = setTimeout(() => {
    void fetchLocationSuggestions()
  }, 280)
}

async function fetchLocationSuggestions() {
  if (!locationQuery.value || locationQuery.value.length < 3) {
    locationSuggestions.value = []
    return
  }

  try {
    const encoded = encodeURIComponent(`${locationQuery.value}, Melbourne`)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encoded}`
    )
    if (!res.ok) return
    const results = await res.json()
    locationSuggestions.value = Array.isArray(results) ? results : []
  } catch {
    locationSuggestions.value = []
  }
}

function selectSuggestion(item) {
  if (!item) return
  locationQuery.value = item.display_name || locationQuery.value
  selectedAddress.value = item.display_name || ''
  showSuggestions.value = false
  locationSuggestions.value = []
  setUserLocation(Number(item.lat), Number(item.lon))
  statusMessage.value = 'Location set from suggestion.'
}

function setUserLocation(lat, lng) {
  userLocation.value = { lat, lng }
  void updateSelectedAddress(lat, lng)
  renderMarkers()
  if (map.value) {
    map.value.setView([lat, lng], 14)
  }
}

async function updateSelectedAddress(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`
    const res = await fetch(url)
    if (!res.ok) return
    const data = await res.json()
    if (data?.display_name) {
      selectedAddress.value = data.display_name
    }
  } catch {
    // Keep location usable even if reverse geocoding fails.
  }
}

function renderMarkers() {
  if (!map.value) return

  placeMarkers.value.forEach((marker) => marker.remove())
  placeMarkers.value = []
  placeMarkerById.value = {}
  selectedPlace.value = null
  showNavigationPopup.value = false

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

    const crowdLevelText = place.crowdAvailable
      ? `<br/>Crowd level: ${escapeHtml(place.crowdLevelLabel || '')}`
      : '<br/>Crowd level not available'
    const crowdUpdatedLine =
      crowdUpdatedAtLabel.value !== ''
        ? `<br/>Crowd updated at ${escapeHtml(crowdUpdatedAtLabel.value)}`
        : ''
    const marker = L.marker([place.lat, place.lng])
      .setIcon(placeIcon)
      .addTo(map.value)
      .bindPopup(
        `<strong>${escapeHtml(place.name)}</strong><br/>${escapeHtml(place.category || place.sourceLabel || 'Place')}${
          place.website
            ? `<br/>Website: <a href="${escapeHtml(place.website)}" target="_blank" rel="noopener noreferrer">Visit site</a>`
            : ''
        }${crowdLevelText}${crowdUpdatedLine}<br/>Distance from you: ${formatDistance(place.distanceKm)}`
      )
    marker.on('click', () => {
      selectedPlace.value = place
    })
    placeMarkers.value.push(marker)
    placeMarkerById.value[place.id] = marker
  })
}

function setActiveTab(tabId) {
  activeTab.value = tabId
  renderMarkers()
}

function focusPlaceOnMap(place) {
  selectedPlace.value = place
  if (!map.value) return
  const marker = placeMarkerById.value[place.id]
  map.value.setView([place.lat, place.lng], 16, { animate: true })
  if (marker) {
    marker.openPopup()
  }
}

function openNavigationPopup() {
  if (!selectedPlace.value || !userLocation.value) return
  showNavigationPopup.value = true
}

function closeNavigationPopup() {
  showNavigationPopup.value = false
}

function openDirections(mode) {
  if (!selectedPlace.value || !userLocation.value) return

  let travelMode = 'driving'
  if (mode === 'walk') travelMode = 'walking'
  if (mode === 'transit') travelMode = 'transit'

  const from = `${userLocation.value.lat},${userLocation.value.lng}`
  const to = `${selectedPlace.value.lat},${selectedPlace.value.lng}`
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&travelmode=${travelMode}`
  window.open(mapsUrl, '_blank', 'noopener,noreferrer')
}

function getCategoryMarkerColor(place) {
  if (place.crowdAvailable) {
    return footTrafficMarkerColor(place.crowdVolume ?? 0, 'A')
  }
  if (place.sourceId === 'libraries') return '#2f80ed'
  if (place.sourceId === 'coworking') return '#e74c3c'
  if (place.sourceId === 'relax') return '#27ae60'
  return '#8e8e8e'
}

function getTabStyle(tabId, isActive) {
  const palette = {
    libraries: { bg: '#e9f2ff', border: '#2f80ed', text: '#1f5fae' },
    coworking: { bg: '#ffeeea', border: '#e74c3c', text: '#b13a2c' },
    relax: { bg: '#ecf9ef', border: '#27ae60', text: '#1c8448' },
  }

  const colors = palette[tabId] || { bg: '#fff2e9', border: '#b66a48', text: '#5f351f' }
  if (isActive) {
    return {
      background: colors.bg,
      borderColor: colors.border,
      color: colors.text,
    }
  }
  return {
    borderColor: '#d7c7bb',
    color: '#6a4a38',
    background: '#fff',
  }
}

function formatDistance(km) {
  return `${km.toFixed(2)} km`
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

  await Promise.all([loadAllPlaces(), loadCrowdData()])
  statusMessage.value = crowdContext.value.ok
    ? `Loaded ${allPlaces.value.length} places with live crowd estimates.`
    : `Loaded ${allPlaces.value.length} places. Crowd data was not available${crowdErrorSuffix()} Levels will stay unavailable until a refresh succeeds.`
  renderMarkers()
})

onUnmounted(() => {
  if (suggestionTimer) {
    clearTimeout(suggestionTimer)
    suggestionTimer = null
  }
  if (map.value) {
    map.value.remove()
    map.value = null
  }
})
</script>

<style scoped>
.panel {
<<<<<<< HEAD
  padding-top: 8px;
=======
  padding-top: 0;
  padding-bottom: 10px;
>>>>>>> main
}

h2 {
  margin: 0;
  font-size: 26px;
  color: #2f261f;
}

.sub {
  color: #7b6a5c;
  margin: 8px 0 12px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.location-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-row {
  display: flex;
  flex: 1;
  border: 1px solid #d8c7ba;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
}

.suggestions-list {
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
  border: 1px solid #eadfd7;
  border-radius: 10px;
  background: #fffdfc;
  max-height: 170px;
  overflow: auto;
}

.suggestion-item {
  padding: 9px 10px;
  cursor: pointer;
  border-bottom: 1px solid #f2e9e3;
  font-size: 13.5px;
  color: #614c3d;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover,
.suggestion-item:focus-visible {
  background: #f9f1eb;
  outline: none;
}

.location-input {
  flex: 1;
  border: none;
  padding: 10px 12px;
  font-family: inherit;
  min-width: 0;
}

.location-input:focus {
  outline: none;
}

.locate-btn,
.search-btn {
  border: 1px solid #d0bfb3;
  background: #fff7f2;
  color: #6d422d;
  border-radius: 10px;
  padding: 9px 14px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
}

.locate-btn {
  white-space: nowrap;
  background: #ffffff;
  min-width: 138px;
}

.search-btn {
  border: none;
  border-left: 1px solid #e2d5cc;
  border-radius: 0;
  background: #fff7f2;
  min-width: 84px;
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

.selected-address {
  margin: 10px 0 0;
  color: #6d422d;
  font-size: 13.5px;
  background: #f9f1eb;
  border: 1px solid #e9ddd4;
  border-radius: 10px;
  padding: 8px 10px;
}

.crowd-toolbar {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
}

.refresh-crowd-btn {
  border: 1px solid #5c4a8a;
  background: #f4f0ff;
  color: #4b3a74;
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
}

.refresh-crowd-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.help-link {
  border: none;
  background: none;
  padding: 0;
  color: #6d422d;
  text-decoration: underline;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
}

.crowd-updated-summary {
  margin: 0;
  font-size: 12.5px;
  color: #6d5b8d;
}

.sort-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0;
  flex-wrap: wrap;
}

.sort-label {
  font-size: 13px;
  color: #614c3d;
}

.sort-select {
  flex: 1;
  min-width: 160px;
  border: 1px solid #d8c7ba;
  border-radius: 10px;
  padding: 6px 10px;
  font-family: inherit;
  font-size: 13px;
  color: #38281f;
  background: #fff;
}

.recommended-badge {
  margin: 0 0 6px;
  display: inline-block;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #1c6840;
  background: #dcf5e8;
  border: 1px solid #8fd4b8;
}

.recommended-reason {
  margin: 0 0 6px;
  font-size: 13px;
  color: #2d6e4e;
}

.crowd-line {
  margin-top: 2px;
}

.crowd-inline-label {
  margin-right: 6px;
}

.crowd-level-pill {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 6px;
  background: #f0eae4;
  color: #3d2e24;
}

.crowd-na {
  color: #8a7668;
}

.crowd-updated-line {
  font-size: 12.5px;
  color: #7b6a5c;
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
  font-weight: 600;
}

.content-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 14px;
  align-items: stretch;
}

.map {
  height: clamp(300px, 52vh, 520px);
  width: 100%;
  border-radius: 14px;
  border: 1px solid #e8ddd4;
}

.results {
  background: #fffaf7;
  border: 1px solid #eadfd7;
  border-radius: 14px;
  padding: 12px;
  height: clamp(300px, 52vh, 520px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
}

.results-fixed {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.results-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.results-fixed h3 {
  margin: 0;
  font-size: 17px;
  color: #38281f;
}

.selected-place-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: #fff3ea;
  border: 1px solid #eedbcf;
  border-radius: 10px;
  padding: 8px 10px;
  margin-bottom: 0;
}

.selected-place-text {
  margin: 0;
  color: #6e5a4a;
  font-size: 13.5px;
}

.directions-btn {
  border: 1px solid #b66a48;
  background: #fff;
  color: #5f351f;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
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
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
}

.place-card:hover {
  transform: translateY(-1px);
  border-color: #dcc8ba;
  box-shadow: 0 4px 14px rgba(97, 75, 52, 0.1);
}

.place-card:focus-visible {
  outline: 2px solid #b66a48;
  outline-offset: 2px;
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

.nav-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(40, 28, 18, 0.25);
  backdrop-filter: blur(3px);
  z-index: 10010;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.nav-popup {
  width: min(380px, 100%);
  background: #fffaf7;
  border: 1px solid #eadfd7;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 10px 28px rgba(70, 48, 31, 0.2);
}

.nav-popup h3 {
  margin: 0;
  font-size: 18px;
  color: #2f261f;
}

.nav-popup-sub {
  margin: 8px 0 12px;
  color: #6e5a4a;
  font-size: 14px;
}

.nav-mode-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.nav-mode-btn {
  flex: 1 1 30%;
  border: 1px solid #d7c7bb;
  background: #fff;
  color: #5f351f;
  border-radius: 10px;
  padding: 10px 8px;
  cursor: pointer;
  font-family: inherit;
}

.nav-google-note {
  margin: 10px 0 0;
  color: #735f50;
  font-size: 13px;
}

.nav-exit-btn {
  margin-top: 12px;
  width: 100%;
  border: 1px solid #b66a48;
  background: #fff2e9;
  color: #5f351f;
  border-radius: 10px;
  padding: 9px 10px;
  cursor: pointer;
  font-family: inherit;
}

@media (max-width: 960px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .map,
  .results {
    height: clamp(260px, 44vh, 460px);
  }

  .location-actions {
    flex-direction: column;
  }
}
</style>
