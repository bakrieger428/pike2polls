# Volunteer Driver Information Feature - Implementation Guide

## Overview
This feature adds the ability to track and manage detailed driver information for volunteers who sign up as drivers. Admin users can click on a volunteer's name to open an edit modal and enter/update driver-specific details.

## Prerequisites

### 1. Run the Database Migration
Before the code changes will work, you MUST run the SQL migration in Supabase:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `vvzzorscnvoggeanfxtn`
3. Navigate to **SQL Editor**
4. Copy and run the SQL from `add-driver-fields.sql`
5. Verify the columns were added successfully

The SQL file is located at: `C:\Users\pkf428\DevProjs\pike2polls\add-driver-fields.sql`

## What's Been Implemented

### ✅ SQL Migration Script
Created `add-driver-fields.sql` that adds:
- `vehicle_make_model` (text)
- `number_of_seats` (integer)
- `license_plate` (text)
- `drive_alone_preference` ('alone' | 'paired')
- `has_valid_insurance` (boolean)
- `driving_history_issues` ('yes' | 'speeding_tickets_only' | 'no')
- `needs_gas_reimbursement` (boolean)

### ✅ VolunteerEditModal Component
Created `src/components/admin/VolunteerEditModal.tsx` with:
- Modal popup form for editing volunteer information
- All basic info fields (name, email, phone)
- Role checkboxes (Driver, Logistical Support)
- Driver-specific fields (shown only when is_driver is true):
  - Vehicle Make & Model
  - Number of Seats
  - License Plate
  - Driving Alone Preference (dropdown)
  - Has Valid Insurance (dropdown)
  - Driving History Issues (dropdown)
  - Needs Gas Reimbursement (dropdown)
- Save and Cancel buttons
- Form validation and error handling

### ✅ Admin Components Export
Updated `src/components/admin/index.ts` to export `VolunteerEditModal`

## Remaining Implementation Steps

### Step 1: Update Volunteer Type in supabase.ts

File: `src/lib/supabase.ts`

Add these fields to the Volunteer interface (around line 161):

```typescript
export interface Volunteer {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_driver: boolean;
  is_logistical_support: boolean;
  may_2: boolean;
  may_3: boolean;
  may_5: boolean;
  all_days: boolean;
  time_slots: string[];
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  // ADD THESE NEW DRIVER FIELDS:
  vehicle_make_model?: string;
  number_of_seats?: number;
  license_plate?: string;
  drive_alone_preference?: 'alone' | 'paired';
  has_valid_insurance?: boolean;
  driving_history_issues?: 'yes' | 'speeding_tickets_only' | 'no';
  needs_gas_reimbursement?: boolean;
}
```

### Step 2: Update Admin Dashboard

File: `src/app/admin/page.tsx`

#### 2a. Add Imports (at top of file):
```typescript
import { VolunteerEditModal } from '@/components/admin';
```

#### 2b. Add State (in DashboardContent function, after existing state):
```typescript
const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null);
```

#### 2c. Update Volunteer Name (around line 550):
Make the volunteer name clickable by wrapping it in a button:

```typescript
<td className="px-4 py-3">
  <button
    onClick={() => setEditingVolunteer(volunteer)}
    className="text-body-md font-medium text-primary-600 hover:text-primary-700 hover:underline text-left"
  >
    {volunteer.first_name} {volunteer.last_name}
  </button>
</td>
```

#### 2d. Add Modal Component (after the delete confirmation modal, around line 292):
```typescript
{/* Volunteer Edit Modal */}
{editingVolunteer && (
  <VolunteerEditModal
    volunteer={editingVolunteer}
    onClose={() => setEditingVolunteer(null)}
    onSave={loadData}
  />
)}
```

### Step 3: Update CSV Export

File: `src/app/admin/page.tsx`

Update the `exportToCSV` function to include driver fields. Replace the volunteer section (around line 165) with:

```typescript
} else {
  const volunteer = row as Volunteer;
  return [
    format(new Date(volunteer.created_at), 'MM/dd/yyyy'),
    `${volunteer.first_name} ${volunteer.last_name}`,
    volunteer.email,
    volunteer.phone,
    volunteer.is_driver ? 'Yes' : 'No',
    volunteer.is_logistical_support ? 'Yes' : 'No',
    volunteer.all_days ? 'All days' : volunteer.time_slots.join(', '),
    volunteer.status,
    // Driver fields (only if driver)
    volunteer.is_driver ? volunteer.vehicle_make_model || '' : '',
    volunteer.is_driver ? volunteer.number_of_seats?.toString() || '' : '',
    volunteer.is_driver ? volunteer.license_plate || '' : '',
    volunteer.is_driver ? volunteer.drive_alone_preference || '' : '',
    volunteer.is_driver ? (volunteer.has_valid_insurance ? 'Yes' : 'No') : '',
    volunteer.is_driver ? volunteer.driving_history_issues || '' : '',
    volunteer.is_driver ? (volunteer.needs_gas_reimbursement ? 'Yes' : 'No') : '',
  ].join(',');
}
```

And update the headers (around line 146):
```typescript
: [
    'Date',
    'Name',
    'Email',
    'Phone',
    'Driver',
    'Logistical Support',
    'Availability',
    'Status',
    'Vehicle',
    'Seats',
    'License Plate',
    'Drive Preference',
    'Insurance',
    'Driving History',
    'Gas Reimbursement',
  ];
```

## How to Use After Implementation

1. **Run the SQL Migration** in Supabase SQL Editor (from `add-driver-fields.sql`)
2. **Deploy the code** changes to Vercel
3. **Go to Admin Dashboard** → Volunteers tab
4. **Click on any volunteer's name** to open the edit modal
5. **Fill in driver information** for volunteers who signed up as drivers
6. **Click "Save Changes"** to update the database
7. **Export CSV** includes all driver details

## Driver Fields Explained

- **Vehicle Make & Model**: E.g., "Toyota Camry 2020"
- **Number of Seats**: How many passengers the vehicle can hold (1-8)
- **License Plate**: Vehicle license plate number
- **Drive Alone Preference**: Whether they prefer to drive alone or be paired with another volunteer
- **Has Valid Insurance**: Whether they have current valid auto insurance
- **Driving History Issues**: No issues, only speeding tickets, or yes (more serious issues)
- **Needs Gas Reimbursement**: Whether they need gas expenses reimbursed

## Notes

- Driver-specific fields only appear in the modal if "Driver" role is checked
- If Driver is unchecked, all driver fields are cleared from the database
- CSV export includes driver columns for all volunteers (blank for non-drivers)
- Modal is responsive and works on mobile devices
