import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getProgressPercent } from '../lib/progressSteps'
import { saveProfileData } from '../lib/saveProfile'
import siblingsImg from '../assets/family/siblings.png'
import motherImg from '../assets/family/mother.png'
import fatherImg from '../assets/family/father.png'
import './FamilyHistory.css'

const options = [
  { id: 'none',         label: 'No, nobody in my family has it.' },
  { id: 'not-sure',     label: "I'm not sure about my family history." },
  { id: 'siblings',     label: 'Yes, my brother or sister has it.' },
  { id: 'one-parent',   label: 'Yes, one of my parents has it.' },
  { id: 'both-parents', label: 'Yes, both my parents have it.' },
]

/**
 * Returns the CSS state class for each character based on the selected option.
 * char: 'left' | 'center' | 'right'
 */
function getCharState(selected, char) {
  if (!selected || selected === 'not-sure') return 'normal'

  const zoom = {
    none:          [],
    siblings:      ['left'],
    'one-parent':  ['right'],
    'both-parents':['center', 'right'],
  }

  if (selected === 'none') return 'blur'

  const zoomed = zoom[selected] || []
  if (zoomed.includes(char)) return 'zoom'
  return 'blur'
}

export default function FamilyHistory() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const userId    = location.state?.userId
  const [selected, setSelected] = useState(null)

  const handleNext = async () => {
    if (!selected) return
    await saveProfileData(userId, { family_history: selected })
    navigate('/hip-size', { state: { userId, gender: location.state?.gender } })
  }

  const leftState   = getCharState(selected, 'left')
  const centerState = getCharState(selected, 'center')
  const rightState  = getCharState(selected, 'right')

  return (
    <div className="fh-page">

      {/* ── Header ── */}
      <div className="fh-header">
        <button
          type="button"
          className="fh-back-btn"
          onClick={() => navigate('/weight-height', { state: { userId } })}
          aria-label="Back"
        >
          ←
        </button>
        <div className="fh-progress-track">
          <div className="fh-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      {/* ── Title ── */}
      <h1 className="fh-title">Do you have a family<br />history of diabetes?</h1>

      {/* ── Characters ── */}
      <div className="fh-characters">
        {/* LEFT — siblings */}
        <div className={`fh-char-wrap ${leftState}`}>
          {leftState === 'zoom' && <div className="fh-glow" />}
          <img src={siblingsImg} alt="Siblings" className="fh-char-img" loading="lazy" />
        </div>

        {/* CENTER — mother */}
        <div className={`fh-char-wrap ${centerState}`}>
          {centerState === 'zoom' && <div className="fh-glow" />}
          <img src={motherImg} alt="Mother" className="fh-char-img" loading="lazy" />
        </div>

        {/* RIGHT — father */}
        <div className={`fh-char-wrap ${rightState}`}>
          {rightState === 'zoom' && <div className="fh-glow" />}
          <img src={fatherImg} alt="Father" className="fh-char-img" loading="lazy" />
        </div>
      </div>

      {/* ── Options ── */}
      <div className="fh-options-grid">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`fh-option-btn ${selected === opt.id ? 'selected' : ''}`}
            onClick={() => setSelected(selected === opt.id ? null : opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── NEXT ── */}
      <div className="fh-footer">
        <button
          type="button"
          className={`fh-next-btn ${selected ? 'active' : 'inactive'}`}
          disabled={!selected}
          onClick={handleNext}
        >
          NEXT
        </button>
      </div>

    </div>
  )
}
