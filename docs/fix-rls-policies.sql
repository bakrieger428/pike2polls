-- ============================================================================
-- Fix RLS Policies for Pike2ThePolls
-- ============================================================================
-- Run this in Supabase SQL Editor if the verification script shows RLS issues
-- This ensures public users can create signups while protecting data
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public users can create signups" ON public.signups;
DROP POLICY IF EXISTS "Admin users can view all signups" ON public.signups;
DROP POLICY IF EXISTS "Admin users can update signups" ON public.signups;
DROP POLICY IF EXISTS "Admin users can delete signups" ON public.signups;

-- ============================================================================
-- CREATE CORRECTED POLICIES
-- ============================================================================

-- Policy 1: Allow anonymous users to INSERT new signups
-- This enables the public signup form to work
CREATE POLICY "Public users can create signups"
ON public.signups
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy 2: Allow authenticated users to SELECT all signups
-- Admin users must be logged in to view data
CREATE POLICY "Authenticated users can view all signups"
ON public.signups
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Allow authenticated users to UPDATE any signup
CREATE POLICY "Authenticated users can update signups"
ON public.signups
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 4: Allow authenticated users to DELETE signups
CREATE POLICY "Authenticated users can delete signups"
ON public.signups
FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- VERIFICATION QUERY
-- Run this to verify policies are created correctly
-- ============================================================================

-- This should show 4 policies for the signups table
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
WHERE tablename = 'signups';

-- ============================================================================
-- EXPECTED OUTPUT
-- ============================================================================
-- You should see 4 policies:
-- 1. Public users can create signups (INSERT for anon)
-- 2. Authenticated users can view all signups (SELECT for authenticated)
-- 3. Authenticated users can update signups (UPDATE for authenticated)
-- 4. Authenticated users can delete signups (DELETE for authenticated)
-- ============================================================================
