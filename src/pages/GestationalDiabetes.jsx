import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getProgressPercent } from '../lib/progressSteps'
import { saveProfileData } from '../lib/saveProfile'
import './GestationalDiabetes.css'

const options = [
  { id: 'not_applicable', label: 'Not applicable' },
  { id: 'no', label: 'No' },
  { id: 'yes', label: 'Yes' },
]

export default function GestationalDiabetes() {
  const navigate = useNavigate()
  const location = useLocation()
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
          aria-label="Back"
        >
          ←
        </button>
        <div className="gd-progress-track">
          <div className="gd-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      <h1 className="gd-title">History of gestational diabetes during pregnancy?</h1>

      <div className="gd-content-area">
        <div className="gd-options-grid">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`gd-option-btn ${selectedOption === opt.id ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(opt.id)}
            >
              {opt.label}
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
          NEXT
        </button>
      </div>
    </div>
  )
}
