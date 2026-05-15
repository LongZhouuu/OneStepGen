const STORAGE_KEY = 'onestepgen-site-access-v1'

/** Same-origin API base as AI calls (no trailing slash). */
export function getApiBase() {
  return (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '')
}

/** Explicit opt-in: `VITE_SITE_GATE=server` at build time. */
export function isServerSiteGate() {
  return String(import.meta.env.VITE_SITE_GATE ?? '').toLowerCase() === 'server'
}

/**
 * Use server verify + HttpOnly cookie when:
 * - `VITE_SITE_GATE=server`, OR
 * - production + `VITE_API_BASE_URL` set (Lambda phrase); ignores leftover `VITE_SITE_ACCESS_PASSWORD`
 *   unless you explicitly force legacy client gate with `VITE_SITE_GATE=client`.
 */
export function usesServerSiteGate() {
  if (String(import.meta.env.VITE_SITE_GATE ?? '').toLowerCase() === 'client') {
    return false
  }
  if (isServerSiteGate()) return true
  if (import.meta.env.PROD && getApiBase()) return true
  return false
}

/**
 * Phrase for the **legacy client-only** gate (`VITE_SITE_ACCESS_PASSWORD`).
 *
 * Vite replaces `import.meta.env.VITE_*` at **build** time with string literals.
 * If this function always read `VITE_SITE_ACCESS_PASSWORD`, that phrase would
 * always appear in `dist` — even when production uses the **server** gate.
 *
 * So in **production** we only read that env when `VITE_SITE_GATE=client`
 * (explicit bundle-only mode). In all other production builds we return `''`
 * without referencing `VITE_SITE_ACCESS_PASSWORD`, so the secret is not
 * emitted. **Development** still reads the var for local testing.
 */
export function getExpectedPassword() {
  if (import.meta.env.DEV) {
    return (import.meta.env.VITE_SITE_ACCESS_PASSWORD ?? '').trim()
  }
  if (String(import.meta.env.VITE_SITE_GATE ?? '').toLowerCase() === 'client') {
    return (import.meta.env.VITE_SITE_ACCESS_PASSWORD ?? '').trim()
  }
  return ''
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
  if (usesServerSiteGate()) {
    return !getApiBase()
  }
  return !getExpectedPassword()
}

/** Legacy client-only gate: sessionStorage flag after local password match. */
export function isSiteAccessGranted() {
  if (isGateSkippedInDev()) return true
  if (isProductionMisconfigured()) return false
  if (usesServerSiteGate()) return false
  return sessionStorage.getItem(STORAGE_KEY) === '1'
}

export function grantSiteAccess() {
  if (!usesServerSiteGate()) {
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
