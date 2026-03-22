-- Add age and location columns to user_profiles (from "Almost there!" modal)
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS age TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT;
