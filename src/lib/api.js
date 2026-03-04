/**
 * Backend API client - used when VITE_USE_API is true
 * Uses same-origin /api when proxy is configured, or VITE_API_URL for direct
 */
const USE_API = import.meta.env.VITE_USE_API === 'true' || import.meta.env.VITE_USE_API === '1'
const BASE = USE_API ? (import.meta.env.VITE_API_URL || '') : ''

export async function apiCreateProfile(gender) {
  const res = await fetch(`${BASE}/api/profiles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gender }),
  })
  if (!res.ok) throw new Error(await res.text())
  const { id } = await res.json()
  return id
}

export async function apiUpdateProfile(userId, updates) {
  const res = await fetch(`${BASE}/api/profiles/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error(await res.text())
}

export async function apiGetResult(userId) {
  const res = await fetch(`${BASE}/api/profiles/${userId}/result`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiSubmitProfileForResult(profile) {
  const res = await fetch(`${BASE}/api/result`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

const apiBase = BASE || (typeof window !== 'undefined' ? '' : '')
/** Analyze blood report image with profile; returns { result, extractedLabs, riskExplanation? } */
export async function apiAnalyzeReport({ userId, profile, imageBase64, imageMimeType }) {
  const res = await fetch(`${apiBase}/api/analyze-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, profile, imageBase64, imageMimeType }),
  })
  if (!res.ok) {
    const text = await res.text()
    try {
      const j = JSON.parse(text)
      throw new Error(j.error || text || 'Analysis failed')
    } catch (e) {
      if (e instanceof SyntaxError) throw new Error(text || 'Analysis failed')
      throw e
    }
  }
  return res.json()
}

export const hasApi = () => USE_API

/**
 * Save updates - use API when available, else no-op (profileStorage handles it)
 */
export async function saveUpdates(userId, updates) {
  if (hasApi() && userId) {
    await apiUpdateProfile(userId, updates)
  }
}
