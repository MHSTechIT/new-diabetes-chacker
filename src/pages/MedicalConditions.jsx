import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getProgressPercent } from '../lib/progressSteps'
import { saveProfileData } from '../lib/saveProfile'
import './MedicalConditions.css'

const conditions = [
  { id: 'hypertension', labelKey: 'medicalConditions.hypertension' },
  { id: 'high-cholesterol', labelKey: 'medicalConditions.highCholesterol' },
  { id: 'pcos', labelKey: 'medicalConditions.pcos' },
  { id: 'thyroid-disorder', labelKey: 'medicalConditions.thyroidDisorder' },
  { id: 'fatty-liver', labelKey: 'medicalConditions.fattyLiver' },
  { id: 'heart-disease', labelKey: 'medicalConditions.heartDisease' },
  { id: 'kidney-disease', labelKey: 'medicalConditions.kidneyDisease' },
  { id: 'none', labelKey: 'medicalConditions.none' },
]

export default function MedicalConditions() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
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
          aria-label={t('common.back')}
        >
          ←
        </button>
        <div className="mc-progress-track">
          <div className="mc-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      {/* ── Title ── */}
      <h1 className="mc-title">{t('medicalConditions.title')}</h1>

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
                {t(condition.labelKey)}
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
          {t('common.next')}
        </button>
      </div>
    </div>
  )
}
