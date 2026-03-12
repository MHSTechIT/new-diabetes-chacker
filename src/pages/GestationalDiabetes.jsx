import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getProgressPercent } from '../lib/progressSteps'
import { saveProfileData } from '../lib/saveProfile'
import './GestationalDiabetes.css'

const options = [
  { id: 'not_applicable', labelKey: 'gestational.notApplicable' },
  { id: 'no', labelKey: 'common.no' },
  { id: 'yes', labelKey: 'common.yes' },
]

export default function GestationalDiabetes() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const userId = location.state?.userId
  const gender = location.state?.gender
  const selectedAge = location.state?.selectedAge

  const [selectedOption, setSelectedOption] = useState(null)

  const handleOptionSelect = (optionId) => {
    setSelectedOption((prev) => (prev === optionId ? null : optionId))
  }

  const handleNext = async () => {
    if (!selectedOption) return
    await saveProfileData(userId, { age_range: selectedAge, gestational_diabetes: selectedOption })
    navigate('/weight-height', { state: { userId, gender } })
  }

  return (
    <div className="gd-page">
      <div className="gd-header">
        <button
          type="button"
          className="gd-back-btn"
          onClick={() => navigate('/age-selection', { state: { userId, gender } })}
          aria-label={t('common.back')}
        >
          ←
        </button>
        <div className="gd-progress-track">
          <div className="gd-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      <h1 className="gd-title">{t('gestational.title')}</h1>

      <div className="gd-content-area">
        <div className="gd-options-grid">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`gd-option-btn ${selectedOption === opt.id ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(opt.id)}
            >
              {t(opt.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="gd-footer">
        <button
          type="button"
          className={`gd-next-btn ${selectedOption ? 'active' : 'inactive'}`}
          disabled={!selectedOption}
          onClick={handleNext}
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  )
}
