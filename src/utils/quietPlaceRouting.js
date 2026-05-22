/**
 * OSRM routing + sensor-weighted pathfinding for quiet walk routes.
 * Walk: A* over a crowd-cost grid, then OSRM foot routing through chosen waypoints.
 * Drive: OSRM driving (fastest road route).
 */

import {
  estimateCrowdForPoint,
  haversineKm,
  volumeTertileBounds,
  volumeToCrowdLevel,
} from '@/data/melbourneFootTraffic'

const defaultOsrmBase = import.meta.env.DEV
  ? '/osrm-api'
  : 'https://router.project-osrm.org'
const OSRM_BASE = (import.meta.env.VITE_OSRM_BASE || defaultOsrmBase).replace(/\/$/, '')

const ROUTE_SAMPLE_INTERVAL_M = 75
const ROUTE_SENSOR_MAX_KM = 0.35
const MAX_DURATION_RATIO = 1.35

/** Lattice columns along the origin→destination line. */
const CORRIDOR_SEGMENTS = 10
/** Lateral offsets (metres, perpendicular to the corridor). */
const CORRIDOR_OFFSETS_M = [0, -90, 90, -170, 170]
/** metres — edge cost multiplier for crowd volume at a lattice node */
const CROWD_COST_WEIGHT = 2.8
/** Default crowd cost when no sensor is nearby (keeps A* traversable). */
const NEUTRAL_CROWD_COST = 420
const MAX_SENSOR_WAYPOINTS = 3
const MIN_WAYPOINT_GAP_M = 100

const PROFILE_BY_MODE = {
  walk: 'foot',
  car: 'driving',
}

/** @returns {string} */
export function osrmProfileForMode(mode) {
  return PROFILE_BY_MODE[mode] || ''
}

function geoJsonLineToLatLngs(line) {
  if (!Array.isArray(line) || !line.length) return []
  return line.map(([lng, lat]) => [lat, lng])
}

function parseOsrmRoute(route, mode) {
  const latLngs = geoJsonLineToLatLngs(route.geometry?.coordinates)
  return {
    latLngs,
    distanceM: route.distance ?? 0,
    durationS: route.duration ?? 0,
    mode,
  }
}

function toRad(deg) {
  return (deg * Math.PI) / 180
}

function toDeg(rad) {
  return (rad * 180) / Math.PI
}

/** Bearing from → to in degrees (0 = north). */
export function bearingDegrees(from, to) {
  const lat1 = toRad(from.lat)
  const lat2 = toRad(to.lat)
  const dLon = toRad(to.lng - from.lng)
  const y = Math.sin(dLon) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

/** Move a point by distanceM along bearingDeg (spherical approximation). */
export function movePoint(lat, lng, bearingDeg, distanceM) {
  const R = 6371000
  const br = toRad(bearingDeg)
  const lat1 = toRad(lat)
  const lng1 = toRad(lng)
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distanceM / R) +
      Math.cos(lat1) * Math.sin(distanceM / R) * Math.cos(br)
  )
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(br) * Math.sin(distanceM / R) * Math.cos(lat1),
      Math.cos(distanceM / R) - Math.sin(lat1) * Math.sin(lat2)
    )
  return { lat: toDeg(lat2), lng: toDeg(lng2) }
}

/** Point along the straight line from → to at fraction t ∈ [0, 1]. */
export function interpolatePoint(from, to, t) {
  return {
    lat: from.lat + (to.lat - from.lat) * t,
    lng: from.lng + (to.lng - from.lng) * t,
  }
}

/**
 * @param {Array<{ lat: number, lng: number, volume: number, status: string }>} activeSensors
 */
function crowdCostAtPoint(lat, lng, activeSensors, bounds) {
  const est = estimateCrowdForPoint(lat, lng, activeSensors, bounds, ROUTE_SENSOR_MAX_KM)
  if (!est.crowdAvailable) return NEUTRAL_CROWD_COST
  const vol = est.crowdVolume ?? 0
  const highPenalty = est.crowdLevelLabel === 'High' ? 280 : est.crowdLevelLabel === 'Medium' ? 60 : 0
  return vol + highPenalty
}

/**
 * Build a corridor lattice: nodes along the direct line with lateral offsets.
 * @returns {Array<{ id: string, seg: number, offIdx: number, lat: number, lng: number, crowdCost: number }>}
 */
export function buildCorridorLattice(from, to, sensors, bounds) {
  const activeSensors = sensors.filter((s) => s.status === 'A')
  const baseBearing = bearingDegrees(from, to)
  const perpBearing = (baseBearing + 90) % 360
  const nodes = []

  for (let seg = 0; seg <= CORRIDOR_SEGMENTS; seg += 1) {
    const t = seg / CORRIDOR_SEGMENTS
    const base = interpolatePoint(from, to, t)
    for (let offIdx = 0; offIdx < CORRIDOR_OFFSETS_M.length; offIdx += 1) {
      const offsetM = CORRIDOR_OFFSETS_M[offIdx]
      const point =
        offsetM === 0 ? base : movePoint(base.lat, base.lng, perpBearing, offsetM)
      const crowdCost = crowdCostAtPoint(point.lat, point.lng, activeSensors, bounds)
      nodes.push({
        id: `${seg}-${offIdx}`,
        seg,
        offIdx,
        lat: point.lat,
        lng: point.lng,
        crowdCost,
      })
    }
  }

  return nodes
}

function latticeNeighbors(node, nodes) {
  const nextSeg = node.seg + 1
  if (nextSeg > CORRIDOR_SEGMENTS) return []
  const out = []
  for (const delta of [-1, 0, 1]) {
    const offIdx = node.offIdx + delta
    if (offIdx < 0 || offIdx >= CORRIDOR_OFFSETS_M.length) continue
    const next = nodes.find((n) => n.seg === nextSeg && n.offIdx === offIdx)
    if (next) out.push(next)
  }
  return out
}

function edgeCostM(fromNode, toNode) {
  const distM = haversineKm(fromNode.lat, fromNode.lng, toNode.lat, toNode.lng) * 1000
  const crowd = (fromNode.crowdCost + toNode.crowdCost) / 2
  return distM + CROWD_COST_WEIGHT * crowd
}

/**
 * A* on the corridor lattice — minimizes distance + crowd exposure.
 * @returns {Array<{ lat: number, lng: number, seg: number, offIdx: number, crowdCost: number }>}
 */
export function findLowCrowdLatticePath(from, to, sensors, bounds) {
  const nodes = buildCorridorLattice(from, to, sensors, bounds)
  const start = nodes.find((n) => n.seg === 0 && n.offIdx === 0) ?? nodes[0]
  const goalSeg = CORRIDOR_SEGMENTS

  const open = new Map([[start.id, start]])
  const cameFrom = new Map()
  const gScore = new Map([[start.id, 0]])

  const heuristic = (node) => haversineKm(node.lat, node.lng, to.lat, to.lng) * 1000

  const fScore = new Map([[start.id, heuristic(start)]])

  while (open.size) {
    let current = null
    let bestF = Infinity
    for (const node of open.values()) {
      const f = fScore.get(node.id) ?? Infinity
      if (f < bestF) {
        bestF = f
        current = node
      }
    }
    if (!current) break

    if (current.seg === goalSeg) {
      const path = [current]
      while (cameFrom.has(path[0].id)) {
        path.unshift(cameFrom.get(path[0].id))
      }
      return path
    }

    open.delete(current.id)

    for (const neighbor of latticeNeighbors(current, nodes)) {
      const tentativeG = (gScore.get(current.id) ?? Infinity) + edgeCostM(current, neighbor)
      if (tentativeG < (gScore.get(neighbor.id) ?? Infinity)) {
        cameFrom.set(neighbor.id, current)
        gScore.set(neighbor.id, tentativeG)
        fScore.set(neighbor.id, tentativeG + heuristic(neighbor))
        open.set(neighbor.id, neighbor)
      }
    }
  }

  return [start]
}

/**
 * Turn the lattice path into OSRM via-waypoints (lower-crowd bends only).
 * @returns {Array<{ lat: number, lng: number }>}
 */
export function extractSensorWaypoints(latticePath, from, to) {
  if (!latticePath.length) return []

  const candidates = []
  for (const node of latticePath) {
    if (node.seg === 0 || node.seg === CORRIDOR_SEGMENTS) continue
    if (node.offIdx === 0) continue
    candidates.push({ lat: node.lat, lng: node.lng, crowdCost: node.crowdCost })
  }

  if (!candidates.length) return []

  const stride = Math.max(1, Math.floor(candidates.length / (MAX_SENSOR_WAYPOINTS + 1)))
  const picked = []
  for (let i = 0; i < candidates.length && picked.length < MAX_SENSOR_WAYPOINTS; i += stride) {
    const c = candidates[i]
    const tooClose = picked.some(
      (p) => haversineKm(p.lat, p.lng, c.lat, c.lng) * 1000 < MIN_WAYPOINT_GAP_M
    )
    const nearEnd =
      haversineKm(from.lat, from.lng, c.lat, c.lng) * 1000 < MIN_WAYPOINT_GAP_M ||
      haversineKm(to.lat, to.lng, c.lat, c.lng) * 1000 < MIN_WAYPOINT_GAP_M
    if (!tooClose && !nearEnd) picked.push({ lat: c.lat, lng: c.lng })
  }

  return picked
}

/**
 * @param {Array<{ lat: number, lng: number }>} waypoints
 */
async function fetchOsrmRoutesThroughPoints(points, mode, options = {}) {
  const profile = osrmProfileForMode(mode)
  if (!profile || points.length < 2) {
    return { ok: false, error: 'Invalid route points.' }
  }

  const coords = points.map((p) => `${p.lng},${p.lat}`).join(';')
  const params = new URLSearchParams({
    overview: 'full',
    geometries: 'geojson',
    steps: 'false',
  })
  if (options.alternatives) params.set('alternatives', 'true')

  const url = `${OSRM_BASE}/route/v1/${profile}/${coords}?${params.toString()}`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      return { ok: false, error: 'Could not load a route. Try again or open Google Maps.' }
    }
    const data = await res.json()
    if (data?.code !== 'Ok' || !data.routes?.length) {
      return { ok: false, error: data?.message || 'No route found between these points.' }
    }

    const routes = data.routes
      .map((route) => parseOsrmRoute(route, mode))
      .filter((route) => route.latLngs.length > 0)

    if (!routes.length) {
      return { ok: false, error: 'Route geometry was missing from the response.' }
    }

    return { ok: true, routes }
  } catch {
    return { ok: false, error: 'Network error while loading the route.' }
  }
}

async function fetchOsrmRoutes(from, to, mode, options = {}) {
  return fetchOsrmRoutesThroughPoints([from, to], mode, options)
}

export function samplePolyline(latLngs, intervalMeters = ROUTE_SAMPLE_INTERVAL_M) {
  if (!latLngs.length) return []
  if (latLngs.length === 1) return [[latLngs[0][0], latLngs[0][1]]]

  const samples = [[latLngs[0][0], latLngs[0][1]]]
  let sinceLastSampleM = 0
  let prev = latLngs[0]

  for (let i = 1; i < latLngs.length; i += 1) {
    const pt = latLngs[i]
    const segM = haversineKm(prev[0], prev[1], pt[0], pt[1]) * 1000
    sinceLastSampleM += segM

    while (sinceLastSampleM >= intervalMeters) {
      samples.push([pt[0], pt[1]])
      sinceLastSampleM -= intervalMeters
    }
    prev = pt
  }

  const end = latLngs[latLngs.length - 1]
  const last = samples[samples.length - 1]
  if (last[0] !== end[0] || last[1] !== end[1]) {
    samples.push([end[0], end[1]])
  }

  return samples
}

export function scoreRouteCrowdExposure(latLngs, sensors, bounds) {
  const activeSensors = sensors.filter((s) => s.status === 'A')
  if (!activeSensors.length) {
    return { score: null, avgVolume: null, avgLevelLabel: null, sensorCoverage: 0 }
  }

  const samples = samplePolyline(latLngs)
  if (!samples.length) {
    return { score: null, avgVolume: null, avgLevelLabel: null, sensorCoverage: 0 }
  }

  let volumeSum = 0
  let matched = 0
  let highSegments = 0

  for (const [lat, lng] of samples) {
    const est = estimateCrowdForPoint(lat, lng, activeSensors, bounds, ROUTE_SENSOR_MAX_KM)
    if (!est.crowdAvailable) continue
    matched += 1
    volumeSum += est.crowdVolume ?? 0
    if (est.crowdLevelLabel === 'High') highSegments += 1
  }

  if (!matched) {
    return { score: null, avgVolume: null, avgLevelLabel: null, sensorCoverage: 0 }
  }

  const avgVolume = volumeSum / matched
  const sensorCoverage = matched / samples.length
  const avgLevelLabel = volumeToCrowdLevel(avgVolume, bounds)
  const score = avgVolume + highSegments * 180 + (1 - sensorCoverage) * 40

  return { score, avgVolume, avgLevelLabel, sensorCoverage }
}

export function pickLeastCrowdedWalkRoute(routes, sensors, bounds) {
  if (!routes.length) {
    return { route: null, crowdOptimized: false, avgLevelLabel: null, routesCompared: 0, usedSensorPathfinding: false }
  }

  const scored = routes.map((route, index) => ({
    index,
    route,
    crowd: scoreRouteCrowdExposure(route.latLngs, sensors, bounds),
    usedSensorPathfinding: Boolean(route.usedSensorPathfinding),
  }))

  const fastest = scored.reduce((a, b) =>
    a.route.durationS <= b.route.durationS ? a : b
  )

  const withCrowd = scored.filter((item) => item.crowd.score != null)
  if (!withCrowd.length) {
    return {
      route: fastest.route,
      crowdOptimized: false,
      avgLevelLabel: null,
      routesCompared: routes.length,
      usedSensorPathfinding: fastest.usedSensorPathfinding,
    }
  }

  const minDuration = Math.min(...scored.map((item) => item.route.durationS))

  let best = withCrowd[0]
  let bestCombined = Infinity

  for (const item of withCrowd) {
    const durationRatio = item.route.durationS / Math.max(minDuration, 1)
    const durationPenalty =
      durationRatio > MAX_DURATION_RATIO ? (durationRatio - MAX_DURATION_RATIO) * 600 : 0
    const sensorBonus = item.usedSensorPathfinding ? -25 : 0
    const combined = item.crowd.score + durationPenalty + sensorBonus
    if (combined < bestCombined) {
      best = item
      bestCombined = combined
    }
  }

  const crowdOptimized =
    best.usedSensorPathfinding ||
    best.index !== fastest.index ||
    (best.crowd.avgVolume != null &&
      fastest.crowd.avgVolume != null &&
      best.crowd.avgVolume < fastest.crowd.avgVolume * 0.92)

  return {
    route: best.route,
    crowdOptimized,
    avgLevelLabel: best.crowd.avgLevelLabel,
    routesCompared: routes.length,
    usedSensorPathfinding: best.usedSensorPathfinding,
  }
}

/**
 * Walk: sensor-weighted A* → OSRM via waypoints, plus OSRM alternatives; pick lowest crowd.
 */
export async function fetchWalkRoutePreferringLowCrowd(from, to, crowdContext) {
  const sensors = crowdContext?.sensors ?? []
  const canUseCrowd = Boolean(crowdContext?.ok && sensors.length)

  const candidates = []

  const directResult = await fetchOsrmRoutes(from, to, 'walk', {
    alternatives: canUseCrowd,
  })
  if (!directResult.ok) return directResult
  candidates.push(...directResult.routes)

  if (canUseCrowd) {
    const bounds = volumeTertileBounds(
      sensors.filter((s) => s.status === 'A').map((s) => s.volume)
    )
    const latticePath = findLowCrowdLatticePath(from, to, sensors, bounds)
    const waypoints = extractSensorWaypoints(latticePath, from, to)

    if (waypoints.length) {
      const guidedResult = await fetchOsrmRoutesThroughPoints(
        [from, ...waypoints, to],
        'walk'
      )
      if (guidedResult.ok) {
        for (const route of guidedResult.routes) {
          candidates.push({ ...route, usedSensorPathfinding: true })
        }
      }
    }
  }

  const uniqueCandidates = dedupeRoutes(candidates)
  const first = uniqueCandidates[0]

  if (!canUseCrowd) {
    return {
      ok: true,
      ...first,
      crowdOptimized: false,
      routeCrowdLabel: null,
      routesCompared: uniqueCandidates.length,
      usedSensorPathfinding: false,
    }
  }

  const bounds = volumeTertileBounds(
    sensors.filter((s) => s.status === 'A').map((s) => s.volume)
  )
  const picked = pickLeastCrowdedWalkRoute(uniqueCandidates, sensors, bounds)

  return {
    ok: true,
    ...picked.route,
    crowdOptimized: picked.crowdOptimized,
    routeCrowdLabel: picked.avgLevelLabel,
    routesCompared: picked.routesCompared,
    usedSensorPathfinding: picked.usedSensorPathfinding,
  }
}

/** Drop near-duplicate polylines from multiple OSRM requests. */
function dedupeRoutes(routes) {
  const kept = []
  for (const route of routes) {
    const dup = kept.some(
      (k) =>
        Math.abs(k.distanceM - route.distanceM) < 30 &&
        Math.abs(k.durationS - route.durationS) < 20
    )
    if (!dup) kept.push(route)
  }
  return kept
}

export async function fetchOsrmRoute(from, to, mode) {
  if (mode === 'walk') {
    return fetchWalkRoutePreferringLowCrowd(from, to, { ok: false, sensors: [] })
  }

  const routesResult = await fetchOsrmRoutes(from, to, mode)
  if (!routesResult.ok) return routesResult
  return { ok: true, ...routesResult.routes[0] }
}

export function formatRouteDistance(meters) {
  const m = Number(meters)
  if (!Number.isFinite(m) || m <= 0) return '—'
  if (m < 1000) return `${Math.round(m)} m`
  return `${(m / 1000).toFixed(1)} km`
}

export function formatRouteDuration(seconds) {
  const s = Number(seconds)
  if (!Number.isFinite(s) || s <= 0) return '—'
  const mins = Math.round(s / 60)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const rem = mins % 60
  return rem ? `${h} hr ${rem} min` : `${h} hr`
}

export function buildGoogleMapsDirectionsUrl(from, to, mode) {
  let travelMode = 'driving'
  if (mode === 'walk') travelMode = 'walking'
  if (mode === 'transit') travelMode = 'transit'
  const origin = `${from.lat},${from.lng}`
  const destination = `${to.lat},${to.lng}`
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${travelMode}`
}
