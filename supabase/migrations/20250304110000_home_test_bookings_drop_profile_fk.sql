-- Allow profile_id to be stored without requiring a matching user_profiles row
-- (e.g. profile from different env or anonymous flow)
ALTER TABLE home_test_bookings
  DROP CONSTRAINT IF EXISTS home_test_bookings_profile_id_fkey;
