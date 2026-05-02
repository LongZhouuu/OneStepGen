const STORAGE_KEY = 'onestepgen-site-access-v1'

export function getExpectedPassword() {
  return (import.meta.env.VITE_SITE_ACCESS_PASSWORD ?? '').trim()
}

/** Dev only: no password configured — skip gate for local work. */
export function isGateSkippedInDev() {
  return import.meta.env.DEV && !getExpectedPassword()
}

export function isProductionMisconfigured() {
  return import.meta.env.PROD && !getExpectedPassword()
}

export function isSiteAccessGranted() {
  if (isGateSkippedInDev()) return true
  if (isProductionMisconfigured()) return false
  return sessionStorage.getItem(STORAGE_KEY) === '1'
}

export function grantSiteAccess() {
  sessionStorage.setItem(STORAGE_KEY, '1')
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
