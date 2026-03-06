-- ============================================
-- Volunteers Table Row-Level Security (RLS) Policies
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable RLS on the volunteers table
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for public volunteer signup form)
CREATE POLICY "Allow volunteer anonymous inserts"
ON volunteers
FOR INSERT
WITH CHECK (true);

-- Create policy to allow anonymous reads (for admin dashboard to view volunteers)
CREATE POLICY "Allow volunteer anonymous reads"
ON volunteers
FOR SELECT
USING (true);

-- Verify policies were created
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'volunteers';

-- Expected output:
-- schemaname | tablename | policyname                           | permissive | roles | cmd  | qual | with_check
-- -----------|-----------|--------------------------------------|------------|-------|------|------|------------
-- public     | volunteers | Allow volunteer anonymous inserts  | t          | {}    | insert| (null)| (true)
-- public     | volunteers | Allow volunteer anonymous reads    | t          | {}    | select| (true)| (null)
