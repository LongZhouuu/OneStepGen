const STORAGE_KEY = 'onestepgen-site-access-v1'

/** Same-origin API base as AI calls (no trailing slash). */
export function getApiBase() {
  return (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '')
}

/** Server verifies phrase + HttpOnly cookie — password not in JS bundle. */
export function isServerSiteGate() {
  return String(import.meta.env.VITE_SITE_GATE ?? '').toLowerCase() === 'server'
}

export function getExpectedPassword() {
  return (import.meta.env.VITE_SITE_ACCESS_PASSWORD ?? '').trim()
}

/** Dev: skip gate when no client password (legacy) or VITE_SKIP_SITE_GATE=true. */
export function isGateSkippedInDev() {
  if (!import.meta.env.DEV) return false
  if (String(import.meta.env.VITE_SKIP_SITE_GATE ?? '').toLowerCase() === 'true') return true
  if (!isServerSiteGate() && !getExpectedPassword()) return true
  return false
}

export function isProductionMisconfigured() {
  if (!import.meta.env.PROD) return false
  if (isServerSiteGate()) {
    return !getApiBase()
  }
  return !getExpectedPassword()
}

/** Legacy client-only gate: sessionStorage flag after local password match. */
export function isSiteAccessGranted() {
  if (isGateSkippedInDev()) return true
  if (isProductionMisconfigured()) return false
  if (isServerSiteGate()) return false
  return sessionStorage.getItem(STORAGE_KEY) === '1'
}

export function grantSiteAccess() {
  if (!isServerSiteGate()) {
    sessionStorage.setItem(STORAGE_KEY, '1')
  }
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

export function passwordMatches(input) {
  const expected = getExpectedPassword()
  if (!expected) return false
  return constantTimeEqual(input.trim(), expected)
}

/** GET /site-access/status — 204 means valid HttpOnly cookie. */
export async function checkServerSiteGateFromCookie() {
  const base = getApiBase()
  if (!base) return false
  const url = `${base}/site-access/status`
  try {
    const res = await fetch(url, { method: 'GET', credentials: 'include' })
    return res.status === 204
  } catch {
    return false
  }
}

/** POST /site-access/verify — sets cookie; no phrase stored in bundle. */
export async function verifySitePasswordOnServer(password) {
  const base = getApiBase()
  if (!base) return false
  const url = `${base}/site-access/verify`
  try {
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    return res.ok
  } catch {
    return false
  }
}
