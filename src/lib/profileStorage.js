/**
 * Local profile storage for demo/offline mode when Supabase is not configured.
 * Merges answers into sessionStorage so the result can be computed without a backend.
 */

const KEY = 'diabetes_checker_profile'

export function getProfile() {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveProfile(updates) {
  try {
    const current = getProfile() || {}
    const merged = { ...current, ...updates }
    sessionStorage.setItem(KEY, JSON.stringify(merged))
    return merged
  } catch {
    return null
  }
}

export function clearProfile() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {}
}
