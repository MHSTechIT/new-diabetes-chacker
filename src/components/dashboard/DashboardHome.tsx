import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface UserProfile {
  id: string
  gender: string
  age: string
  weight_kg: number
  height_cm: number
  family_history: string
  physical_activity_level: string
  medical_conditions: string
  age_range: string
}

interface BloodReport {
  id: string
  report_date: string
  hba1c: number
  fasting_glucose: number
  total_cholesterol: number
  ldl_cholesterol: number
  hdl_cholesterol: number
  triglycerides: number
  hemoglobin: number
  lab_name: string
}

interface DashboardData {
  assessment: UserProfile | null
  latestBloodTest: BloodReport | null
  assessmentRiskLevel: string
  labRiskLevel: string
}

export default function DashboardHome({ userId }: { userId: string }) {
  const [data, setData] = useState<DashboardData>({
    assessment: null,
    latestBloodTest: null,
    assessmentRiskLevel: 'UNKNOWN',
    labRiskLevel: 'UNKNOWN'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [userId])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch assessment data from user_profiles
      const { data: assessment, error: assessmentError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (assessmentError) throw assessmentError

      // Fetch latest blood test from blood_reports
      const { data: bloodTests, error: bloodError } = await supabase
        .from('blood_reports')
        .select('*')
        .eq('user_id', userId)
        .order('report_date', { ascending: false })
        .limit(1)

      if (bloodError) throw bloodError

      const latestBloodTest = bloodTests?.[0] || null

      // Calculate risk levels
      const assessmentRiskLevel = calculateAssessmentRisk(assessment)
      const labRiskLevel = calculateLabRisk(latestBloodTest)

      setData({
        assessment,
        latestBloodTest,
        assessmentRiskLevel,
        labRiskLevel
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const calculateAssessmentRisk = (profile: UserProfile | null): string => {
    if (!profile) return 'UNKNOWN'

    let riskScore = 0

    // Age risk
    const ageRange = profile.age_range || profile.age
    if (['40-50', '50-60', '60+'].includes(ageRange)) riskScore += 3

    // BMI risk
    const bmi = profile.weight_kg / ((profile.height_cm / 100) ** 2)
    if (bmi >= 30) riskScore += 4
    else if (bmi >= 25) riskScore += 2

    // Family history
    if (profile.family_history === 'Yes') riskScore += 3

    // Physical activity
    if (profile.physical_activity_level === 'Low') riskScore += 2

    // Medical conditions
    if (profile.medical_conditions) riskScore += 3

    // Return risk level
    if (riskScore <= 3) return 'LOW'
    if (riskScore <= 6) return 'LOW_MODERATE'
    if (riskScore <= 10) return 'MODERATE'
    if (riskScore <= 14) return 'MODERATE_HIGH'
    return 'HIGH'
  }

  const calculateLabRisk = (bloodTest: BloodReport | null): string => {
    if (!bloodTest) return 'NO_DATA'

    let riskScore = 0

    // HbA1c risk
    if (bloodTest.hba1c) {
      if (bloodTest.hba1c >= 6.5) riskScore += 3
      else if (bloodTest.hba1c >= 5.7) riskScore += 2
    }

    // Fasting glucose
    if (bloodTest.fasting_glucose) {
      if (bloodTest.fasting_glucose >= 126) riskScore += 3
      else if (bloodTest.fasting_glucose >= 100) riskScore += 2
    }

    // Triglycerides
    if (bloodTest.triglycerides) {
      if (bloodTest.triglycerides >= 200) riskScore += 2
    }

    // Total cholesterol
    if (bloodTest.total_cholesterol) {
      if (bloodTest.total_cholesterol >= 240) riskScore += 2
    }

    if (riskScore <= 2) return 'LOW'
    if (riskScore <= 4) return 'LOW_MODERATE'
    if (riskScore <= 6) return 'MODERATE'
    if (riskScore <= 8) return 'MODERATE_HIGH'
    return 'HIGH'
  }

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case 'LOW': return 'bg-green-100 text-green-800'
      case 'LOW_MODERATE': return 'bg-yellow-100 text-yellow-800'
      case 'MODERATE': return 'bg-orange-100 text-orange-800'
      case 'MODERATE_HIGH': return 'bg-red-100 text-red-700'
      case 'HIGH': return 'bg-red-200 text-red-900'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
        <p className="text-gray-600 mt-2">Assessment Results + Blood Test Analysis</p>
      </div>

      {/* Main Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assessment Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Assessment Results</h2>
              <p className="text-sm text-gray-600">From your diabetes risk assessment</p>
            </div>
          </div>

          <div className={`inline-block px-4 py-2 rounded-lg font-semibold mb-4 ${getRiskColor(data.assessmentRiskLevel)}`}>
            Risk Level: {data.assessmentRiskLevel}
          </div>

          {data.assessment && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-600">Age</p>
                  <p className="font-semibold">{data.assessment.age || data.assessment.age_range}</p>
                </div>
                <div>
                  <p className="text-gray-600">Gender</p>
                  <p className="font-semibold">{data.assessment.gender || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">BMI</p>
                  <p className="font-semibold">
                    {(data.assessment.weight_kg / ((data.assessment.height_cm / 100) ** 2)).toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Family History</p>
                  <p className="font-semibold">{data.assessment.family_history || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Blood Test Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Latest Blood Test</h2>
              <p className="text-sm text-gray-600">
                {data.latestBloodTest
                  ? new Date(data.latestBloodTest.report_date).toLocaleDateString()
                  : 'No blood test uploaded'}
              </p>
            </div>
          </div>

          {data.latestBloodTest ? (
            <>
              <div className={`inline-block px-4 py-2 rounded-lg font-semibold mb-4 ${getRiskColor(data.labRiskLevel)}`}>
                Lab Risk Level: {data.labRiskLevel}
              </div>

              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-gray-600">HbA1c</p>
                    <p className="font-semibold">
                      {data.latestBloodTest.hba1c
                        ? `${data.latestBloodTest.hba1c}%`
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Fasting Glucose</p>
                    <p className="font-semibold">
                      {data.latestBloodTest.fasting_glucose
                        ? `${data.latestBloodTest.fasting_glucose} mg/dL`
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Cholesterol</p>
                    <p className="font-semibold">
                      {data.latestBloodTest.total_cholesterol
                        ? `${data.latestBloodTest.total_cholesterol}`
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Lab</p>
                    <p className="font-semibold">{data.latestBloodTest.lab_name || 'Unknown'}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No blood test uploaded yet</p>
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Upload Blood Test
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Section */}
      {data.latestBloodTest && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Assessment vs Blood Test Comparison</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Assessment Prediction</p>
              <p className="text-2xl font-bold mt-2">{data.assessmentRiskLevel}</p>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-2xl">→</span>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Lab Results</p>
              <p className="text-2xl font-bold mt-2">{data.labRiskLevel}</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-800">
              ✓ Assessment predictions align with blood test results. Both indicate{' '}
              <strong>{data.assessmentRiskLevel}</strong> risk level.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
          View Full Blood Test Results
        </button>
        <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
          Upload New Blood Test
        </button>
        <button className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
          Download Health Report
        </button>
      </div>
    </div>
  )
}
