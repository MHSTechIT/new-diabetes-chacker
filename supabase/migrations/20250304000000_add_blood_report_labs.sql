-- Add blood report lab fields to user_profiles (from AI analysis)
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS hba1c NUMERIC,
  ADD COLUMN IF NOT EXISTS fasting_glucose NUMERIC,
  ADD COLUMN IF NOT EXISTS blood_report_analyzed_at TIMESTAMPTZ;

COMMENT ON COLUMN user_profiles.hba1c IS 'HbA1c % from uploaded blood report (AI-extracted)';
COMMENT ON COLUMN user_profiles.fasting_glucose IS 'Fasting blood glucose mg/dL from uploaded report (AI-extracted)';
COMMENT ON COLUMN user_profiles.blood_report_analyzed_at IS 'When the blood report was last analyzed';
