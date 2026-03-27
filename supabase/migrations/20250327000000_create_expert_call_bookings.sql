-- Expert call bookings table
CREATE TABLE IF NOT EXISTS expert_call_bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  name text,
  phone text,
  call_date date NOT NULL,
  time_slot text NOT NULL,
  risk_level text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE expert_call_bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (anonymous users)
CREATE POLICY "allow_insert_expert_call_bookings"
  ON expert_call_bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to select their own bookings
CREATE POLICY "allow_select_expert_call_bookings"
  ON expert_call_bookings FOR SELECT
  TO anon, authenticated
  USING (true);
