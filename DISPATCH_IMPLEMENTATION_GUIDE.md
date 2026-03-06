# Dispatch Feature Implementation - Quick Start Guide

## For Agent Team Starting This Feature

### Overview
This guide is for an agent team implementing the **Rider Dispatch Grouping Feature** for Pike2ThePolls.

**Branch**: Create new git branch `feature/dispatch-grouping`
**Plan File**: `DISPATCH_FEATURE_PLAN.md` (detailed implementation plan)
**Estimate**: 22-30 hours (~3-4 days)

---

## Step 1: Setup (15 minutes)

### Create Feature Branch
```bash
git checkout -b feature/dispatch-grouping
git push -u origin feature/dispatch-grouping
```

### Verify Environment Variables
Check that `.env.local` contains:
```bash
NEXT_PUBLIC_MAPBOX_TOKEN=Your_mapbox_token_here
```

Also add this to Vercel environment variables if not already present.

### Test Mapbox API
```bash
curl "https://api.mapbox.com/geocoding/v5/mapbox.places/123%20Main%20St%20Indianapolis%20IN.json?access_token=Your_mapbox_token_here"
```

Should return coordinates for Indianapolis.

---

## Step 2: Database Migration (30 minutes)

### Create Migration File
Create: `supabase-migrations/add-dispatch-tables.sql`

Copy the SQL from `DISPATCH_FEATURE_PLAN.md` section "Database Schema Changes".

### Run Migration
1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select Pike2ThePolls project
3. Navigate to SQL Editor
4. Copy and run the SQL from the migration file
5. Verify tables created:
   - `geocoded_addresses`
   - `driver_assignments`
   - `rider_groups`
   - `group_members`

---

## Step 3: Update TypeScript Types (15 minutes)

### File: `src/lib/supabase.ts`

Add these interfaces (from plan file):

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
```

Add to TABLES constant:
```typescript
export const TABLES = {
  SIGNUPS: 'signups',
  VOLUNTEERS: 'volunteers',
  GEOCODED_ADDRESSES: 'geocoded_addresses',
  DRIVER_ASSIGNMENTS: 'driver_assignments',
  RIDER_GROUPS: 'rider_groups',
  GROUP_MEMBERS: 'group_members',
} as const;
```

---

## Step 4: Implement Mapbox Integration (2-3 hours)

### Create: `src/lib/mapbox.ts`

Implement:
1. `geocodeAddress(address: string)` - Check cache, call Mapbox API, save to cache
2. `calculateDistance(lat1, lon1, lat2, lon2)` - Haversine formula for miles

Test with sample Pike Township addresses.

---

## Step 5: Implement Grouping Algorithm (3-4 hours)

### Create: `src/lib/grouping.ts`

Implement `groupRidersByProximity()`:
1. Filter signups with addresses
2. Group by `voting_date + preferred_time`
3. For each time slot:
   - Geocode all addresses
   - Calculate distances between pairs
   - Cluster riders within 2 miles
   - Create groups with center points

Test with sample data.

---

## Step 6: Build Dispatch Tab UI (6-8 hours)

### Create Components:
1. `src/components/admin/DispatchTab.tsx` - Main dispatch interface
2. `src/components/admin/RiderGroupCard.tsx` - Display single group
3. `src/components/admin/DriverAssigner.tsx` - Assignment modal

### Modify: `src/app/admin/page.tsx`
- Add "Dispatch" to tab state type
- Add Dispatch tab button
- Render DispatchTab component

---

## Step 7: Add Grouped View Toggle (2-3 hours)

### Create Components:
1. `src/components/admin/GroupedViewToggle.tsx` - Toggle button
2. `src/components/admin/GroupedSignupsView.tsx` - Grouped view

### Modify: `src/app/admin/page.tsx`
- Add `showGroupedView` state
- Add toggle button to toolbar
- Conditionally render grouped/table view

---

## Step 8: Route Manifest Generation (3-4 hours)

### Create: `src/components/admin/RouteManifest.tsx`

Implement:
- Display pickup order
- Driver info and vehicle details
- Rider contact information
- Export to PDF functionality
- Print functionality

---

## Step 9: Testing & Polish (2-3 hours)

### Testing Checklist:
- [ ] Geocoding works with Pike Township addresses
- [ ] Caching prevents duplicate API calls
- [ ] Grouping by date/time works correctly
- [ ] Proximity clustering within 2-mile radius
- [ ] Dispatch tab displays groups
- [ ] Driver assignment saves to database
- [ ] Route manifest generates correctly
- [ ] Grouped view toggle works
- [ ] Mobile responsive design
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] No console errors
- [ ] TypeScript builds successfully

### Performance:
- Add loading states during geocoding
- Implement error handling for API failures
- Optimize batch geocoding

---

## Step 10: Deployment (15 minutes)

### Commit Changes
```bash
git add .
git commit -m "feat: implement rider dispatch grouping feature

- Add Mapbox geocoding integration
- Implement proximity-based rider grouping
- Add Dispatch tab to admin dashboard
- Add grouped view toggle to signups tab
- Implement driver assignment functionality
- Add route manifest generation

See DISPATCH_FEATURE_PLAN.md for details"
```

### Push to Vercel
```bash
git push origin feature/dispatch-grouping
```

Vercel will auto-deploy. Monitor deployment at: https://vercel.com/dashboard

### Test on Production
1. Go to https://pike2thepolls.com/admin
2. Test Dispatch tab
3. Verify geocoding works
4. Test driver assignment
5. Test route manifest generation

---

## Step 11: Merge to Main (30 minutes)

### Create Pull Request
1. Go to GitHub: https://github.com/bakrieger428/pike2polls
2. Create PR from `feature/dispatch-grouping` to `main`
3. Include description from plan file
4. Request review

### After Approval
1. Merge PR
2. Delete feature branch
3. Verify production deployment
4. Monitor Mapbox API usage

---

## Important Notes

### Mapbox API Limits
- Free tier: 100,000 requests/month
- Monitor usage at: https://www.mapbox.com/account/
- Expected usage: ~500-1000 requests (one per signup address)

### Performance Considerations
- Geocoding is cached in database (one-time cost per address)
- Grouping algorithm runs on-demand when viewing Dispatch tab
- Consider pre-calculating groups if performance issues arise

### Accessibility Requirements
- All new UI must be WCAG 2.1 AA compliant
- Test with keyboard navigation
- Test with screen reader (NVDA/JAWS)
- Ensure color contrast (4.5:1 minimum)
- Touch targets 44x44px minimum

### Security
- All new tables have RLS policies
- Only authenticated admins can access
- Mapbox token is public (safe for client-side)

---

## Troubleshooting

### Geocoding Fails
- Check Mapbox token in environment variables
- Verify token hasn't expired
- Check Supabase logs for API errors
- Test with simple address first

### Groups Not Displaying
- Check browser console for errors
- Verify database migration completed
- Check TypeScript types match database schema
- Verify Mapbox API is returning coordinates

### Driver Assignment Not Saving
- Check RLS policies on new tables
- Verify user is authenticated admin
- Check Supabase logs for insert errors
- Verify volunteer_id exists in volunteers table

---

## Resources

### Documentation
- **Full Plan**: `DISPATCH_FEATURE_PLAN.md`
- **Project Memory**: `memory/MEMORY.md`
- **Project README**: `README.md`

### External Services
- **Mapbox API Docs**: https://docs.mapbox.com/api/search/geocoding/
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard

### Key Files
- Admin Dashboard: `src/app/admin/page.tsx`
- Supabase Client: `src/lib/supabase.ts`
- Auth Hook: `src/hooks/useAuth.ts`

---

## Questions?

If you encounter issues or need clarification:
1. Check `DISPATCH_FEATURE_PLAN.md` for detailed specs
2. Check `memory/MEMORY.md` for project context
3. Review existing admin components for patterns
4. Test with sample data before using production data

Good luck! 🚗🗺️
