-- Add new fields to signups table for rider info modal
-- Run this migration in Supabase SQL editor

ALTER TABLE signups
  ADD COLUMN IF NOT EXISTS contacted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS accepted_terms BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS pickup_confirmed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add comments for documentation
COMMENT ON COLUMN signups.contacted IS 'Whether the rider has been contacted by admin';
COMMENT ON COLUMN signups.accepted_terms IS 'Whether the rider has accepted the terms and conditions';
COMMENT ON COLUMN signups.pickup_confirmed IS 'Whether the pickup has been confirmed with the rider';
COMMENT ON COLUMN signups.admin_notes IS 'Internal notes for admins about this rider';
