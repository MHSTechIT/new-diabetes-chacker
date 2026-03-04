import { Router } from 'express'
import { createProfile, getProfile, updateProfile } from '../lib/db.js'
import { calculateRisk, calculateRiskWithLabs } from '../utils/scoring.js'

const router = Router()

// POST /api/profiles - create new profile (gender)
router.post('/', async (req, res) => {
  try {
    const { gender } = req.body
    if (!gender) {
      return res.status(400).json({ error: 'gender is required' })
    }
    const id = await createProfile({ gender })
    res.json({ id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/profiles/:id - update profile
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body
    await updateProfile(id, updates)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/profiles/:id/result - get profile and computed result (uses saved labs if present)
// When profile is missing, return 200 with nulls so the frontend can fall back to local calculation (avoids 404)
router.get('/:id/result', async (req, res) => {
  try {
    const { id } = req.params
    if (!id || id === 'undefined' || id === 'null') {
      return res.json({ profile: null, result: null })
    }
    let profile
    try {
      profile = await getProfile(id)
    } catch (err) {
      // Supabase "no row" (PGRST116) or other not-found: let frontend fall back
      if (err?.code === 'PGRST116' || err?.message?.includes('not found')) {
        return res.json({ profile: null, result: null })
      }
      throw err
    }
    if (!profile || !profile.gender) {
      return res.json({ profile: null, result: null })
    }
    const hasLabs = profile.hba1c != null || profile.fasting_glucose != null
    const result = hasLabs
      ? calculateRiskWithLabs(profile, { hba1c: profile.hba1c, fastingGlucose: profile.fasting_glucose })
      : calculateRisk(profile)
    res.json({ profile, result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/result - submit full profile and get result (for local mode)
router.post('/result', async (req, res) => {
  try {
    const profile = req.body
    if (!profile || !profile.gender) {
      return res.status(400).json({ error: 'gender is required' })
    }
    const result = calculateRisk(profile)
    res.json({ result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
