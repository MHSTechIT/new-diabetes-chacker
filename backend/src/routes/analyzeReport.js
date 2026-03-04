/**
 * POST /api/analyze/report
 * Body: { imageBase64: string (data URL or raw base64), mimeType?: string }
 * Response: { ok: true, data } or { error: string }
 */
import { Router } from 'express'
import { analyzeReportImage } from '../lib/analyzeReportGemini.js'

const router = Router()

router.post('/report', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body || {}

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Missing imageBase64 (data URL or raw base64).' })
    }

    const result = await analyzeReportImage(imageBase64, mimeType)

    if (!result.ok) {
      const status = result.error?.includes('not set') ? 500 : result.error?.includes('required') ? 400 : 500
      return res.status(status).json({ error: result.error })
    }

    return res.json({ ok: true, data: result.data })
  } catch (err) {
    console.error('analyze/report error:', err?.message || err)
    res.status(500).json({ error: err?.message || 'Server error. Please try again.' })
  }
})

export default router
