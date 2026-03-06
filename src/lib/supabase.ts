/**
 * Supabase Client Configuration
 *
 * This file configures the Supabase client for database access and authentication.
 * Supabase provides PostgreSQL database, authentication, and real-time subscriptions.
 *
 * @see https://supabase.com/docs/reference/javascript
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase environment variables
 * These are loaded from .env.local (not committed to git)
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Create and export Supabase client singleton
 *
 * The client is created with the anon key, which is safe for client-side use.
 * Row Level Security (RLS) policies on the Supabase server protect the data.
 *
 * For server-side operations with elevated privileges, create a service role client
 * using the SUPABASE_SERVICE_ROLE_KEY (never expose this to the browser).
 */
let supabaseInstance: SupabaseClient | null = null;

function createSupabaseClient(): SupabaseClient {
  // Return existing instance if already created (singleton pattern)
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Validate environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    const missingVars = [];
    if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

    throw new Error(
      'Missing Supabase environment variables. ' +
      'Please ensure ' + missingVars.join(' and ') + ' are set in Vercel.'
    );
  }

  // Validate URL format
  try {
    const url = new URL(supabaseUrl);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      throw new Error('Invalid protocol: ' + url.protocol);
    }
  } catch {
    throw new Error('Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL. Got: ' + supabaseUrl);
  }

  // Create new Supabase client
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Auto-refresh token sessions
      autoRefreshToken: true,
      // Detect when user session is about to expire and refresh
      detectSessionInUrl: true,
      // Persist session to localStorage
      persistSession: true,
      // Store key in localStorage
      storageKey: 'pike2polls-auth-token',
      // Listen for auth state changes
      flowType: 'pkce',
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'X-Client-Info': 'pike2polls-web',
      },
    },
  });

  return supabaseInstance;
}

/**
 * Export a function to get the Supabase client
 * This prevents the client from being created during build time
 *
 * @example
 * ```ts
 * import { getSupabaseClient } from '@/lib/supabase';
 *
 * const supabase = getSupabaseClient();
 * const { data, error } = await supabase
 *   .from('signups')
 *   .select('*');
 * ```
 */
export { createSupabaseClient as getSupabaseClient };

/**
 * Export the Supabase client as a getter function to prevent build-time initialization
 * This ensures the client is only created when actually accessed at runtime
 * Use: import { supabase } from '@/lib/supabase'; then await supabase.auth.getUser()
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = createSupabaseClient();
    return client[prop as keyof SupabaseClient];
  },
});

/**
 * Export a default getter for backward compatibility
 */
export default function getDefaultClient() {
  return createSupabaseClient();
}

/**
 * Database table names (type-safe constants)
 * Use these to avoid typos when referencing table names
 */
export const TABLES = {
  SIGNUPS: 'signups',
  VOLUNTEERS: 'volunteers',
} as const;

/**
 * Database type definitions
 * These match the Supabase table schema
 */

export interface Signup {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  is_pike_resident: boolean;
  is_registered_voter: boolean;
  voting_date: 'early-voting-date-1' | 'early-voting-date-2' | 'election-day';
  preferred_time: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  liability_waiver_agreed: boolean;
  disclaimer_agreed: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export type SignupInsert = Omit<Signup, 'id' | 'created_at'>;
export type SignupUpdate = Partial<SignupInsert>;

/**
 * Volunteer table type definitions
 */
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
  // Driver-specific fields
  vehicle_make_model?: string;
  number_of_seats?: number;
  license_plate?: string;
  drive_alone_preference?: 'alone' | 'paired';
  has_valid_insurance?: boolean;
  driving_history_issues?: 'yes' | 'speeding_tickets_only' | 'no';
  needs_gas_reimbursement?: boolean;
}

export type VolunteerInsert = Omit<Volunteer, 'id' | 'created_at'>;
export type VolunteerUpdate = Partial<VolunteerInsert>;

/**
 * Helper function to handle Supabase errors
 * Provides user-friendly error messages
 */
export function handleSupabaseError(error: unknown): Error {
  if (error instanceof Error) {
    // Check for common Supabase errors
    if (error.message.includes('JWT')) {
      return new Error('Your session has expired. Please log in again.');
    }
    if (error.message.includes('Rows')) {
      return new Error('Record not found or access denied.');
    }
    if (error.message.includes('duplicate')) {
      return new Error('This record already exists.');
    }
    return error;
  }

  return new Error('An unexpected error occurred. Please try again.');
}

/**
 * Re-export Supabase types for convenience
 */
export type {
  SupabaseClient,
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';
