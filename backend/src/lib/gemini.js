/**
 * Gemini API: extract HbA1c and fasting blood glucose from a blood report image.
 * Requires GEMINI_API_KEY in .env (get key from https://aistudio.google.com/apikey)
 */

function getApiKey() {
  return typeof process.env.GEMINI_API_KEY === 'string' ? process.env.GEMINI_API_KEY.trim() : ''
}
// Use a model that supports vision + generateContent (gemini-1.5-flash may be deprecated in some regions)
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta'

const EXTRACT_PROMPT = `You are a medical lab report reader. Analyse this blood test report image and extract ONLY these two values.

RULES:
1. HbA1c (Glycated hemoglobin / A1C / Glycosylated Hb): output as a number in PERCENT (e.g. 5.7, 6.2).
   - If the report shows mmol/mol, convert to percent: percent = (mmol/mol × 0.0915) + 2.15.
   - If not found or unreadable, use null.

2. Fasting blood glucose / Fasting sugar / FBS / FBG / Fasting plasma glucose: output as a number in mg/dL (e.g. 95, 108).
   - If the report shows mmol/L, convert to mg/dL: multiply by 18.
   - If not found or unreadable, use null.

Reply with ONLY a single JSON object, no other text, no markdown. Use exactly these keys: "hba1c", "fastingGlucose".
Example: {"hba1c":5.9,"fastingGlucose":108}
Example with one missing: {"hba1c":6.1,"fastingGlucose":null}`

/** Mock labs used when API key is missing or quota exceeded (do not save to DB). */
const FALLBACK_LABS = { hba1c: 5.9, fastingGlucose: 108 }

/**
 * Call Gemini vision API with base64 image; returns { hba1c, fastingGlucose, quotaExceeded? }.
 * On 429 quota exceeded, returns fallback labs and quotaExceeded: true so the app still works.
 * @param {string} imageBase64 - raw base64 string (no data URL prefix)
 * @param {string} [mimeType] - e.g. image/jpeg, image/png
 */
export async function extractLabsFromImage(imageBase64, mimeType = 'image/jpeg') {
  const apiKey = getApiKey()
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not set; AI blood report analysis is disabled')
    return { hba1c: null, fastingGlucose: null, quotaExceeded: false, apiKeyMissing: true }
  }

  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return { hba1c: null, fastingGlucose: null, quotaExceeded: false }
  }

  const url = `${BASE_URL}/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`
  const body = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType,
              data: imageBase64,
            },
          },
          { text: EXTRACT_PROMPT },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 256,
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text()
    const is429 = res.status === 429
    const is503Quota = res.status === 503 && /quota|RESOURCE_EXHAUSTED/i.test(errText)
    const isQuotaExceeded = is429 || is503Quota
    if (isQuotaExceeded) {
      console.warn(`Gemini API limit hit: HTTP ${res.status}. Full response (first 500 chars):`, errText.slice(0, 500))
      console.warn('If you have not used your key yet, check: 1) Gemini API is enabled at https://aistudio.google.com 2) Your key has quota 3) Free tier has a low requests-per-minute limit — wait 60s and retry.')
      return {
        ...FALLBACK_LABS,
        quotaExceeded: true,
        quotaReason: is429 ? 'rate_limit' : 'quota',
      }
    }
    if (res.status === 401 || res.status === 403) {
      console.error('Gemini API auth error:', res.status, errText.slice(0, 200))
      throw new Error('Invalid or unauthorized Gemini API key. Check GEMINI_API_KEY in backend/.env and enable the API at Google AI Studio.')
    }
    if (res.status === 404) {
      console.error('Gemini API 404:', errText.slice(0, 200))
      throw new Error('Gemini model not found. Try setting GEMINI_MODEL in backend/.env (e.g. gemini-1.5-flash or gemini-2.0-flash).')
    }
    if (res.status === 400) {
      console.error('Gemini API 400:', errText.slice(0, 300))
      throw new Error(`Gemini API request failed: ${errText.slice(0, 150)}`)
    }
    throw new Error(`Gemini API error: ${res.status} ${errText}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    return { hba1c: null, fastingGlucose: null, quotaExceeded: false }
  }

  try {
    const cleaned = text.replace(/```json?\s*|\s*```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    const hba1c = typeof parsed.hba1c === 'number' ? parsed.hba1c : null
    const fastingGlucose = typeof parsed.fastingGlucose === 'number' ? parsed.fastingGlucose : null
    return { hba1c, fastingGlucose, quotaExceeded: false }
  } catch {
    return { hba1c: null, fastingGlucose: null, quotaExceeded: false }
  }
}
