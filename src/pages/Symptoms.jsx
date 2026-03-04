import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getProgressPercent } from '../lib/progressSteps'
import { saveProfileData } from '../lib/saveProfile'
import './Symptoms.css'

const symptoms = [
  { id: 'frequent-urination', label: 'Frequent urination' },
  { id: 'excessive-thirst', label: 'Excessive thirst' },
  { id: 'increased-hunger', label: 'Increased hunger' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'blurred-vision', label: 'Blurred vision' },
  { id: 'slow-wound-healing', label: 'Slow wound healing' },
  { id: 'tingling-numbness', label: 'Tingling or numbness in hands/feet' },
  { id: 'dark-patches', label: 'Dark patches around neck' },
  { id: 'none', label: 'None of the above' },
]

export default function Symptoms() {
  const navigate = useNavigate()
  const location = useLocation()
  const userId = location.state?.userId
  const gender = location.state?.gender

  const [selectedSymptoms, setSelectedSymptoms] = useState(new Set())

  const handleSymptomToggle = (symptomId) => {
    const newSelected = new Set(selectedSymptoms)

    if (newSelected.has(symptomId)) {
      // Unchecking the option
      newSelected.delete(symptomId)
    } else {
      // Checking the option - handle "None" special logic
      if (symptomId === 'none') {
        // If selecting "None", clear all other symptoms
        newSelected.clear()
        newSelected.add('none')
      } else {
        // If selecting any symptom, remove "None" if it was selected
        newSelected.delete('none')
        newSelected.add(symptomId)
      }
    }
    setSelectedSymptoms(newSelected)
  }

  const handleNext = async () => {
    if (selectedSymptoms.size === 0) return
    const symptomsString = Array.from(selectedSymptoms).join(',')
    await saveProfileData(userId, { symptoms: symptomsString })
    navigate('/habits', { state: { userId, gender } })
  }

  return (
    <div className="sym-page">
      {/* ── Header ── */}
      <div className="sym-header">
        <button
          type="button"
          className="sym-back-btn"
          onClick={() => navigate('/medical-conditions', { state: { userId, gender } })}
          aria-label="Back"
        >
          ←
        </button>
        <div className="sym-progress-track">
          <div className="sym-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      {/* ── Title ── */}
      <h1 className="sym-title">Are you experiencing any of these symptoms?</h1>

      {/* ── Content Area ── */}
      <div className="sym-content-area">
        {/* ── Checkbox Grid ── */}
        <div className="sym-options-grid">
          {symptoms.map((symptom) => {
            const isSelected = selectedSymptoms.has(symptom.id)
            return (
              <button
                key={symptom.id}
                type="button"
                className={`sym-option-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSymptomToggle(symptom.id)}
              >
                {symptom.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Footer / NEXT ── */}
      <div className="sym-footer">
        <button
          type="button"
          className={`sym-next-btn ${selectedSymptoms.size > 0 ? 'active' : 'inactive'}`}
          disabled={selectedSymptoms.size === 0}
          onClick={handleNext}
        >
          NEXT
        </button>
      </div>
    </div>
  )
}
