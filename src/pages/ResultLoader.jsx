import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { getProfile } from '../lib/profileStorage'
import { calculateRisk } from '../utils/scoring'
import { hasApi, apiGetResult, apiSubmitProfileForResult } from '../lib/api'
import './ResultLoader.css'

export default function ResultLoader() {
  const navigate = useNavigate()
  const location = useLocation()
  const userId = location.state?.userId
  const gender = location.state?.gender
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadAndCompute() {
      try {
        let result = null

        if (hasApi()) {
          try {
            if (userId) {
              const res = await apiGetResult(userId)
              result = res.result
            } else {
              const profile = getProfile()
              if (!profile || !profile.gender) {
                navigate('/', { replace: true })
                return
              }
              const res = await apiSubmitProfileForResult(profile)
              result = res.result
            }
          } catch (apiErr) {
            // Backend down or POST /api/result failed: fall back to local calculation
            const profile = getProfile()
            if (profile?.gender) result = calculateRisk(profile)
          }
        }
        if (result == null) {
          let profile = null
          if (userId && supabase) {
            const { data, error: fetchError } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', userId)
              .single()
            if (cancelled) return
            if (fetchError) {
              profile = getProfile()
              if (!profile) {
                setError(fetchError.message)
                return
              }
            } else {
              profile = data
            }
          } else {
            profile = getProfile()
          }
          if (cancelled) return
          if (!profile || !profile.gender) {
            navigate('/', { replace: true })
            return
          }
          result = calculateRisk(profile)
        }

        if (cancelled) return
        if (!result) {
          navigate('/', { replace: true })
          return
        }

        navigate('/result', { state: { result, userId, gender, playAnimation: true }, replace: true })
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Something went wrong')
      }
    }

    loadAndCompute()
    return () => { cancelled = true }
  }, [userId, gender, navigate])

  if (error) {
    return (
      <div className="result-loader-page">
        <p className="result-loader-error">{error}</p>
        <button type="button" className="result-loader-btn" onClick={() => navigate('/habits', { state: { userId, gender } })}>
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="result-loader-page">
      <div className="result-loader-spinner" aria-hidden />
      <p className="result-loader-text">Calculating your result…</p>
    </div>
  )
}
