-- Home test booking requests (from "I don't have a report" flow)
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

  profile_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL
);

ALTER TABLE home_test_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON home_test_bookings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select" ON home_test_bookings
  FOR SELECT
  USING (true);
