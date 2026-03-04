import { Router } from 'express'
import { getProfile, updateProfile } from '../lib/db.js'
import { extractLabsFromImage } from '../lib/gemini.js'
import { analyzeReportImage } from '../lib/analyzeReportGemini.js'
import { calculateRisk, calculateRiskWithLabs, buildRiskExplanation, scoreToLevel } from '../utils/scoring.js'

const router = Router()

function normalizeProfileForScoring(profile) {
  const p = { ...profile }
  const toStr = (v) => {
    if (typeof v === 'string') return v
    if (Array.isArray(v)) return v.join(',')
    return ''
  }
  p.medical_conditions = toStr(p.medical_conditions)
  p.symptoms = toStr(p.symptoms)
  p.habits = toStr(p.habits)
  return p
}

/** Parse number from key_values string e.g. "5.9%" -> 5.9, "98 mg/dL" -> 98 */
function parseLabValue(str) {
  if (str == null || typeof str !== 'string') return null
  const match = str.trim().replace(/%|mg\/dL|mmol\/L/gi, '').match(/[\d.]+/)
  if (!match) return null
  const n = parseFloat(match[0])
  return Number.isNaN(n) ? null : n
}

/** Map AI risk_level (LOW/MODERATE/HIGH) + score to our 5-level scale */
function mapRiskLevel(aiLevel, score) {
  if (aiLevel === 'LOW') return 'LOW'
  if (aiLevel === 'HIGH') return score >= 90 ? 'HIGH' : 'MODERATE_HIGH'
  if (aiLevel === 'MODERATE') return score <= 55 ? 'LOW_MODERATE' : 'MODERATE'
  return scoreToLevel(score)
}

/**
 * POST /api/analyze-report
 * Body: { userId?, profile?, imageBase64, imageMimeType? }
 * Returns: { result, extractedLabs, riskExplanation? }
 * Persists extracted labs (hba1c, fasting_glucose) to user_profiles when userId/profile id is available.
 */
router.post('/', async (req, res) => {
  try {
    const { userId, profile: profileFromBody, imageBase64, imageMimeType } = req.body || {}

    if (!imageBase64 || typeof imageBase64 !== 'string' || imageBase64.length < 100) {
      return res.status(400).json({ error: 'A valid report image is required (base64).' })
    }

    let profile = profileFromBody
    if (!profile && userId) {
      try {
        profile = await getProfile(userId)
      } catch (e) {
        console.error('analyze-report getProfile:', e?.message)
        return res.status(400).json({ error: 'Could not load your profile. Please try again.' })
      }
    }
    if (!profile || !profile.gender) {
      return res.status(400).json({ error: 'Profile required. Send profile or userId.' })
    }

    profile = normalizeProfileForScoring(profile)

    const mimeType = imageMimeType === 'image/png' ? 'image/png' : 'image/jpeg'
    let extractedLabs = { hba1c: null, fastingGlucose: null }
    let result
    let riskExplanation
    let quotaExceeded = false
    let quotaReason
    let combinedReportSummary

    // Prefer new full-prompt analyzer (medical AI with score, summary, tips)
    const analysis = await analyzeReportImage(imageBase64, mimeType)
    if (analysis.ok && analysis.data) {
      const data = analysis.data
      const kv = data.key_values || {}
      extractedLabs = {
        hba1c: parseLabValue(kv.hba1c),
        fastingGlucose: parseLabValue(kv.glucose),
      }
      const riskLevel = mapRiskLevel(data.risk_level, data.score)
      result = {
        totalScore: typeof data.score === 'number' ? data.score : 0,
        riskLevel,
        probabilityRangeText: data.probability || '',
        riskyFactors: (data.risk_factors || []).map((factor) => ({ factor, points: 0 })),
      }
      riskExplanation = data.summary || ''
      combinedReportSummary = data.summary || 'Your risk score above combines your questionnaire answers with the blood report values read by AI.'
      if (data.tips && data.tips.length) {
        result.tips = data.tips
      }
    } else {
      // Fallback: old extract-labs-only flow
      if (analysis.error?.includes('API key') || analysis.error?.includes('GEMINI')) {
        return res.status(502).json({
          error: 'AI blood report analysis is not configured. Add GEMINI_API_KEY to backend/.env and restart the backend to read your report image.',
        })
      }
      try {
        const oldLabs = await extractLabsFromImage(imageBase64, mimeType)
        if (oldLabs.apiKeyMissing) {
          return res.status(502).json({
            error: 'AI blood report analysis is not configured. Add GEMINI_API_KEY to backend/.env and restart the backend to read your report image.',
          })
        }
        extractedLabs = { hba1c: oldLabs.hba1c, fastingGlucose: oldLabs.fastingGlucose }
        quotaExceeded = oldLabs.quotaExceeded === true
        quotaReason = oldLabs.quotaReason
        try {
          result = quotaExceeded
            ? calculateRisk(profile)
            : calculateRiskWithLabs(profile, extractedLabs)
          riskExplanation = buildRiskExplanation(result)
        } catch (scoreErr) {
          console.error('analyze-report scoring:', scoreErr)
          return res.status(500).json({
            error: 'Could not compute your result. Please try again.',
          })
        }
        combinedReportSummary = !quotaExceeded && (extractedLabs.hba1c != null || extractedLabs.fastingGlucose != null)
          ? 'Your risk score above combines your questionnaire answers with the HbA1c and blood sugar values read from your report by AI.'
          : undefined
      } catch (geminiErr) {
        console.error('analyze-report Gemini:', geminiErr?.message)
        return res.status(502).json({
          error: geminiErr?.message || 'AI analysis failed. Check your API key and quota, or try again later.',
        })
      }
    }

    const profileId = profile.id || userId
    if (profileId && !quotaExceeded && (extractedLabs.hba1c != null || extractedLabs.fastingGlucose != null)) {
      try {
        await updateProfile(profileId, {
          hba1c: extractedLabs.hba1c ?? null,
          fasting_glucose: extractedLabs.fastingGlucose ?? null,
          blood_report_analyzed_at: new Date().toISOString(),
        })
      } catch (e) {
        console.error('analyze-report updateProfile:', e?.message)
      }
    }

    const hasRealLabs = !quotaExceeded && (extractedLabs.hba1c != null || extractedLabs.fastingGlucose != null)
    const quotaMessage = quotaExceeded
      ? quotaReason === 'rate_limit'
        ? 'Rate limit reached (too many requests per minute). Wait about a minute and try again — your daily quota may still be fine.'
        : 'AI analysis is temporarily unavailable (API quota exceeded). Your result is based on your answers only. Try again later or check usage at Google AI Studio.'
      : undefined
    res.json({
      result,
      extractedLabs: { hba1c: extractedLabs.hba1c, fastingGlucose: extractedLabs.fastingGlucose },
      riskExplanation: riskExplanation || undefined,
      quotaExceeded: quotaExceeded || undefined,
      quotaReason: quotaReason || undefined,
      quotaMessage: quotaMessage || undefined,
      combinedReportSummary: combinedReportSummary || (hasRealLabs
        ? 'Your risk score above combines your questionnaire answers with the HbA1c and blood sugar values read from your report by AI.'
        : undefined),
    })
  } catch (err) {
    console.error('analyze-report error:', err)
    res.status(500).json({
      error: err?.message || 'Analysis failed. Please try again.',
    })
  }
})

export default router
