-- Add DELETE policies to all tables so rows can be removed via dashboard or API

CREATE POLICY "Allow anonymous delete" ON user_profiles
  FOR DELETE
  USING (true);

CREATE POLICY "Allow anonymous delete" ON home_test_bookings
  FOR DELETE
  USING (true);

CREATE POLICY "Allow anonymous delete" ON expert_call_bookings
  FOR DELETE
  USING (true);

CREATE POLICY "Allow anonymous delete" ON blood_reports
  FOR DELETE
  USING (true);
