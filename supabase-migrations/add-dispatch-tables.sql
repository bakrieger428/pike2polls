-- Migration: Add Dispatch Feature Tables
-- Created: 2026-03-06
-- Purpose: Support rider grouping, driver assignment, and route manifests

-- 1. Geocoded addresses cache (avoid re-geocoding same addresses)
CREATE TABLE geocoded_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL UNIQUE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  formatted_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Driver assignments (link drivers to rider groups)
CREATE TABLE driver_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
  voting_date TEXT NOT NULL, -- 'early-voting-date-1', 'early-voting-date-2', 'election-day'
  preferred_time TEXT NOT NULL,
  group_id UUID NOT NULL, -- Links to a specific group
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in-progress', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Rider groups (store grouped riders)
CREATE TABLE rider_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voting_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  group_name TEXT, -- Optional: e.g., "Downtown Morning Group"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Group members (link riders to groups)
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES rider_groups(id) ON DELETE CASCADE,
  signup_id UUID NOT NULL REFERENCES signups(id) ON DELETE CASCADE,
  pickup_order INTEGER, -- Order for route manifest (1, 2, 3...)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, signup_id)
);

-- Indexes for performance
CREATE INDEX idx_geocoded_addresses_address ON geocoded_addresses(address);
CREATE INDEX idx_driver_assignments_volunteer ON driver_assignments(volunteer_id);
CREATE INDEX idx_driver_assignments_voting_date ON driver_assignments(voting_date, preferred_time);
CREATE INDEX idx_rider_groups_voting_date ON rider_groups(voting_date, preferred_time);
CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_signup ON group_members(signup_id);

-- RLS Policies
ALTER TABLE geocoded_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rider_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Allow authenticated admins to manage dispatch data
CREATE POLICY "Admins can manage geocoded addresses"
  ON geocoded_addresses FOR ALL
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@pike2thepolls.com' OR email LIKE '%@trustee.pike.in.gov'));

CREATE POLICY "Admins can manage driver assignments"
  ON driver_assignments FOR ALL
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@pike2thepolls.com' OR email LIKE '%@trustee.pike.in.gov'));

CREATE POLICY "Admins can manage rider groups"
  ON rider_groups FOR ALL
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@pike2thepolls.com' OR email LIKE '%@trustee.pike.in.gov'));

CREATE POLICY "Admins can manage group members"
  ON group_members FOR ALL
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@pike2thepolls.com' OR email LIKE '%@trustee.pike.in.gov'));
