import React, { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface BloodTestFormProps {
  userId: string
  onSuccess?: () => void
}

export default function BloodTestForm({ userId, onSuccess }: BloodTestFormProps) {
  const [formData, setFormData] = useState({
    report_date: new Date().toISOString().split('T')[0],
    lab_name: '',
    hba1c: '',
    fasting_glucose: '',
    total_cholesterol: '',
    ldl_cholesterol: '',
    hdl_cholesterol: '',
    triglycerides: '',
    hemoglobin: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    notes: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Convert empty strings to null for numeric fields
      const dataToSubmit = {
        user_id: userId,
        report_date: formData.report_date,
        lab_name: formData.lab_name || null,
        hba1c: formData.hba1c ? parseFloat(formData.hba1c) : null,
        fasting_glucose: formData.fasting_glucose ? parseFloat(formData.fasting_glucose) : null,
        total_cholesterol: formData.total_cholesterol ? parseFloat(formData.total_cholesterol) : null,
        ldl_cholesterol: formData.ldl_cholesterol ? parseFloat(formData.ldl_cholesterol) : null,
        hdl_cholesterol: formData.hdl_cholesterol ? parseFloat(formData.hdl_cholesterol) : null,
        triglycerides: formData.triglycerides ? parseFloat(formData.triglycerides) : null,
        hemoglobin: formData.hemoglobin ? parseFloat(formData.hemoglobin) : null,
        blood_pressure_systolic: formData.blood_pressure_systolic ? parseFloat(formData.blood_pressure_systolic) : null,
        blood_pressure_diastolic: formData.blood_pressure_diastolic ? parseFloat(formData.blood_pressure_diastolic) : null,
        notes: formData.notes || null
      }

      const { error: insertError } = await supabase
        .from('blood_reports')
        .insert([dataToSubmit])

      if (insertError) throw insertError

      setSuccess(true)
      setFormData({
        report_date: new Date().toISOString().split('T')[0],
        lab_name: '',
        hba1c: '',
        fasting_glucose: '',
        total_cholesterol: '',
        ldl_cholesterol: '',
        hdl_cholesterol: '',
        triglycerides: '',
        hemoglobin: '',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        notes: ''
      })

      if (onSuccess) {
        setTimeout(onSuccess, 1500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save blood test')
      console.error('Submit error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Blood Test Results</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          ✓ Blood test results saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Date *
            </label>
            <input
              type="date"
              name="report_date"
              value={formData.report_date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lab Name (Optional)
            </label>
            <input
              type="text"
              name="lab_name"
              placeholder="e.g., Apollo Hospitals, Metropolis Lab"
              value={formData.lab_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Glucose Tests */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Glucose Markers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HbA1c (%)
              </label>
              <input
                type="number"
                name="hba1c"
                placeholder="e.g., 6.5"
                step="0.1"
                value={formData.hba1c}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Normal: &lt;5.7%</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fasting Glucose (mg/dL)
              </label>
              <input
                type="number"
                name="fasting_glucose"
                placeholder="e.g., 100"
                value={formData.fasting_glucose}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Normal: &lt;100 mg/dL</p>
            </div>
          </div>
        </div>

        {/* Lipid Profile */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lipid Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Cholesterol
              </label>
              <input
                type="number"
                name="total_cholesterol"
                placeholder="e.g., 200"
                value={formData.total_cholesterol}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Normal: &lt;200</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LDL Cholesterol
              </label>
              <input
                type="number"
                name="ldl_cholesterol"
                placeholder="e.g., 130"
                value={formData.ldl_cholesterol}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Optimal: &lt;100</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HDL Cholesterol
              </label>
              <input
                type="number"
                name="hdl_cholesterol"
                placeholder="e.g., 40"
                value={formData.hdl_cholesterol}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Desirable: &gt;40 (M), &gt;50 (F)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Triglycerides
              </label>
              <input
                type="number"
                name="triglycerides"
                placeholder="e.g., 150"
                value={formData.triglycerides}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Normal: &lt;150</p>
            </div>
          </div>
        </div>

        {/* Other Tests */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Tests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hemoglobin (g/dL)
              </label>
              <input
                type="number"
                name="hemoglobin"
                placeholder="e.g., 13.5"
                step="0.1"
                value={formData.hemoglobin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Normal: 13.5-17.5 (M), 12-15.5 (F)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Pressure (Systolic/Diastolic)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="blood_pressure_systolic"
                  placeholder="120"
                  value={formData.blood_pressure_systolic}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="flex items-center text-gray-600">/</span>
                <input
                  type="number"
                  name="blood_pressure_diastolic"
                  placeholder="80"
                  value={formData.blood_pressure_diastolic}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Normal: &lt;120/80</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            name="notes"
            placeholder="Any additional observations or notes about the blood test..."
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Blood Test Results'}
          </button>
          <button
            type="reset"
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Reference Values Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Reference Values Guide</h4>
        <p className="text-sm text-blue-800">
          The reference values shown are general guidelines. Your lab may have different normal ranges
          based on age, gender, and testing methodology. Always consult with your healthcare provider
          for personalized interpretation.
        </p>
      </div>
    </div>
  )
}
