-- ============================================================
-- FULL SCHEMA FOR DIABETES CHECKER APP
-- Run this in the Supabase SQL Editor for project: jkunhkzscrozcghnbxnn
-- ============================================================

-- 1. Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  gender TEXT,
  name TEXT,
  phone TEXT,
  age_range TEXT,
  gestational_diabetes TEXT,
  weight_kg NUMERIC,
  height_cm NUMERIC,
  family_history TEXT,
  hip_size TEXT,
  physical_activity_level TEXT,
  junk_food_frequency TEXT,
  outside_food_frequency TEXT,
  carbohydrate_type TEXT,
  sugary_beverages TEXT,
  sleep_duration TEXT,
  snoring TEXT,
  weight_gain TEXT,
  stress_level TEXT,
  medical_conditions TEXT,
  symptoms TEXT,
  habits TEXT,
  -- Added in migration 20250304
  hba1c NUMERIC,
  fasting_glucose NUMERIC,
  blood_report_analyzed_at TIMESTAMPTZ,
  -- Added in migration 20250322
  age TEXT,
  location TEXT
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON user_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous select" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous update" ON user_profiles
  FOR UPDATE USING (true) WITH CHECK (true);

-- 2. Create home_test_bookings table
CREATE TABLE IF NOT EXISTS home_test_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  address TEXT NOT NULL,
  pincode TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  test_panel TEXT NOT NULL DEFAULT 'HbA1c + Fasting Blood Sugar Panel',
  profile_id UUID
);

ALTER TABLE home_test_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON home_test_bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous select" ON home_test_bookings
  FOR SELECT USING (true);

-- 3. Create blood_reports table (columns match BloodTestForm + dashboard)
CREATE TABLE IF NOT EXISTS blood_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  lab_name TEXT,
  notes TEXT,
  hba1c NUMERIC(5,2),
  fasting_glucose NUMERIC(7,2),
  total_cholesterol NUMERIC(7,2),
  ldl_cholesterol NUMERIC(7,2),
  hdl_cholesterol NUMERIC(7,2),
  triglycerides NUMERIC(7,2),
  hemoglobin NUMERIC(7,2),
  blood_pressure_systolic NUMERIC(3,0),
  blood_pressure_diastolic NUMERIC(3,0),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blood_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert on blood_reports" ON blood_reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous select on blood_reports" ON blood_reports
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous update on blood_reports" ON blood_reports
  FOR UPDATE USING (true) WITH CHECK (true);

-- 4. Create expert_call_bookings table
CREATE TABLE IF NOT EXISTS expert_call_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID,
  name TEXT,
  phone TEXT,
  call_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  risk_level TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE expert_call_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_insert_expert_call_bookings" ON expert_call_bookings
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "allow_select_expert_call_bookings" ON expert_call_bookings
  FOR SELECT TO anon, authenticated USING (true);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_blood_reports_user_id ON blood_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_blood_reports_report_date ON blood_reports(report_date);
