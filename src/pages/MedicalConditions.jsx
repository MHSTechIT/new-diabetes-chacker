import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getProgressPercent } from '../lib/progressSteps'
import { saveProfileData } from '../lib/saveProfile'
import './MedicalConditions.css'

const conditions = [
  { id: 'hypertension', label: 'Hypertension (High BP)' },
  { id: 'high-cholesterol', label: 'High cholesterol' },
  { id: 'pcos', label: 'PCOS' },
  { id: 'thyroid-disorder', label: 'Thyroid disorder' },
  { id: 'fatty-liver', label: 'Fatty liver' },
  { id: 'heart-disease', label: 'Heart disease' },
  { id: 'kidney-disease', label: 'Kidney disease' },
  { id: 'none', label: 'None' },
]

export default function MedicalConditions() {
  const navigate = useNavigate()
  const location = useLocation()
  const userId = location.state?.userId
  const gender = location.state?.gender

  const [selectedConditions, setSelectedConditions] = useState(new Set())

  const handleConditionToggle = (conditionId) => {
    const newSelected = new Set(selectedConditions)

    if (newSelected.has(conditionId)) {
      // Unchecking the option
      newSelected.delete(conditionId)
    } else {
      // Checking the option - handle "None" special logic
      if (conditionId === 'none') {
        // If selecting "None", clear all other conditions
        newSelected.clear()
        newSelected.add('none')
      } else {
        // If selecting any condition, remove "None" if it was selected
        newSelected.delete('none')
        newSelected.add(conditionId)
      }
    }
    setSelectedConditions(newSelected)
  }

  const handleNext = async () => {
    if (selectedConditions.size === 0) return
    const conditionsString = Array.from(selectedConditions).join(',')
    await saveProfileData(userId, { medical_conditions: conditionsString })
    navigate('/symptoms', { state: { userId, gender } })
  }

  return (
    <div className="mc-page">
      {/* ── Header ── */}
      <div className="mc-header">
        <button
          type="button"
          className="mc-back-btn"
          onClick={() => navigate('/stress-level', { state: { userId, gender } })}
          aria-label="Back"
        >
          ←
        </button>
        <div className="mc-progress-track">
          <div className="mc-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      {/* ── Title ── */}
      <h1 className="mc-title">Select any conditions you have?</h1>

      {/* ── Content Area ── */}
      <div className="mc-content-area">
        {/* ── Checkbox Grid ── */}
        <div className="mc-options-grid">
          {conditions.map((condition) => {
            const isSelected = selectedConditions.has(condition.id)
            return (
              <button
                key={condition.id}
                type="button"
                className={`mc-option-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleConditionToggle(condition.id)}
              >
                {condition.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Footer / NEXT ── */}
      <div className="mc-footer">
        <button
          type="button"
          className={`mc-next-btn ${selectedConditions.size > 0 ? 'active' : 'inactive'}`}
          disabled={selectedConditions.size === 0}
          onClick={handleNext}
        >
          NEXT
        </button>
      </div>
    </div>
  )
}
