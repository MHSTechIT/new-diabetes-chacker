import { useEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import { useLanguage } from './context/LanguageContext'
import { preloadAllImages } from './lib/preloadImages'
import { getProfile, clearProfile } from './lib/profileStorage'
import ConfirmModal from './components/ConfirmModal'
import IntroPage from './components/IntroPage'
import GenderSelection from './components/GenderSelection'
import AgeSelection from './pages/AgeSelection'
import GestationalDiabetes from './pages/GestationalDiabetes'
import WeightHeight from './pages/WeightHeight'
import FamilyHistory from './pages/FamilyHistory'
import HipSize from './pages/HipSize'
import PhysicalActivityLevel from './pages/PhysicalActivityLevel'
import JunkFoodFrequency from './pages/JunkFoodFrequency'
import SugaryBeverages from './pages/SugaryBeverages'
import SleepDuration from './pages/SleepDuration'
import WeightGain from './pages/WeightGain'
import StressLevel from './pages/StressLevel'
import MedicalConditions from './pages/MedicalConditions'
import Symptoms from './pages/Symptoms'
import Habits from './pages/Habits'
import ResultLoader from './pages/ResultLoader'
import Result from './pages/Result'
import BookHomeTest from './pages/BookHomeTest'

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const navigationType = useNavigationType()
  const { t } = useLanguage()
  const prevPathRef = useRef(location.pathname)
  const resultStateRef = useRef(null)
  const [showBackConfirm, setShowBackConfirm] = useState(false)
  const [showStartOverConfirm, setShowStartOverConfirm] = useState(false)

  if (location.pathname === '/result' && location.state) {
    const { playAnimation, ...rest } = location.state
    resultStateRef.current = rest
  }

  useEffect(() => {
    const fromResult = prevPathRef.current === '/result'
    const leftResult = location.pathname !== '/result'
    if (fromResult && leftResult && navigationType === 'POP') {
      setShowBackConfirm(true)
    }
    prevPathRef.current = location.pathname
  }, [location.pathname, navigationType])

  // Preload all images on app mount for smooth navigation (no lag when switching pages)
  useEffect(() => {
    preloadAllImages().catch((err) => {
      console.error('Image preloading failed:', err)
      // Continue silently - app still works even if preloading fails
    })
  }, [])

  // Handle page reload detection - if user already started test but reloads mid-test
  useEffect(() => {
    const hasProfile = !!getProfile()
    const isOnIntroPage = location.pathname === '/'

    // If user has started test (has profile) but reloads on a non-intro page
    // ask if they want to start from the beginning
    if (hasProfile && !isOnIntroPage) {
      setShowStartOverConfirm(true)
    }
  }, []) // Run only on mount

  const handleBackConfirmYes = () => {
    setShowBackConfirm(false)
    navigate('/', { replace: true })
  }
  const handleBackConfirmNo = () => {
    setShowBackConfirm(false)
    navigate('/result', { replace: true, state: resultStateRef.current ?? undefined })
  }

  const handleStartOverYes = () => {
    setShowStartOverConfirm(false)
    clearProfile()
    navigate('/', { replace: true })
  }
  const handleStartOverNo = () => {
    setShowStartOverConfirm(false)
  }

  return (
    <>
      {showBackConfirm && (
        <ConfirmModal
          message={t('confirm.backToStart')}
          confirmLabel={t('common.yes')}
          cancelLabel={t('common.no')}
          onConfirm={handleBackConfirmYes}
          onCancel={handleBackConfirmNo}
        />
      )}
      {showStartOverConfirm && (
        <ConfirmModal
          message={t('confirm.startOver')}
          confirmLabel={t('common.yes')}
          cancelLabel={t('common.no')}
          onConfirm={handleStartOverYes}
          onCancel={handleStartOverNo}
        />
      )}
      <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/gender-selection" element={<GenderSelection />} />
      <Route path="/age-selection" element={<AgeSelection />} />
      <Route path="/gestational-diabetes" element={<GestationalDiabetes />} />
      <Route path="/weight-height" element={<WeightHeight />} />
      <Route path="/family-history" element={<FamilyHistory />} />
      <Route path="/hip-size" element={<HipSize />} />
      <Route path="/physical-activity" element={<PhysicalActivityLevel />} />
      <Route path="/junk-food-frequency" element={<JunkFoodFrequency />} />
      <Route path="/sugary-beverages" element={<SugaryBeverages />} />
      <Route path="/sleep-duration" element={<SleepDuration />} />
      <Route path="/weight-gain" element={<WeightGain />} />
      <Route path="/stress-level" element={<StressLevel />} />
      <Route path="/medical-conditions" element={<MedicalConditions />} />
      <Route path="/symptoms" element={<Symptoms />} />
      <Route path="/habits" element={<Habits />} />
      <Route path="/next-step" element={<ResultLoader />} />
      <Route path="/result" element={<Result />} />
      <Route path="/book-home-test" element={<BookHomeTest />} />
      </Routes>
    </>
  )
}
