import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import maleImg from '../assets/men.png'
import femaleImg from '../assets/women.png'
import { supabase } from '../lib/supabaseClient'
import { saveProfile, clearProfile, setUserId } from '../lib/profileStorage'
import { hasApi, apiCreateProfile } from '../lib/api'
import { getProgressPercent } from '../lib/progressSteps'
import styles from './GenderSelection.module.css'

export default function GenderSelection() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const maleImgRef = useRef(null)
  const femaleImgRef = useRef(null)

  const getCardState = (gender) => {
    if (!selected) return 'default'
    return selected === gender ? 'selected' : 'unselected'
  }

  const saveGender = async () => {
    if (!selected) return
    const imgEl = selected === 'male' ? maleImgRef.current : femaleImgRef.current
    const r = imgEl ? imgEl.getBoundingClientRect() : null
    const fromRect = r ? { top: r.top, left: r.left, width: r.width, height: r.height } : null
    if (hasApi()) {
      try {
        const id = await apiCreateProfile(selected)
        setUserId(id)
        navigate('/age-selection', { state: { userId: id, gender: selected, fromRect } })
      } catch (err) {
        clearProfile()
        saveProfile({ gender: selected })
        navigate('/age-selection', { state: { gender: selected, fromRect } })
      }
    } else if (supabase) {
      const { data } = await supabase
        .from('user_profiles')
        .insert({ gender: selected })
        .select('id')
        .single()
      const id = data?.id
      if (id) setUserId(id)
      navigate('/age-selection', { state: { userId: id, gender: selected, fromRect } })
    } else {
      clearProfile()
      saveProfile({ gender: selected })
      navigate('/age-selection', { state: { gender: selected, fromRect } })
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.progressBarTrack}>
        <div className={styles.progressBarFill} style={{ width: `${getProgressPercent(location.pathname)}%` }} />
      </div>

      <h1 className={styles.heading}>{t('gender.heading')}</h1>
      <p className={styles.subtext}>{t('gender.subtext')}</p>

      <div className={styles.cardsContainer}>
        <div className={`${styles.cardWrapper} ${styles.maleCard} ${styles[getCardState('male')]}`}>
          <div
            className={styles.genderCard}
            onClick={() => setSelected('male')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setSelected('male')}
            aria-pressed={selected === 'male'}
          >
            {selected === 'male' && (
              <div className={`${styles.backdrop} ${styles.blue}`} aria-hidden />
            )}
            <img ref={maleImgRef} src={maleImg} alt={t('gender.male')} className={styles.characterImg} loading="lazy" />
          </div>
        </div>

        <div className={`${styles.cardWrapper} ${styles.femaleCard} ${styles[getCardState('female')]}`}>
          <div
            className={styles.genderCard}
            onClick={() => setSelected('female')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setSelected('female')}
            aria-pressed={selected === 'female'}
          >
            {selected === 'female' && (
              <div className={`${styles.backdrop} ${styles.pink}`} aria-hidden />
            )}
            <img ref={femaleImgRef} src={femaleImg} alt={t('gender.female')} className={styles.characterImg} loading="lazy" />
          </div>
        </div>
      </div>

      {/* Gender label row — sits just above NEXT button */}
      <div className={styles.genderLabelRow}>
        <button
          type="button"
          className={`${styles.genderLabelBtn} ${selected === 'male' ? styles.genderLabelSelected : ''}`}
          onClick={() => setSelected('male')}
        >
          {t('gender.male')}
        </button>
        <button
          type="button"
          className={`${styles.genderLabelBtn} ${selected === 'female' ? styles.genderLabelSelected : ''}`}
          onClick={() => setSelected('female')}
        >
          {t('gender.female')}
        </button>
      </div>

      <button
        type="button"
        className={`${styles.nextBtn} ${selected ? styles.active : styles.inactive}`}
        disabled={!selected}
        onClick={saveGender}
      >
        {t('common.next')}
      </button>
    </div>
  )
}
