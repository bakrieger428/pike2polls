# Rider Dispatch Grouping Feature - Implementation Plan

## Context

The Pike2ThePolls admin dashboard currently displays ride signups and volunteers in separate tabbed views with basic filtering by status. To optimize driver dispatch operations, we need to intelligently group riders by voting date/time and geographic proximity, assign drivers to groups, and generate route manifests for election day logistics.

**Current State:**
- Admin dashboard at `src/app/admin/page.tsx` with "Ride Signups" and "Volunteers" tabs
- Signups have: `voting_date`, `preferred_time`, `address` (text string), `status`
- Volunteers have: `is_driver`, `number_of_seats`, `vehicle_make_model`, driver preferences
- No grouping, proximity calculation, or driver assignment features
- No route manifest generation

**Goal:** Enable efficient driver dispatch by grouping nearby riders going to vote at the same time, assigning drivers, and generating manifests for driving days.

---

## Requirements Summary

1. **Geocoding**: Use Mapbox Geocoding API to convert addresses to coordinates for precise proximity calculation
2. **Grouping Logic**: Group by voting date/time first, then by geographic proximity (2-mile radius)
3. **View Options**: Add both a new "Dispatch" tab AND a "Grouped View" toggle on the existing "Ride Signups" tab
4. **Driver Assignment**: View optimal groups, manually assign drivers, save assignments to database
5. **Route Manifests**: Generate detailed manifests for drivers showing pickup order and addresses
6. **Capacity Matching**: Not required for MVP (future feature)

---

## Environment Variables Required

**Mapbox API Key:**
```
Your_mapbox_token_here
```

Add to `.env.local` and Vercel environment variables:

```bash
# Mapbox Geocoding API
NEXT_PUBLIC_MAPBOX_TOKEN=Your_mapbox_token_here

# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Database Schema Changes

### New Tables to Add

Create file: `supabase-migrations/add-dispatch-tables.sql`

```sql
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
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@pike2thepolls.com'));

CREATE POLICY "Admins can manage driver assignments"
  ON driver_assignments FOR ALL
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@pike2thepolls.com'));

CREATE POLICY "Admins can manage rider groups"
  ON rider_groups FOR ALL
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@pike2thepolls.com'));

CREATE POLICY "Admins can manage group members"
  ON group_members FOR ALL
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@pike2thepolls.com'));
```

---

## File Structure

### New Files to Create

```
src/
├── lib/
│   ├── mapbox.ts                   # Mapbox geocoding client
│   └── grouping.ts                 # Grouping algorithm logic
├── components/admin/
│   ├── DispatchTab.tsx             # New Dispatch tab component
│   ├── RiderGroupCard.tsx          # Display a single rider group
│   ├── DriverAssigner.tsx          # Assign driver to group modal
│   ├── RouteManifest.tsx           # Route manifest display/generation
│   ├── GroupedViewToggle.tsx       # Toggle button for grouped view
│   └── GroupedSignupsView.tsx      # Grouped signups view component
└── app/
    └── admin/
        └── dispatch/               # Optional: separate dispatch page route
            └── page.tsx
```

### Files to Modify

```
src/
├── lib/
│   └── supabase.ts                 # Add new types and table constants
└── app/
    └── admin/
        └── page.tsx                # Add new Dispatch tab, Grouped View toggle
```

---

## Implementation Phases

### Phase 1: Database & Infrastructure (Foundation)

**Tasks:**
1. Run SQL migration to create 4 new tables
2. Add Mapbox token to `.env.local` and Vercel environment variables
3. Test geocoding API with sample addresses

**Deliverable:** Database schema ready, geocoding service configured

---

### Phase 2: Geocoding Integration (Backend)

**File: `src/lib/mapbox.ts`** (CREATE)

```typescript
interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  // Check cache first
  // If not cached, call Mapbox API
  // Save to cache
  // Return coordinates
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Haversine formula for distance in miles
}
```

**File: `src/lib/supabase.ts`** (MODIFY)

Add new types and table constants:
```typescript
export interface GeocodedAddress {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  formatted_address?: string;
}

export interface RiderGroup {
  id: string;
  voting_date: string;
  preferred_time: string;
  group_name?: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  signup_id: string;
  pickup_order: number;
}

export interface DriverAssignment {
  id: string;
  volunteer_id: string;
  voting_date: string;
  preferred_time: string;
  group_id: string;
  status: 'assigned' | 'in-progress' | 'completed';
  notes?: string;
}

export const TABLES = {
  // ... existing
  GEOCODED_ADDRESSES: 'geocoded_addresses',
  DRIVER_ASSIGNMENTS: 'driver_assignments',
  RIDER_GROUPS: 'rider_groups',
  GROUP_MEMBERS: 'group_members',
} as const;
```

---

### Phase 3: Grouping Algorithm (Logic)

**File: `src/lib/grouping.ts`** (CREATE)

```typescript
import { Signup } from './supabase';
import { geocodeAddress, calculateDistance } from './mapbox';

export interface RiderGroupWithRiders {
  id: string;
  voting_date: string;
  preferred_time: string;
  riders: Signup[];
  centerLat: number;
  centerLon: number;
}

export async function groupRidersByProximity(
  signups: Signup[],
  maxDistanceMiles: number = 2
): Promise<RiderGroupWithRiders[]> {
  // 1. Filter signups with addresses
  // 2. Group by voting_date + preferred_time
  // 3. For each time slot:
  //    a. Geocode all addresses (with caching)
  //    b. Calculate distances between all pairs
  //    c. Cluster riders within maxDistanceMiles
  //    d. Create groups with center point
  // 4. Return groups
}
```

**Algorithm Approach:**
- Primary grouping: `voting_date + preferred_time`
- Secondary grouping: Geographic clustering
- Clustering method: Simple distance-based clustering (if rider A is within 2 miles of rider B, group them)
- Calculate group center point (avg lat/lon) for display

---

### Phase 4: UI Components - Dispatch Tab (Frontend)

**File: `src/components/admin/DispatchTab.tsx`** (CREATE)

Component structure:
```tsx
interface DispatchTabProps {
  signups: Signup[];
  volunteers: Volunteer[];
  onRefresh: () => void;
}

export function DispatchTab({ signups, volunteers, onRefresh }: DispatchTabProps) {
  const [groups, setGroups] = useState<RiderGroupWithRiders[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedTime, setSelectedTime] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Load/optimize groups when filters change
  // Display filters: voting date, time slot
  // Display groups as cards
  // Each group shows: riders, map of pickup points, suggested driver
  // Actions: Assign driver, View manifest, Edit group
}
```

**File: `src/components/admin/RiderGroupCard.tsx** (CREATE)

Display a single rider group with:
- Group name/header
- List of riders with addresses
- Total riders count
- Suggested drivers dropdown
- "Assign Driver" button
- "View Route Manifest" button

**File: `src/components/admin/DriverAssigner.tsx`** (CREATE)

Modal for assigning driver to group with:
- Select driver from available volunteers
- View driver details (vehicle, seats)
- Add notes
- Save assignment to database

**File: `src/app/admin/page.tsx`** (MODIFY)

Add new tab:
```tsx
const [activeTab, setActiveTab] = useState<'signups' | 'volunteers' | 'dispatch'>('signups');

// In tabs section:
<button onClick={() => setActiveTab('dispatch')}>
  Dispatch ({groups.length})
</button>

// In content section:
{activeTab === 'dispatch' && (
  <DispatchTab signups={signups} volunteers={volunteers} onRefresh={loadData} />
)}
```

---

### Phase 5: Grouped View Toggle (Frontend Enhancement)

**File: `src/components/admin/GroupedViewToggle.tsx`** (CREATE)

Toggle button for the "Ride Signups" tab

**File: `src/app/admin/page.tsx`** (MODIFY)

Add toggle to Ride Signups tab to switch between list and grouped views

---

### Phase 6: Route Manifest Generation (Feature)

**File: `src/components/admin/RouteManifest.tsx`** (CREATE)

Route manifest display with:
- Pickup order
- Driver info and vehicle details
- Rider contact info
- Export to PDF/printable format
- Mobile-friendly for drivers on election day

---

### Phase 7: Polish & Integration

**Tasks:**
1. Add loading states during geocoding
2. Error handling for geocoding failures
3. Accessibility audit (keyboard nav, ARIA labels)
4. Responsive design testing
5. Performance optimization (caching, batch geocoding)
6. Documentation updates

---

## User Interaction Flow

### Flow 1: Admin Pre-Election Planning

1. Admin logs in → goes to "Dispatch" tab
2. Filters by voting date (e.g., "election-day") and time (e.g., "10:00 AM")
3. System displays rider groups based on proximity
4. Admin reviews suggested groups
5. Admin clicks "Assign Driver" on a group
6. Admin selects driver from dropdown (shows available drivers)
7. Admin saves assignment
8. Assignment is saved to database

### Flow 2: Election Day Manifest Generation

1. Admin goes to Dispatch tab
2. Filters by today's voting date/time
3. System shows groups with assigned drivers
4. Admin clicks "View Route Manifest" for a driver
5. Manifest displays pickup order with addresses and phone numbers
6. Admin clicks "Download PDF" or "Print"
7. Manifest is provided to driver for their route

### Flow 3: Grouped View Toggle (Alternative)

1. Admin goes to "Ride Signups" tab
2. Clicks "Grouped View" toggle button
3. Signups are displayed as proximity-based group cards
4. Admin can view/assign from this simplified view
5. Toggle back to "List View" for table format

---

## Critical Files

### To Modify:
1. **`src/app/admin/page.tsx`** - Add Dispatch tab, Grouped View toggle
2. **`src/lib/supabase.ts`** - Add new types and table constants
3. **`.env.local`** - Add Mapbox token

### To Create:
1. **`supabase-migrations/add-dispatch-tables.sql`** - Database schema
2. **`src/lib/mapbox.ts`** - Mapbox geocoding client
3. **`src/lib/grouping.ts`** - Grouping algorithm
4. **`src/components/admin/DispatchTab.tsx`** - Main dispatch UI
5. **`src/components/admin/RiderGroupCard.tsx`** - Group display card
6. **`src/components/admin/DriverAssigner.tsx`** - Driver assignment modal
7. **`src/components/admin/RouteManifest.tsx`** - Route manifest
8. **`src/components/admin/GroupedViewToggle.tsx`** - View toggle button
9. **`src/components/admin/GroupedSignupsView.tsx`** - Grouped signups view

---

## Verification & Testing

### Manual Testing Checklist

- [ ] Geocoding works with various address formats
- [ ] Caching prevents duplicate geocoding calls
- [ ] Grouping algorithm correctly groups by date/time first
- [ ] Proximity clustering works within 2-mile radius
- [ ] Dispatch tab displays groups correctly
- [ ] Driver assignment saves to database
- [ ] Assigned drivers appear in Dispatch tab
- [ ] Route manifest generates with correct pickup order
- [ ] PDF export/download works
- [ ] Grouped view toggle switches between list/grouped views
- [ ] Mobile responsive design works
- [ ] Loading states display during geocoding
- [ ] Error handling works for geocoding failures

---

## Estimated Implementation Time

- Phase 1 (Database): 2-3 hours
- Phase 2 (Geocoding): 3-4 hours
- Phase 3 (Grouping): 4-5 hours
- Phase 4 (Dispatch Tab UI): 6-8 hours
- Phase 5 (Grouped View): 2-3 hours
- Phase 6 (Route Manifests): 3-4 hours
- Phase 7 (Polish): 2-3 hours

**Total: 22-30 hours** (~3-4 days of focused development)

---

## Success Criteria

Feature is complete when:
- [ ] Database migration applied successfully
- [ ] Mapbox geocoding works and caches results
- [ ] Riders are grouped by voting date/time, then proximity
- [ ] Dispatch tab displays groups correctly
- [ ] Drivers can be assigned to groups and saved to database
- [ ] Route manifests generate correctly with pickup order
- [ ] Grouped view toggle works on Ride Signups tab
- [ ] All UI is accessible (WCAG 2.1 AA)
- [ ] Mobile responsive design works
- [ ] Documentation updated
- [ ] End-to-end testing passes
