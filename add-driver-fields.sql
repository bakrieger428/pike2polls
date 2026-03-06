-- ============================================
-- Add Driver Information Fields to Volunteers Table
-- Run this in Supabase SQL Editor
-- ============================================

-- Add driver information columns to volunteers table
ALTER TABLE volunteers
ADD COLUMN IF NOT EXISTS vehicle_make_model TEXT,
ADD COLUMN IF NOT EXISTS number_of_seats INTEGER,
ADD COLUMN IF NOT EXISTS license_plate TEXT,
ADD COLUMN IF NOT EXISTS drive_alone_preference TEXT CHECK (drive_alone_preference IN ('alone', 'paired')),
ADD COLUMN IF NOT EXISTS has_valid_insurance BOOLEAN,
ADD COLUMN IF NOT EXISTS driving_history_issues TEXT CHECK (driving_history_issues IN ('yes', 'speeding_tickets_only', 'no')),
ADD COLUMN IF NOT EXISTS needs_gas_reimbursement BOOLEAN;

-- Verify columns were added
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'volunteers'
AND column_name IN (
    'vehicle_make_model',
    'number_of_seats',
    'license_plate',
    'drive_alone_preference',
    'has_valid_insurance',
    'driving_history_issues',
    'needs_gas_reimbursement'
)
ORDER BY ordinal_position;

-- Expected output:
-- column_name              | data_type | is_nullable | column_default
-- ------------------------|-----------|-------------|----------------
-- vehicle_make_model      | text      | YES         | NULL
-- number_of_seats         | integer   | YES         | NULL
-- license_plate           | text      | YES         | NULL
-- drive_alone_preference  | text      | YES         | NULL
-- has_valid_insurance     | boolean   | YES         | NULL
-- driving_history_issues  | text      | YES         | NULL
-- needs_gas_reimbursement | boolean   | YES         | NULL
