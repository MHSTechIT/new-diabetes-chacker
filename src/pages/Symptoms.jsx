import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getProgressPercent } from '../lib/progressSteps'
import { saveProfileData } from '../lib/saveProfile'
import './Symptoms.css'

const symptoms = [
  { id: 'frequent-urination', labelKey: 'symptoms.frequentUrination' },
  { id: 'excessive-thirst', labelKey: 'symptoms.excessiveThirst' },
  { id: 'increased-hunger', labelKey: 'symptoms.increasedHunger' },
  { id: 'fatigue', labelKey: 'symptoms.fatigue' },
  { id: 'blurred-vision', labelKey: 'symptoms.blurredVision' },
  { id: 'slow-wound-healing', labelKey: 'symptoms.slowWoundHealing' },
  { id: 'tingling-numbness', labelKey: 'symptoms.tinglingNumbness' },
  { id: 'dark-patches', labelKey: 'symptoms.darkPatches' },
  { id: 'none', labelKey: 'symptoms.noneAbove' },
]

export default function Symptoms() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
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
          aria-label={t('common.back')}
        >
          ←
        </button>
        <div className="sym-progress-track">
          <div className="sym-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      {/* ── Title ── */}
      <h1 className="sym-title">{t('symptoms.title')}</h1>

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
                {t(symptom.labelKey)}
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
          {t('common.next')}
        </button>
      </div>
    </div>
  )
}
