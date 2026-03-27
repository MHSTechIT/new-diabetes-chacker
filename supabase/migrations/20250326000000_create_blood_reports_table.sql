-- Create blood_reports table to store blood test reports linked to user_profiles
CREATE TABLE IF NOT EXISTS blood_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,

  -- Report metadata
  report_date DATE NOT NULL,
  lab_name TEXT,
  file_url TEXT,
  notes TEXT,

  -- Complete blood report data (comprehensive fields)
  hba1c NUMERIC(5,2),
  fasting_glucose NUMERIC(7,2),

  -- Lipid Profile
  total_cholesterol NUMERIC(7,2),
  ldl_cholesterol NUMERIC(7,2),
  hdl_cholesterol NUMERIC(7,2),
  triglycerides NUMERIC(7,2),

  -- Liver Function
  ast NUMERIC(7,2),
  alt NUMERIC(7,2),
  alkaline_phosphatase NUMERIC(7,2),
  total_bilirubin NUMERIC(7,2),

  -- Kidney Function
  creatinine NUMERIC(7,2),
  urea NUMERIC(7,2),
  uric_acid NUMERIC(7,2),

  -- Complete Blood Count (CBC)
  hemoglobin NUMERIC(7,2),
  hematocrit NUMERIC(7,2),
  wbc NUMERIC(7,2),
  platelets NUMERIC(7,2),

  -- Other important markers
  tsh NUMERIC(7,3),
  blood_pressure_systolic NUMERIC(3,0),
  blood_pressure_diastolic NUMERIC(3,0),
  bmi NUMERIC(5,2),

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create blood_test_history table for tracking changes over time
CREATE TABLE IF NOT EXISTS blood_test_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blood_report_id UUID NOT NULL REFERENCES blood_reports(id) ON DELETE CASCADE,
  test_name TEXT NOT NULL,
  value NUMERIC(10,2),
  unit TEXT,
  normal_min NUMERIC(10,2),
  normal_max NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create test_reference_ranges table for normal values by age/gender
CREATE TABLE IF NOT EXISTS test_reference_ranges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name TEXT NOT NULL,
  age_range TEXT, -- 'all', '18-30', '30-50', '50+'
  gender TEXT, -- 'all', 'male', 'female'
  min_value NUMERIC(10,2),
  max_value NUMERIC(10,2),
  unit TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) on new tables
ALTER TABLE blood_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_test_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_reference_ranges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blood_reports
CREATE POLICY "Users can view their own blood reports" ON blood_reports
  FOR SELECT
  USING (user_id = (SELECT id FROM user_profiles LIMIT 1));

CREATE POLICY "Users can insert their own blood reports" ON blood_reports
  FOR INSERT
  WITH CHECK (user_id = (SELECT id FROM user_profiles LIMIT 1));

CREATE POLICY "Users can update their own blood reports" ON blood_reports
  FOR UPDATE
  USING (user_id = (SELECT id FROM user_profiles LIMIT 1))
  WITH CHECK (user_id = (SELECT id FROM user_profiles LIMIT 1));

-- RLS Policies for blood_test_history (allow viewing associated report history)
CREATE POLICY "Users can view their blood test history" ON blood_test_history
  FOR SELECT
  USING (blood_report_id IN (SELECT id FROM blood_reports WHERE user_id = (SELECT id FROM user_profiles LIMIT 1)));

-- RLS Policies for test_reference_ranges (public read, admin write)
CREATE POLICY "Anyone can view test reference ranges" ON test_reference_ranges
  FOR SELECT
  USING (true);

-- Add indexes for performance
CREATE INDEX idx_blood_reports_user_id ON blood_reports(user_id);
CREATE INDEX idx_blood_reports_report_date ON blood_reports(report_date);
CREATE INDEX idx_blood_test_history_report_id ON blood_test_history(blood_report_id);
CREATE INDEX idx_test_reference_ranges_test_name ON test_reference_ranges(test_name);

-- Add comments
COMMENT ON TABLE blood_reports IS 'Stores complete blood test reports for each user';
COMMENT ON TABLE blood_test_history IS 'Historical tracking of blood test values over time';
COMMENT ON TABLE test_reference_ranges IS 'Reference normal ranges for blood tests by age and gender';
