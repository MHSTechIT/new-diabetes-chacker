# Supabase Setup for Diabetes Checker

## 1. Create the `user_profiles` table

Since you have a new database, run this SQL in your Supabase project:

1. Go to **Supabase Dashboard** → your project → **SQL Editor**
2. Click **New query**
3. Copy and paste the contents of `migrations/20250303000000_create_user_profiles.sql`
4. Click **Run**

Or run the SQL below directly:

```sql
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

-- Allow insert, select, update for the app
CREATE POLICY "Allow anonymous insert" ON user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous select" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Allow anonymous update" ON user_profiles FOR UPDATE USING (true) WITH CHECK (true);
```

## 2. Configure environment variables

Create a `.env` file in the project root (or set in Vite):

```
VITE_SUPABASE_URL=https://yqmomeddcflhtpssldrn.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Use your **Project URL** and **anon/public** key from Supabase → Settings → API.
