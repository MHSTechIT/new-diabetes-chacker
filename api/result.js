/**
 * Vercel Serverless Function: POST /api/result
 * Returns diabetes risk score for a given profile.
 */
import { calculateRisk } from '../backend/src/utils/scoring.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const profile = req.body
    if (!profile || !profile.gender) {
      return res.status(400).json({ error: 'gender is required' })
    }
    const result = calculateRisk(profile)
    res.json({ result })
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Scoring failed.' })
  }
}
