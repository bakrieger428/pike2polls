-- ============================================================================
-- Pike2ThePolls Database Schema for Supabase
-- ============================================================================
-- This SQL script creates the database tables, Row Level Security (RLS) policies,
-- and other database objects needed for the Pike2ThePolls application.
--
-- Run this in the Supabase SQL Editor:
-- 1. Go to https://supabase.com/dashboard/project/_/sql/new
-- 2. Copy and paste this entire script
-- 3. Click "Run" to execute
--
-- @see SUPABASE_DEPLOYMENT.md for full setup instructions
-- ============================================================================

-- ============================================================================
-- TABLE: signups
-- Stores ride signup requests from Pike Township residents
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.signups (
  -- Primary key
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Resident information (required)
  first_name TEXT NOT NULL CHECK (char_length(first_name) >= 2),
  last_name TEXT NOT NULL CHECK (char_length(last_name) >= 2),
  is_pike_resident BOOLEAN NOT NULL,
  is_registered_voter BOOLEAN NOT NULL,

  -- Voting preferences (required)
  voting_date TEXT NOT NULL CHECK (voting_date IN ('early-voting-date-1', 'early-voting-date-2', 'election-day')),
  preferred_time TEXT NOT NULL CHECK (preferred_time ~ '^([0-1]?[0-9]|2[0-3]):[0-5][0-9] [AP]M$'),

  -- Contact information (optional)
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),

  -- Constraints
  CONSTRAINT valid_email CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~* '^[\d\s\-\+\(\)]{10,}$'),
  CONSTRAINT eligible_resident CHECK (
    (is_pike_resident = true) OR
    (is_pike_resident = false AND is_registered_voter = false AND status = 'cancelled')
  ),
  CONSTRAINT eligible_voter CHECK (
    (is_registered_voter = true) OR
    (is_registered_voter = false AND status = 'cancelled')
  )
);

-- ============================================================================
-- INDEXES
-- Improve query performance for common lookups
-- ============================================================================

-- Index for status filtering (admin dashboard)
CREATE INDEX IF NOT EXISTS idx_signups_status ON public.signups(status);

-- Index for date filtering (admin dashboard)
CREATE INDEX IF NOT EXISTS idx_signups_voting_date ON public.signups(voting_date);

-- Index for time filtering (admin dashboard)
CREATE INDEX IF NOT EXISTS idx_signups_preferred_time ON public.signups(preferred_time);

-- Index for created_at sorting (newest first)
CREATE INDEX IF NOT EXISTS idx_signups_created_at ON public.signups(created_at DESC);

-- Composite index for admin dashboard filters
CREATE INDEX IF NOT EXISTS idx_signups_status_date ON public.signups(status, voting_date);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Protects data based on user authentication and roles
-- ============================================================================

-- Enable RLS on the signups table
ALTER TABLE public.signups ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- Define who can do what with the data
-- ============================================================================

-- Policy 1: Public users can INSERT new signups (ride requests)
-- This allows the signup form to work without authentication
CREATE POLICY "Public users can create signups"
ON public.signups
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy 2: Authenticated admin users can SELECT all signups
-- Admin users must be authenticated via Supabase Auth
CREATE POLICY "Admin users can view all signups"
ON public.signups
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Authenticated admin users can UPDATE any signup
-- Allows admin to change status, add notes, etc.
CREATE POLICY "Admin users can update signups"
ON public.signups
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 4: Authenticated admin users can DELETE signups
-- Allows admin to remove fraudulent or duplicate entries
CREATE POLICY "Admin users can delete signups"
ON public.signups
FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- FUNCTION: validate_signup_eligibility()
-- Ensures signup meets eligibility requirements before insert
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_signup_eligibility()
RETURNS TRIGGER AS $$
DECLARE
  is_eligible BOOLEAN;
BEGIN
  -- Check if user is both a Pike Township resident AND registered voter
  is_eligible := NEW.is_pike_resident = true AND NEW.is_registered_voter = true;

  -- If not eligible, automatically set status to cancelled
  IF NOT is_eligible THEN
    NEW.status := 'cancelled';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGER: Apply eligibility validation on insert
-- ============================================================================

CREATE TRIGGER trigger_validate_signup_eligibility
BEFORE INSERT ON public.signups
FOR EACH ROW
EXECUTE FUNCTION validate_signup_eligibility();

-- ============================================================================
-- FUNCTION: update_signup_timestamp()
-- Automatically updates updated_at timestamp (if we add it later)
-- ============================================================================

-- Note: We don't have an updated_at column currently, but this function
-- can be used if we add one in the future.

-- ============================================================================
-- COMMENTS
-- Document the database schema for other developers
-- ============================================================================

COMMENT ON TABLE public.signups IS 'Stores ride signup requests from Pike Township residents for election day transportation';

COMMENT ON COLUMN public.signups.id IS 'Unique identifier for each signup request';
COMMENT ON COLUMN public.signups.created_at IS 'Timestamp when the signup was created';
COMMENT ON COLUMN public.signups.first_name IS 'Resident first name (required, min 2 chars)';
COMMENT ON COLUMN public.signups.last_name IS 'Resident last name (required, min 2 chars)';
COMMENT ON COLUMN public.signups.is_pike_resident IS 'Whether the requester is a Pike Township resident';
COMMENT ON COLUMN public.signups.is_registered_voter IS 'Whether the requester is registered to vote in Indiana';
COMMENT ON COLUMN public.signups.voting_date IS 'Preferred voting date (early voting options or election day)';
COMMENT ON COLUMN public.signups.preferred_time IS 'Preferred polling time slot (8 AM - 6 PM)';
COMMENT ON COLUMN public.signups.email IS 'Contact email (optional)';
COMMENT ON COLUMN public.signups.phone IS 'Contact phone number (optional)';
COMMENT ON COLUMN public.signups.address IS 'Pickup address (optional)';
COMMENT ON COLUMN public.signups.notes IS 'Additional notes or special requirements (optional)';
COMMENT ON COLUMN public.signups.status IS 'Signup status: pending (new), confirmed (ride scheduled), cancelled (ineligible or cancelled)';

-- ============================================================================
-- TEST DATA (OPTIONAL)
-- Uncomment to insert test data for development
-- ============================================================================

-- INSERT INTO public.signups (first_name, last_name, is_pike_resident, is_registered_voter, voting_date, preferred_time, email, phone, address)
-- VALUES
--   ('John', 'Doe', true, true, 'election-day', '9:00 AM', 'john@example.com', '317-555-0100', '123 Main St, Indianapolis, IN 46220'),
--   ('Jane', 'Smith', true, true, 'early-voting-date-1', '2:00 PM', 'jane@example.com', '317-555-0200', '456 Oak Ave, Indianapolis, IN 46220'),
--   ('Bob', 'Johnson', false, true, 'election-day', '10:00 AM', 'bob@example.com', '317-555-0300', '789 Pine Rd, Indianapolis, IN 46201');

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
-- Your database is now ready!
--
-- Next steps:
-- 1. Set up Supabase Auth for admin users (see SUPABASE_DEPLOYMENT.md)
-- 2. Test the signup form
-- 3. Verify RLS policies are working correctly
--
-- For security review, ensure:
-- - RLS is enabled on the signups table
-- - Policies allow anon users to INSERT only
-- - Policies require authentication for SELECT/UPDATE/DELETE
-- ============================================================================
