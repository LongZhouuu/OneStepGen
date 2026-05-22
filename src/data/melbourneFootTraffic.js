/** City of Melbourne Open Data — Explore API v2.1 (normally CORS: *).
 *
 * If the browser sees "Failed to fetch" when refreshing crowd data, deployers may set
 * VITE_MELBOURNE_ODATA_BASE=/melbourne-ods-api/api/explore/v2.1/catalog/datasets
 * — see vite proxy `melbourne-ods-api` forwarding to https://data.melbourne.vic.gov.au .
 */

const SENSOR_DATASET = 'pedestrian-counting-system-sensor-locations'
const COUNTS_DATASET = 'pedestrian-counting-system-past-hour-counts-per-minute'

/** Max distance (km) to accept a sensor as representative of a POI’s foot traffic */
export const NEAREST_SENSOR_MAX_KM = 0.4

/** City feed publishes new minute rows on roughly this cadence — used for walk routing freshness. */
export const CROWD_FEED_UPDATE_MINUTES = 15

/** Melbourne Explore API v2.1 enforces -1 ≤ limit ≤ 100 for many datasets */
const PAGE_SIZE = 100

/**
 * @param {string} pathAndQueryWithoutLimit — dataset path segment with optional ?where=&order_by=...
 * @returns {Promise<object[]>}
 */
/** Melbourne API caps page size at 100 — loop until a short page is returned. */
async function fetchAllPagedRows(pathAndQueryWithoutLimit) {
  const glue = pathAndQueryWithoutLimit.includes('?') ? '&' : '?'
  /** @type {object[]} */
  const all = []
  const maxIterations = 200
  for (let i = 0; i < maxIterations; i += 1) {
    const offset = i * PAGE_SIZE
    const path = `${pathAndQueryWithoutLimit}${glue}limit=${PAGE_SIZE}&offset=${offset}`
    const data = await fetchJsonDataset(path)
    const batch = Array.isArray(data?.results) ? data.results : []
    all.push(...batch)
    if (batch.length < PAGE_SIZE) break
  }
  return all
}

function melbourneDatasetBaseUrl() {
  const fromEnv =
    typeof import.meta !== 'undefined' && typeof import.meta.env?.VITE_MELBOURNE_ODATA_BASE === 'string'
      ? import.meta.env.VITE_MELBOURNE_ODATA_BASE.trim()
      : ''
  const fallback =
    'https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets'

  let base = (fromEnv || fallback).replace(/\/$/, '')
  if (typeof window !== 'undefined' && base.startsWith('/')) {
    base = `${window.location.origin}${base}`
  }
  return base
}

async function fetchJsonDataset(pathAndQuery, { retries = 2 } = {}) {
  const url = `${melbourneDatasetBaseUrl()}/${pathAndQuery}`
  let lastMessage = ''

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const res = await fetch(url, {
        credentials: 'omit',
        mode: 'cors',
        cache: 'no-store',
      })
      const text = await res.text()

      let data = null
      try {
        data = text ? JSON.parse(text) : null
      } catch {
        lastMessage = 'Invalid JSON from Melbourne Open Data'
        continue
      }

      if (data && typeof data === 'object') {
        if (data.error_code && data.message) {
          lastMessage = String(data.message)
          continue
        }
      }

      if (!res.ok) {
        lastMessage = `Melbourne HTTP ${res.status}`
        continue
      }

      return data
    } catch (e) {
      const msg =
        typeof e?.message === 'string' ? e.message : String(e)
      lastMessage = msg.includes('Failed to fetch') ? 'Failed to fetch (offline, blocked, or CORS/policy)' : msg
    }

    if (attempt < retries) {
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)))
    }
  }

  throw new Error(lastMessage || 'Melbourne Open Data request failed')
}

function minutesAgoIsoUtcForWhere(minutes) {
  const d = new Date(Date.now() - minutes * 60 * 1000)
  return d.toISOString().slice(0, 19)
}

function aggregateVolumeFromGroupedRow(row) {
  const direct = row['sum(total_of_directions)']
  if (direct != null && Number.isFinite(Number(direct))) return Number(direct)
  const fallbackKey = Object.keys(row).find((k) => k.includes('sum('))
  if (!fallbackKey) return 0
  const n = Number(row[fallbackKey])
  return Number.isFinite(n) ? n : 0
}

function groupedRowsToVolumeMap(results) {
  const volumeByLocationId = new Map()
  for (const row of results) {
    const locationId = Number(row.location_id)
    if (!Number.isFinite(locationId)) continue
    volumeByLocationId.set(locationId, aggregateVolumeFromGroupedRow(row))
  }
  return volumeByLocationId
}

function rowsToVolumeMapFromRawMinutes(results) {
  const volumeByLocationId = new Map()
  for (const row of results) {
    const locationId = Number(row.location_id)
    const add = Number(row.total_of_directions)
    if (!Number.isFinite(locationId)) continue
    if (!Number.isFinite(add)) continue
    volumeByLocationId.set(locationId, (volumeByLocationId.get(locationId) ?? 0) + add)
  }
  return volumeByLocationId
}

/**
 * Prefer server-side aggregation; fall back to summing minute rows client-side when needed.
 */
async function fetchCountsVolumeMap(cutoffIso) {
  const whereEncoded = encodeURIComponent(`sensing_datetime >= '${cutoffIso}'`)
  const groupBase = `${COUNTS_DATASET}/records?where=${whereEncoded}&group_by=location_id&select=location_id,sum(total_of_directions)`

  try {
    const rows = await fetchAllPagedRows(groupBase)
    if (!rows.length) throw new Error('No aggregate rows')
    return groupedRowsToVolumeMap(rows)
  } catch (_) {
    const minuteBase = `${COUNTS_DATASET}/records?where=${whereEncoded}&order_by=sensing_datetime%20DESC`
    const rawRows = await fetchAllPagedRows(minuteBase)
    if (!rawRows.length) throw new Error('No minute rows for fallback')
    return rowsToVolumeMapFromRawMinutes(rawRows)
  }
}

async function fetchAllSensorLocations() {
  const rows = await fetchAllPagedRows(`${SENSOR_DATASET}/records`)
  return { results: rows }
}

async function fetchLatestSensingTimeDataset() {
  try {
    const path = `${COUNTS_DATASET}/records?order_by=sensing_datetime%20DESC&limit=1`
    const data = await fetchJsonDataset(path, { retries: 1 })
    const raw = data?.results?.[0]?.sensing_datetime
    if (!raw) return null
    const d = new Date(raw)
    return Number.isNaN(d.getTime()) ? null : d
  } catch {
    return null
  }
}

export function haversineKm(lat1, lon1, lat2, lon2) {
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

export function volumeTertileBounds(volumes) {
  const sorted = volumes.filter((v) => v > 0).sort((a, b) => a - b)
  if (sorted.length < 4) {
    return { lowMax: 200, highMin: 700, mode: 'fixed' }
  }
  const hi = sorted.length - 1
  const lowMax = sorted[Math.floor(hi * 0.33)]
  const highMin = sorted[Math.floor(hi * 0.67)]
  return { lowMax, highMin: Math.max(highMin, lowMax + 1), mode: 'tertile' }
}

export function volumeToCrowdLevel(volume, bounds) {
  if (volume <= 0) return 'Low'
  if (volume <= bounds.lowMax) return 'Low'
  if (volume < bounds.highMin) return 'Medium'
  return 'High'
}

export function footTrafficMarkerColor(volume, sensorStatus) {
  if (sensorStatus && sensorStatus !== 'A') return '#95a5a6'
  if (!volume) return '#27ae60'
  if (volume < 200) return '#82c91e'
  if (volume < 700) return '#f39c12'
  return '#c0392b'
}

/**
 * @param {{ windowMinutes?: number }} [options] — how far back to sum minute-level counts (default 60 for place labels).
 * @returns {{ sensors: Array<{ lat: number, lng: number, locationId: number, volume: number, status: string }>, updatedAt: Date | null, ok: boolean, errorMessage?: string, windowMinutes: number }}
 */
export async function fetchMelbourneCrowdContext(options = {}) {
  const windowMinutes = options.windowMinutes ?? 60
  const cutoff = minutesAgoIsoUtcForWhere(windowMinutes)

  const [countsResult, sensorsResult, updatedProbeResult] = await Promise.allSettled([
    fetchCountsVolumeMap(cutoff),
    fetchAllSensorLocations(),
    fetchLatestSensingTimeDataset(),
  ])

  const errorParts = []
  if (countsResult.status === 'rejected') {
    const m =
      countsResult.reason?.message != null
        ? String(countsResult.reason.message)
        : 'crowd totals unavailable'
    errorParts.push(`Crowd totals: ${m}`)
  }
  if (sensorsResult.status === 'rejected') {
    const m =
      sensorsResult.reason?.message != null
        ? String(sensorsResult.reason.message)
        : 'sensors list unavailable'
    errorParts.push(`Sensors: ${m}`)
  }
  if (errorParts.length) {
    return {
      sensors: [],
      updatedAt: null,
      ok: false,
      errorMessage: errorParts.join(' · '),
      windowMinutes,
    }
  }

  const volumeByLocationId = countsResult.value
  const sensorsRes = sensorsResult.value
  const updatedAtProbe =
    updatedProbeResult.status === 'fulfilled' ? updatedProbeResult.value : null

  const sensors = (sensorsRes.results || [])
    .map((sensor) => {
      const lat = Number(sensor.latitude ?? sensor.location?.lat)
      const lng = Number(sensor.longitude ?? sensor.location?.lon)
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null

      const locationId = Number(sensor.location_id)
      const volume = Number.isFinite(locationId)
        ? volumeByLocationId.get(locationId) ?? 0
        : 0
      const status = sensor.status != null ? String(sensor.status) : ''

      return { lat, lng, locationId, volume, status }
    })
    .filter(Boolean)

  return {
    sensors,
    updatedAt: updatedAtProbe ?? new Date(),
    ok: true,
    windowMinutes,
  }
}

export function estimateCrowdForPoint(lat, lng, sensors, bounds, maxKm = NEAREST_SENSOR_MAX_KM) {
  let best = null
  let bestD = Infinity
  for (const s of sensors) {
    if (s.status !== 'A') continue
    const d = haversineKm(lat, lng, s.lat, s.lng)
    if (d < bestD && d <= maxKm) {
      bestD = d
      best = s
    }
  }
  if (!best) {
    return {
      crowdAvailable: false,
      crowdLevelLabel: null,
      crowdVolume: null,
      sensorDistanceKm: null,
    }
  }

  const crowdLevelLabel = volumeToCrowdLevel(best.volume, bounds)
  return {
    crowdAvailable: true,
    crowdLevelLabel,
    crowdVolume: best.volume,
    sensorDistanceKm: bestD,
  }
}
