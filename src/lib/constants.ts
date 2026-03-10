/**
 * Application Constants
 *
 * Central location for application-wide constants including:
 * - Voting locations for each voting day
 * - Available time slots for voting
 * - Timing buffers for route calculations
 *
 * This provides a single source of truth for values used across
 * grouping, routing, and UI components.
 */

/**
 * Voting locations for each voting date
 *
 * Maps voting_date values to their physical polling locations.
 * Used for route manifest generation to show drop-off destinations.
 */
export const VOTING_LOCATIONS = {
  'early-voting-date-1': {
    address: '6525 Zionsville Rd, Indianapolis, IN 46268',
    name: 'Early Voting Location - Zionsville Rd',
    shortName: 'Early Voting - Zionsville Rd',
  },
  'early-voting-date-2': {
    address: '6525 Zionsville Rd, Indianapolis, IN 46268',
    name: 'Early Voting Location - Zionsville Rd',
    shortName: 'Early Voting - Zionsville Rd',
  },
  'election-day': {
    address: '7002 Lafayette Rd, Indianapolis, IN 46278',
    name: 'Election Day Polling Place - Lafayette Rd',
    shortName: 'Election Day - Lafayette Rd',
  },
} as const;

/**
 * Type definition for voting location
 */
export type VotingLocation = typeof VOTING_LOCATIONS[keyof typeof VOTING_LOCATIONS];

/**
 * Type definition for voting date keys
 */
export type VotingDate = keyof typeof VOTING_LOCATIONS;

/**
 * Display names for voting dates
 * Used in UI for consistent date labeling
 */
export const VOTING_DATE_DISPLAY_NAMES: Record<VotingDate, string> = {
  'early-voting-date-1': 'Early Voting Day 1',
  'early-voting-date-2': 'Early Voting Day 2',
  'election-day': 'Election Day',
} as const;

/**
 * Available time slots for voting preferences
 *
 * Ordered chronologically from 8:00 AM to 6:00 PM.
 * These are the options presented to residents during signup.
 */
export const TIME_SLOTS = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
] as const;

/**
 * Type definition for time slot
 */
export type TimeSlot = typeof TIME_SLOTS[number];

/**
 * Pickup buffer in minutes
 *
 * Riders should be picked up this many minutes before their voting time.
 * This buffer ensures:
 * - Time for all pickups in the route
 * - Travel time to the polling location
 * - Parking and check-in time
 * - Buffer for unexpected delays
 *
 * 45 minutes was chosen as a balance between:
 * - Not too early (riders waiting unnecessarily)
 * - Not too late (risk of missing voting time)
 */
export const PICKUP_BUFFER_MINUTES = 45;

/**
 * Average minutes per pickup stop
 *
 * Estimated time for driver to:
 * - Arrive at location
 * - Wait for rider (if needed)
 * - Help rider into vehicle
 * - Verify rider information
 */
export const MINUTES_PER_PICKUP = 5;

/**
 * Maximum riders per driver route
 *
 * Practical limit for a single driver route based on:
 * - Vehicle capacity (most cars seat 4-5 people)
 * - Time constraints (PICKUP_BUFFER_MINUTES / MINUTES_PER_PICKUP)
 * - Driver comfort and safety
 */
export const MAX_RIDERS_PER_ROUTE = 4;

/**
 * Geocoding cache expiration (in days)
 *
 * How long to cache geocoded addresses before refreshing.
 * Addresses don't change frequently, so we cache aggressively.
 */
export const GEOCODE_CACHE_DAYS = 365;

/**
 * Mapbox API configuration
 */
export const MAPBOX_CONFIG = {
  /**
   * Base URL for Mapbox Geocoding API
   */
  GEOCODING_API_URL: 'https://api.mapbox.com/geocoding/v5/mapbox.places',

  /**
   * Base URL for Mapbox Directions API
   */
  DIRECTIONS_API_URL: 'https://api.mapbox.com/directions/v5/mapbox/driving',

  /**
   * Country restriction for geocoding (US only)
   */
  COUNTRY: 'US',

  /**
   * Maximum results from geocoding API
   */
  GEOCODING_LIMIT: 1,

  /**
   * Directions API profile (driving-traffic uses current traffic conditions)
   * Alternatives: 'driving', 'driving-traffic', 'walking', 'cycling'
   */
  DIRECTIONS_PROFILE: 'driving',

  /**
   * Request timeout in milliseconds
   */
  REQUEST_TIMEOUT_MS: 10000,
} as const;
