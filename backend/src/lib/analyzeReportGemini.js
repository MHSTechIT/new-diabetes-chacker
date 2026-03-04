/**
 * Blood report image analysis using Google Gemini (vision) with @google/genai.
 * Returns normalized payload: score, risk_level, probability, risk_factors, summary, tips, high_risk, key_values.
 * Env: GEMINI_API_KEY required.
 */

import { GoogleGenAI, createPartFromBase64, createPartFromText, createUserContent } from '@google/genai'

const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']

const SYSTEM_PROMPT = `You are a medical AI assistant. Analyze the blood test report image and:

1. Extract from the report: HbA1c (%), fasting blood sugar / glucose (mg/dL or mmol/L), random glucose if present, and other relevant values (e.g. cholesterol).
2. Assign a diabetes risk score 0–100 and risk_level (LOW, MODERATE, or HIGH) based on standard guidelines (e.g. HbA1c <5.7% low, 5.7–6.4% moderate/pre-diabetic, ≥6.5% high; fasting glucose <100 normal, 100–125 pre-diabetic, ≥126 diabetic).
3. Write a short summary (2–3 sentences) that MUST include the actual numbers found (or "not reported" if not visible).

Return ONLY a single valid JSON object, no markdown, no code fences, no other text. Use exactly these keys:
- score (number 0–100)
- risk_level (string: "LOW" or "MODERATE" or "HIGH")
- probability (string, e.g. "5% - 15%")
- risk_factors (array of strings, e.g. ["Elevated HbA1c", "Fasting glucose in pre-diabetic range"])
- summary (string, 2–3 sentences with actual numbers from the report)
- tips (array of strings, 2–4 short actionable tips)
- high_risk (boolean)
- key_values (object with at least: glucose (string or null), hba1c (string or null); optionally cholesterol (string or null). Use the value and unit, e.g. "98 mg/dL" or "5.9%")`

const USER_PROMPT = `From this blood report image: extract HbA1c and blood sugar (glucose) values, then return one JSON object with score, risk_level, probability, risk_factors, summary (must include the numbers you found), tips, high_risk, and key_values (glucose, hba1c, cholesterol). No other text—only the JSON.`

/**
 * Strip data URL prefix if present; return raw base64.
 * @param {string} input - Full data URL (data:image/jpeg;base64,...) or raw base64
 * @returns {{ base64: string, mimeType: string }}
 */
function normalizeImageInput(input) {
  if (!input || typeof input !== 'string') return null
  const trimmed = input.trim()
  const dataUrlMatch = trimmed.match(/^data:(\w+\/\w+);base64,(.+)$/i)
  if (dataUrlMatch) {
    const mime = dataUrlMatch[1].toLowerCase()
    if (!mime.startsWith('image/')) return null
    return { base64: dataUrlMatch[2], mimeType: mime }
  }
  return { base64: trimmed, mimeType: 'image/jpeg' }
}

/**
 * Extract JSON from model text: remove BOM, markdown fences, then parse.
 */
function extractJson(text) {
  if (!text || typeof text !== 'string') return null
  let raw = text.trim()
  raw = raw.replace(/^\uFEFF/, '')
  raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * Normalize the parsed AI payload to a consistent shape.
 */
function normalizePayload(parsed) {
  if (!parsed || typeof parsed !== 'object') return null
  const num = (v) => (typeof v === 'number' && !Number.isNaN(v) ? v : null)
  const str = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null)
  const arr = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string').map((x) => String(x).trim()) : [])
  const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {})

  const keyValues = obj(parsed.key_values)
  return {
    score: num(parsed.score) ?? 0,
    risk_level: str(parsed.risk_level) || 'LOW',
    probability: str(parsed.probability) || '',
    risk_factors: arr(parsed.risk_factors),
    summary: str(parsed.summary) || '',
    tips: arr(parsed.tips),
    high_risk: Boolean(parsed.high_risk),
    key_values: {
      glucose: str(keyValues.glucose) ?? null,
      hba1c: str(keyValues.hba1c) ?? null,
      cholesterol: str(keyValues.cholesterol) ?? null,
    },
  }
}

/**
 * Analyze blood report image with Gemini. Tries MODELS in order.
 * @param {string} imageBase64 - Full data URL or raw base64
 * @param {string} [mimeType] - Optional, default from data URL or image/jpeg
 * @returns {Promise<{ ok: true, data } | { ok: false, error: string }>}
 */
export async function analyzeReportImage(imageBase64, mimeType) {
  const apiKey = typeof process.env.GEMINI_API_KEY === 'string' ? process.env.GEMINI_API_KEY.trim() : ''
  if (!apiKey) {
    return { ok: false, error: 'GEMINI_API_KEY is not set. Add it to backend/.env and restart.' }
  }

  const normalized = normalizeImageInput(imageBase64)
  if (!normalized || normalized.base64.length < 100) {
    return { ok: false, error: 'A valid report image is required (base64 or data URL).' }
  }

  const mime = mimeType && mimeType.startsWith('image/') ? mimeType : normalized.mimeType
  const ai = new GoogleGenAI({ apiKey })

  let lastError = null
  for (const model of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: createUserContent([
          createPartFromBase64(normalized.base64, mime),
          createPartFromText(USER_PROMPT),
        ]),
        config: {
          systemInstruction: SYSTEM_PROMPT,
          maxOutputTokens: 2048,
        },
      })

      const text = response?.text
      if (!text || typeof text !== 'string') {
        lastError = new Error(`Model ${model} returned no text`)
        continue
      }

      const parsed = extractJson(text)
      const data = normalizePayload(parsed)
      if (data) {
        return { ok: true, data }
      }
      lastError = new Error(`Model ${model} returned invalid JSON`)
    } catch (err) {
      const msg = err?.message || String(err)
      const is404 = msg.includes('404') || msg.includes('not found')
      const is429 = msg.includes('429') || msg.toLowerCase().includes('rate limit')
      const is503 = msg.includes('503') || msg.toLowerCase().includes('resource_exhausted') || msg.toLowerCase().includes('quota')
      if (is404) {
        lastError = err
        continue
      }
      if (is429 || is503) {
        return { ok: false, error: 'API rate limit or quota exceeded. Wait about 60 seconds and try again.' }
      }
      return { ok: false, error: msg || 'AI analysis failed.' }
    }
  }

  return {
    ok: false,
    error: lastError?.message || 'Could not analyze the report. Try again or use a different image.',
  }
}
