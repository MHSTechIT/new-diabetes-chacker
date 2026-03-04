-- Create user_profiles table for diabetes checker app
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Basic info
  gender TEXT,
  name TEXT,
  phone TEXT,

  -- Quiz answers
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
  habits TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert (for new users starting the quiz)
CREATE POLICY "Allow anonymous insert" ON user_profiles
  FOR INSERT
  WITH CHECK (true);

-- Allow anonymous select (to read own profile by id)
CREATE POLICY "Allow anonymous select" ON user_profiles
  FOR SELECT
  USING (true);

-- Allow anonymous update (to update profile as user progresses)
CREATE POLICY "Allow anonymous update" ON user_profiles
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
