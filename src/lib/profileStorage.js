/**
 * Local profile storage for demo/offline mode when Supabase is not configured.
 * Merges answers into sessionStorage so the result can be computed without a backend.
 */

const KEY = 'diabetes_checker_profile'
const USER_ID_KEY = 'diabetes_checker_user_id'

export function getUserId() {
  try {
    return sessionStorage.getItem(USER_ID_KEY) || null
  } catch {
    return null
  }
}

export function setUserId(id) {
  try {
    if (id) sessionStorage.setItem(USER_ID_KEY, id)
    else sessionStorage.removeItem(USER_ID_KEY)
  } catch {}
}

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
    sessionStorage.removeItem(USER_ID_KEY)
  } catch {}
}
