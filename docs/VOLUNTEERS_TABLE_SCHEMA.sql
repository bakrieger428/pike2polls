-- Volunteers Table Schema for Pike2ThePolls
-- This table stores volunteer signup information
-- Run this in your Supabase SQL Editor to create the table

-- Create the volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contact information
  first_name TEXT NOT NULL CHECK (char_length(first_name) >= 2 AND char_length(first_name) <= 50),
  last_name TEXT NOT NULL CHECK (char_length(last_name) >= 2 AND char_length(last_name) <= 50),
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- Volunteer roles (can select multiple)
  is_driver BOOLEAN DEFAULT FALSE,
  is_logistical_support BOOLEAN DEFAULT FALSE,

  -- Availability (can select multiple days)
  may_2 BOOLEAN DEFAULT FALSE,        -- May 2, 2026 (Early Voting)
  may_3 BOOLEAN DEFAULT FALSE,        -- May 3, 2026 (Early Voting)
  may_5 BOOLEAN DEFAULT FALSE,        -- May 5, 2026 (Election Day)
  all_days BOOLEAN DEFAULT FALSE,     -- All three days

  -- Time slots (array of selected time slots)
  time_slots TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Optional notes
  notes TEXT,

  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_volunteers_created_at ON volunteers(created_at DESC);

-- Add comment for documentation
COMMENT ON TABLE volunteers IS 'Volunteer signups for Pike2ThePolls ride-to-polls campaign';
COMMENT ON COLUMN volunteers.is_driver IS 'Volunteer can provide transportation to polling places';
COMMENT ON COLUMN volunteers.is_logistical_support IS 'Volunteer can help with coordination, check-in, phone calls';
COMMENT ON COLUMN volunteers.may_2 IS 'Available on May 2, 2026 (Early Voting)';
COMMENT ON COLUMN volunteers.may_3 IS 'Available on May 3, 2026 (Early Voting)';
COMMENT ON COLUMN volunteers.may_5 IS 'Available on May 5, 2026 (Election Day)';
COMMENT ON COLUMN volunteers.all_days IS 'Available on all three days (May 2, 3, and 5)';
COMMENT ON COLUMN volunteers.time_slots IS 'Array of available time slots (e.g., "8:00 AM - 10:00 AM")';
COMMENT ON COLUMN volunteers.status IS 'Volunteer status: pending, confirmed, or cancelled';

-- Enable Row Level Security (RLS)
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for public inserts (anyone can submit a volunteer application)
CREATE POLICY "Allow public insert on volunteers"
  ON volunteers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create RLS policy for admin select/view (only authenticated admins can view volunteers)
CREATE POLICY "Allow admin select on volunteers"
  ON volunteers
  FOR SELECT
  TO authenticated
  USING (
    -- Check if user email has an authorized admin domain
    (auth.jwt() ->> 'email')::text LIKE '%@pike2thepolls.com'
    OR (auth.jwt() ->> 'email')::text LIKE '%@trustee.pike.in.gov'
  );

-- Create RLS policy for admin update (only authenticated admins can update volunteer status)
CREATE POLICY "Allow admin update on volunteers"
  ON volunteers
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'email')::text LIKE '%@pike2thepolls.com'
    OR (auth.jwt() ->> 'email')::text LIKE '%@trustee.pike.in.gov'
  )
  WITH CHECK (
    (auth.jwt() ->> 'email')::text LIKE '%@pike2thepolls.com'
    OR (auth.jwt() ->> 'email')::text LIKE '%@trustee.pike.in.gov'
  );

-- Create RLS policy for admin delete (only authenticated admins can delete volunteer records)
CREATE POLICY "Allow admin delete on volunteers"
  ON volunteers
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'email')::text LIKE '%@pike2thepolls.com'
    OR (auth.jwt() ->> 'email')::text LIKE '%@trustee.pike.in.gov'
  );
