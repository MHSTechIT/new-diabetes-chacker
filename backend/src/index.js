import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

import express from 'express'
import cors from 'cors'
import profilesRouter from './routes/profiles.js'
import analyzeRouter from './routes/analyze.js'
import analyzeReportRouter from './routes/analyzeReport.js'
import { calculateRisk } from './utils/scoring.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '12mb' }))

app.use('/api/profiles', profilesRouter)
app.use('/api/analyze-report', analyzeRouter)
app.use('/api/analyze', analyzeReportRouter)

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err?.message || err)
  res.status(500).json({ error: 'Something went wrong. Please try again.' })
})

// POST /api/result - submit full profile, get result (frontend calls this)
app.post('/api/result', (req, res) => {
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

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`)
  const hasGemini = !!process.env.GEMINI_API_KEY?.trim()
  console.log(`Gemini API key: ${hasGemini ? 'set' : 'not set (blood report will use fallback)'}`)
})
