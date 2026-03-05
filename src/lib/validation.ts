import { z } from 'zod';

/**
 * Zod Validation Schemas
 *
 * Runtime type validation for all form inputs.
 * Used by form components to validate user input.
 */

/**
 * Status options
 */
export const SIGNUP_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const;

export type SignupStatus = (typeof SIGNUP_STATUS)[keyof typeof SIGNUP_STATUS];

/**
 * Step 1: Resident Check
 */
export const residentCheckSchema = z.object({
  is_pike_resident: z.enum(['yes', 'no'], {
    message: 'Please select yes or no',
  }),
});

export type ResidentCheckFormData = z.infer<typeof residentCheckSchema>;

/**
 * Step 2: Name
 */
export const nameSchema = z.object({
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
});

export type NameFormData = z.infer<typeof nameSchema>;

/**
 * Step 3: Voter Registration
 */
export const voterRegistrationSchema = z.object({
  is_registered_voter: z.enum(['yes', 'no'], {
    message: 'Please select yes or no',
  }),
});

export type VoterRegistrationFormData = z.infer<typeof voterRegistrationSchema>;

/**
 * Step 4: Voting Date
 */
export const votingDateSchema = z.object({
  voting_date: z.enum(['early-voting-date-1', 'early-voting-date-2', 'election-day'], {
    message: 'Please select your preferred voting date',
  }),
});

export type VotingDateFormData = z.infer<typeof votingDateSchema>;

/**
 * Step 5: Preferred Time
 */
const VOTING_TIMES = [
  '8:00 AM',
  '9:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
] as const;

export const preferredTimeSchema = z.object({
  preferred_time: z.enum(VOTING_TIMES, {
    message: 'Please select your preferred time',
  }),
});

export type PreferredTimeFormData = z.infer<typeof preferredTimeSchema>;

/**
 * Step 6: Contact Info
 */
export const contactInfoSchema = z.object({
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
  address: z
    .string()
    .min(5, 'Please enter your pickup address')
    .max(200, 'Address must be less than 200 characters')
    .trim(),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .trim()
    .optional(),
});

export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;

/**
 * Step 7: Waiver Agreement
 */
export const waiverSchema = z.object({
  liability_waiver: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the liability waiver to proceed',
  }),
  disclaimer: z.boolean().refine((val) => val === true, {
    message: 'You must acknowledge the disclaimer to proceed',
  }),
});

export type WaiverFormData = z.infer<typeof waiverSchema>;

/**
 * Complete signup schema (all fields)
 */
export const signupSchema = z.object({
  is_pike_resident: z.enum(['yes', 'no']),
  first_name: z.string().min(2).max(50).trim(),
  last_name: z.string().min(2).max(50).trim(),
  is_registered_voter: z.enum(['yes', 'no']),
  voting_date: z.enum(['early-voting-date-1', 'early-voting-date-2', 'election-day']),
  preferred_time: z.enum(VOTING_TIMES),
  email: z.string().email().toLowerCase().trim(),
  phone: z.string().min(10).max(20).trim(),
  address: z.string().min(5).max(200).trim(),
  notes: z.string().max(500).trim().optional(),
  liability_waiver: z.boolean().refine((val) => val === true),
  disclaimer: z.boolean().refine((val) => val === true),
});

export type SignupFormData = z.infer<typeof signupSchema>;

/**
 * Database insert schema (converts yes/no to boolean)
 */
export const signupInsertSchema = signupSchema.transform((data) => ({
  is_pike_resident: data.is_pike_resident === 'yes',
  is_registered_voter: data.is_registered_voter === 'yes',
  first_name: data.first_name,
  last_name: data.last_name,
  voting_date: data.voting_date,
  preferred_time: data.preferred_time,
  email: data.email,
  phone: data.phone,
  address: data.address,
  notes: data.notes,
  liability_waiver_agreed: data.liability_waiver,
  disclaimer_agreed: data.disclaimer,
  status: 'pending' as const,
}));

export type SignupInsertData = z.infer<typeof signupInsertSchema>;
