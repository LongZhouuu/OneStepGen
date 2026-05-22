/**
 * Greater Melbourne bounds for the focus map location search.
 * Covers CBD datasets and nearby suburbs (not other cities named "Melbourne").
 */
export const GREATER_MELBOURNE_BOUNDS = {
  minLat: -38.45,
  maxLat: -37.4,
  minLng: 144.45,
  maxLng: 145.35,
}

const NOMINATIM_VIEWBOX = [
  GREATER_MELBOURNE_BOUNDS.minLng,
  GREATER_MELBOURNE_BOUNDS.maxLat,
  GREATER_MELBOURNE_BOUNDS.maxLng,
  GREATER_MELBOURNE_BOUNDS.minLat,
].join(',')

export const MELBOURNE_LOCATION_ERROR =
  'Please choose a location in Greater Melbourne, Victoria. This map only lists Melbourne workplaces.'

/** True when coordinates fall inside the Greater Melbourne bounding box. */
export function isWithinGreaterMelbourne(lat, lng) {
  const la = Number(lat)
  const lo = Number(lng)
  if (!Number.isFinite(la) || !Number.isFinite(lo)) return false
  const b = GREATER_MELBOURNE_BOUNDS
  return la >= b.minLat && la <= b.maxLat && lo >= b.minLng && lo <= b.maxLng
}

/** Nominatim result object → lat/lng inside Melbourne bounds. */
export function isNominatimResultInMelbourne(item) {
  if (!item) return false
  return isWithinGreaterMelbourne(Number(item.lat), Number(item.lon))
}

/** Forward-geocode URL: Australia only, bounded to Greater Melbourne viewbox. */
export function buildMelbourneNominatimSearchUrl(query, limit = 6) {
  const q = String(query ?? '').trim()
  if (!q) return ''
  const searchText = /\bmelbourne\b/i.test(q) ? q : `${q}, Melbourne, Victoria, Australia`
  const params = new URLSearchParams({
    format: 'json',
    q: searchText,
    countrycodes: 'au',
    viewbox: NOMINATIM_VIEWBOX,
    bounded: '1',
    limit: String(limit),
    addressdetails: '1',
  })
  return `https://nominatim.openstreetmap.org/search?${params.toString()}`
}

/** Keep Nominatim hits that are inside the Melbourne box (and Victoria when known). */
export function filterMelbourneNominatimResults(results) {
  if (!Array.isArray(results)) return []
  return results.filter((item) => {
    if (!isNominatimResultInMelbourne(item)) return false
    const state = item?.address?.state
    if (state && !/victoria/i.test(String(state))) return false
    return true
  })
}
