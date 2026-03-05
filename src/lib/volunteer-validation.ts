import { z } from 'zod';

/**
 * Zod Validation Schemas for Volunteer Signup
 *
 * Runtime type validation for all volunteer form inputs.
 * Used by volunteer form components to validate user input.
 */

/**
 * Status options for volunteers
 */
export const VOLUNTEER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const;

export type VolunteerStatus = (typeof VOLUNTEER_STATUS)[keyof typeof VOLUNTEER_STATUS];

/**
 * Volunteer role options
 */
export const VOLUNTEER_ROLES = {
  DRIVER: 'Driver',
  LOGISTICAL: 'Logistical Support',
} as const;

export type VolunteerRole = (typeof VOLUNTEER_ROLES)[keyof typeof VOLUNTEER_ROLES];

/**
 * Volunteer day options
 */
export const VOLUNTEER_DAYS = {
  MAY_2: 'may-2',
  MAY_3: 'may-3',
  MAY_5: 'may-5',
  ALL_DAYS: 'all-days',
} as const;

export type VolunteerDay = (typeof VOLUNTEER_DAYS)[keyof typeof VOLUNTEER_DAYS];

/**
 * Time slot options (4-hour blocks)
 */
export const TIME_SLOTS = [
  '8:00 AM - 12:00 PM',
  '12:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM',
] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];

/**
 * Step 1: Name & Contact Info
 */
export const volunteerContactSchema = z.object({
  first_name: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .trim(),
  last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .max(20, 'Phone number is too long')
    .trim(),
});

export type VolunteerContactFormData = z.infer<typeof volunteerContactSchema>;

/**
 * Step 2: Volunteer Roles
 */
export const volunteerRolesSchema = z.object({
  is_driver: z.boolean().default(false),
  is_logistical_support: z.boolean().default(false),
}).refine(
  (data) => data.is_driver || data.is_logistical_support,
  {
    message: 'Please select at least one volunteer role',
    path: ['is_driver'],
  }
);

export type VolunteerRolesFormData = z.infer<typeof volunteerRolesSchema>;

/**
 * Step 3: Availability Days
 */
export const volunteerDaysSchema = z.object({
  may_2: z.boolean().default(false),
  may_3: z.boolean().default(false),
  may_5: z.boolean().default(false),
  all_days: z.boolean().default(false),
}).refine(
  (data) => data.may_2 || data.may_3 || data.may_5 || data.all_days,
  {
    message: 'Please select at least one day',
    path: ['may_2'],
  }
);

export type VolunteerDaysFormData = z.infer<typeof volunteerDaysSchema>;

/**
 * Step 4: Time Slots
 */
export const volunteerHoursSchema = z.object({
  time_slots: z.array(z.enum(TIME_SLOTS)).min(1, 'Please select at least one time slot'),
});

export type VolunteerHoursFormData = z.infer<typeof volunteerHoursSchema>;

/**
 * Complete volunteer schema (all fields)
 */
export const volunteerSchema = z.object({
  first_name: z.string().min(2).max(50).trim(),
  last_name: z.string().min(2).max(50).trim(),
  email: z.string().email().toLowerCase().trim(),
  phone: z.string().min(10).max(20).trim(),
  is_driver: z.boolean().default(false),
  is_logistical_support: z.boolean().default(false),
  may_2: z.boolean().default(false),
  may_3: z.boolean().default(false),
  may_5: z.boolean().default(false),
  all_days: z.boolean().default(false),
  time_slots: z.array(z.enum(TIME_SLOTS)).min(1),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .trim()
    .optional(),
});

export type VolunteerFormData = z.infer<typeof volunteerSchema>;

/**
 * Database insert schema
 */
export const volunteerInsertSchema = volunteerSchema.transform((data) => ({
  ...data,
  status: 'pending' as const,
}));

export type VolunteerInsertData = z.infer<typeof volunteerInsertSchema>;

/**
 * Helper function to format volunteer data for display
 */
export function formatVolunteerRoles(data: VolunteerRolesFormData): string {
  const roles: string[] = [];
  if (data.is_driver) roles.push(VOLUNTEER_ROLES.DRIVER);
  if (data.is_logistical_support) roles.push(VOLUNTEER_ROLES.LOGISTICAL);
  return roles.join(', ');
}

/**
 * Helper function to format volunteer days for display
 */
export function formatVolunteerDays(data: VolunteerDaysFormData): string {
  if (data.all_days) return 'All Days (May 2, 3, and 5)';

  const days: string[] = [];
  if (data.may_2) days.push('May 2');
  if (data.may_3) days.push('May 3');
  if (data.may_5) days.push('May 5');

  return days.join(', ');
}

/**
 * Helper function to handle "All Days" selection
 */
export function handleAllDaysToggle(
  checked: boolean,
  _currentData: VolunteerDaysFormData
): VolunteerDaysFormData {
  if (checked) {
    return {
      may_2: true,
      may_3: true,
      may_5: true,
      all_days: true,
    };
  } else {
    return {
      may_2: false,
      may_3: false,
      may_5: false,
      all_days: false,
    };
  }
}
