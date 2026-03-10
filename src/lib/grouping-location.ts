/**
 * Location-Based Rider Grouping Algorithm
 *
 * This module provides hierarchical grouping of riders by:
 * 1. Voting Day (early-voting-date-1, early-voting-date-2, election-day)
 * 2. Time Slot (8:00 AM - 6:00 PM)
 * 3. Street Address (ignoring apartment/unit numbers)
 *
 * This approach aligns with election day logistics where:
 * - Drivers pick up riders from the same location
 * - All riders in a group vote at the same time
 * - Groups can be assigned to a single driver
 *
 * @deprecated This module replaces the proximity-based grouping in grouping.ts
 */

import { geocodeAddress } from './mapbox';
import { supabase, TABLES, type Signup, type DriverAssignment } from './supabase';
import { VOTING_LOCATIONS, type VotingDate, type TimeSlot } from './constants';

/**
 * Rider with geocoded coordinates
 */
export interface RiderWithCoords extends Signup {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  streetAddress: string; // Extracted street address (no apartment/unit)
}

/**
 * Location group - riders at the same address for the same voting date/time
 */
export interface LocationGroup {
  id: string;
  votingDate: VotingDate;
  preferredTime: TimeSlot;
  address: string; // Original address input by user
  formattedAddress: string; // Full formatted address from Mapbox
  streetAddress: string; // Street address only (no apartment/unit)
  latitude: number; // Average latitude of all riders at this location
  longitude: number; // Average longitude of all riders at this location
  riders: RiderWithCoords[];
  riderCount: number;
  driverAssignment?: DriverAssignment;
}

/**
 * Time slot group - all location groups for a specific time slot on a day
 */
export interface TimeSlotGroup {
  preferredTime: TimeSlot;
  locationGroups: LocationGroup[];
  totalRiders: number;
  totalGroups: number;
}

/**
 * Day section - all time slots for a specific voting day
 */
export interface DaySection {
  votingDate: VotingDate;
  displayName: string;
  votingLocation: {
    address: string;
    name: string;
    shortName: string;
  };
  timeSlots: TimeSlotGroup[];
  totalRiders: number;
  totalGroups: number;
  isExpanded: boolean; // Default: false (collapsed by default)
}

/**
 * Extract street address by removing apartment/unit numbers
 *
 * This function removes apartment, unit, suite, and similar secondary address
 * designations so that riders at "123 Main St Apt 1" and "123 Main St Apt 2"
 * are grouped together at "123 Main St".
 *
 * @param formattedAddress - The full formatted address from Mapbox
 * @returns The street address without apartment/unit information
 *
 * @example
 * ```ts
 * extractStreetAddress("123 Main St Apt 1, Indianapolis, IN 46268")
 * // Returns: "123 Main St, Indianapolis, IN 46268"
 *
 * extractStreetAddress("456 Oak Ave Unit B, Indianapolis, IN 46268")
 * // Returns: "456 Oak Ave, Indianapolis, IN 46268"
 *
 * extractStreetAddress("789 Elm Street #12, Indianapolis, IN 46268")
 * // Returns: "789 Elm Street, Indianapolis, IN 46268"
 * ```
 */
export function extractStreetAddress(formattedAddress: string): string {
  let cleaned = formattedAddress;

  // Remove apartment/unit patterns
  const patterns = [
    // "Apt 1", "Apt A", "Apartment 1", "Apartment B"
    /\s+(Apt|Apartment)\s+[A-Z0-9]+/gi,

    // "Unit 1", "Unit B"
    /\s+Unit\s+[A-Z0-9]+/gi,

    // "Suite 100", "Suite A"
    /\s+Suite\s+[A-Z0-9]+/gi,

    // "Room 123", "Room A"
    /\s+Room\s+[A-Z0-9]+/gi,

    // "#12", "#12A", ", #12"
    /\s*,?\s*#[A-Z0-9]+/gi,

    // "Ste 100"
    /\s+Ste\s+[A-Z0-9]+/gi,

    // "Rm 123"
    /\s+Rm\s+[A-Z0-9]+/gi,
  ];

  // Apply all patterns
  for (const pattern of patterns) {
    cleaned = cleaned.replace(pattern, '');
  }

  // Clean up any double commas or extra whitespace
  cleaned = cleaned
    .replace(/,\s*,/g, ',') // Double commas
    .replace(/,\s*,\s*/g, ', ') // Commas with extra spaces
    .replace(/\s+/g, ' ') // Multiple spaces
    .replace(/,\s*$/g, '') // Trailing comma
    .trim();

  return cleaned;
}

/**
 * Group riders by exact street address (ignoring apartment/unit numbers)
 *
 * @param riders - Riders with coordinates
 * @returns Map of street address to array of riders
 */
function groupByStreetAddress(riders: RiderWithCoords[]): Map<string, RiderWithCoords[]> {
  const groups = new Map<string, RiderWithCoords[]>();

  for (const rider of riders) {
    const key = rider.streetAddress;

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key)!.push(rider);
  }

  return groups;
}

/**
 * Geocode signups and add coordinate information
 *
 * @param signups - Signups to geocode
 * @returns Array of riders with coordinates
 */
async function geocodeSignups(signups: Signup[]): Promise<RiderWithCoords[]> {
  const results: RiderWithCoords[] = [];

  for (const signup of signups) {
    if (!signup.address) continue;

    try {
      const geocode = await geocodeAddress(signup.address);
      results.push({
        ...signup,
        latitude: geocode.latitude,
        longitude: geocode.longitude,
        formattedAddress: geocode.formattedAddress,
        streetAddress: extractStreetAddress(geocode.formattedAddress),
      });
    } catch (error) {
      console.error(`Failed to geocode address "${signup.address}":`, error);
      // Continue with other signups even if one fails
    }
  }

  return results;
}

/**
 * Load driver assignments for a specific group of riders
 *
 * @param votingDate - Voting date
 * @param preferredTime - Preferred time slot
 * @returns Map of group ID to driver assignment
 */
async function loadDriverAssignmentsForGroups(
  locationGroups: LocationGroup[]
): Promise<void> {
  const groupIds = locationGroups.map(g => g.id);

  if (groupIds.length === 0) return;

  try {
    const { data: assignments } = await supabase
      .from(TABLES.DRIVER_ASSIGNMENTS)
      .select('*')
      .in('group_id', groupIds);

    if (!assignments) return;

    // Assign to groups
    for (const group of locationGroups) {
      const assignment = assignments.find(a => a.group_id === group.id);
      if (assignment) {
        group.driverAssignment = assignment;
      }
    }
  } catch (error) {
    console.error('Error loading driver assignments:', error);
  }
}

/**
 * Save location groups to database
 *
 * @param locationGroups - Location groups to save
 */
async function saveLocationGroupsToDatabase(locationGroups: LocationGroup[]): Promise<void> {
  for (const group of locationGroups) {
    // Check if group already exists
    const { data: existing } = await supabase
      .from(TABLES.RIDER_GROUPS)
      .select('id')
      .eq('voting_date', group.votingDate)
      .eq('preferred_time', group.preferredTime)
      .eq('group_name', group.formattedAddress)
      .maybeSingle();

    const groupId = existing?.id || group.id;

    // Insert group if it doesn't exist
    if (!existing) {
      await supabase
        .from(TABLES.RIDER_GROUPS)
        .insert({
          id: groupId,
          voting_date: group.votingDate,
          preferred_time: group.preferredTime,
          group_name: group.formattedAddress,
        });
    }

    // Clear existing members
    await supabase
      .from(TABLES.GROUP_MEMBERS)
      .delete()
      .eq('group_id', groupId);

    // Add members
    const members = group.riders.map(rider => ({
      group_id: groupId,
      signup_id: rider.id,
    }));

    if (members.length > 0) {
      await supabase
        .from(TABLES.GROUP_MEMBERS)
        .insert(members);
    }
  }
}

/**
 * Load location groups from database
 *
 * @param signupIds - IDs of signups to load groups for
 * @returns Array of location groups or null if no cached groups exist
 */
async function loadLocationGroupsFromDatabase(
  signupIds: string[]
): Promise<LocationGroup[] | null> {
  // Get group memberships for these signups
  const { data: members } = await supabase
    .from(TABLES.GROUP_MEMBERS)
    .select('group_id, signup_id')
    .in('signup_id', signupIds);

  if (!members || members.length === 0) {
    return null;
  }

  const groupIds = [...new Set(members.map(m => m.group_id))];

  // Get group data
  const { data: groupsData } = await supabase
    .from(TABLES.RIDER_GROUPS)
    .select('*')
    .in('id', groupIds);

  if (!groupsData) {
    return null;
  }

  // Get signup data
  const { data: allSignups } = await supabase
    .from(TABLES.SIGNUPS)
    .select('*')
    .in('id', signupIds);

  if (!allSignups) {
    return null;
  }

  // Build location groups
  const locationGroups: LocationGroup[] = [];

  for (const groupData of groupsData) {
    const groupMembers = members.filter(m => m.group_id === groupData.id);
    const riderIds = groupMembers.map(m => m.signup_id);
    const riders = allSignups.filter(s => riderIds.includes(s.id));

    // Geocode riders
    const ridersWithCoords = await geocodeSignups(riders);

    if (ridersWithCoords.length === 0) continue;

    // Calculate center point
    const sumLat = ridersWithCoords.reduce((sum, r) => sum + r.latitude, 0);
    const sumLon = ridersWithCoords.reduce((sum, r) => sum + r.longitude, 0);

    const locationGroup: LocationGroup = {
      id: groupData.id,
      votingDate: groupData.voting_date as VotingDate,
      preferredTime: groupData.preferred_time as TimeSlot,
      address: ridersWithCoords[0].address || '',
      formattedAddress: groupData.group_name || ridersWithCoords[0].formattedAddress,
      streetAddress: extractStreetAddress(groupData.group_name || ridersWithCoords[0].formattedAddress),
      latitude: sumLat / ridersWithCoords.length,
      longitude: sumLon / ridersWithCoords.length,
      riders: ridersWithCoords,
      riderCount: ridersWithCoords.length,
    };

    locationGroups.push(locationGroup);
  }

  return locationGroups.length > 0 ? locationGroups : null;
}

/**
 * Group riders by location (voting day → time slot → address)
 *
 * This is the main entry point for location-based grouping.
 *
 * Algorithm:
 * 1. Filter signups with addresses
 * 2. Try to load cached groups from database
 * 3. If not cached, geocode all addresses
 * 4. Extract street addresses (remove apartment/unit numbers)
 * 5. Group by: voting_date + preferred_time + street_address
 * 6. Save groups to database for next time
 *
 * @param signups - All signups to group
 * @returns Promise with hierarchical day structure
 */
export async function groupRidersByLocation(signups: Signup[]): Promise<DaySection[]> {
  // Filter signups with addresses
  const signupsWithAddresses = signups.filter(
    s => s.address && s.address.trim().length > 0
  );

  if (signupsWithAddresses.length === 0) {
    return [];
  }

  const signupIds = signupsWithAddresses.map(s => s.id);

  // Try to load from database first
  const cachedGroups = await loadLocationGroupsFromDatabase(signupIds);

  let locationGroups: LocationGroup[];

  if (cachedGroups) {
    locationGroups = cachedGroups;
  } else {
    // Geocode all signups
    const ridersWithCoords = await geocodeSignups(signupsWithAddresses);

    // Group by voting date and time slot
    const groupsByDateAndTime = new Map<string, RiderWithCoords[]>();

    for (const rider of ridersWithCoords) {
      const key = `${rider.voting_date}|${rider.preferred_time}`;

      if (!groupsByDateAndTime.has(key)) {
        groupsByDateAndTime.set(key, []);
      }

      groupsByDateAndTime.get(key)!.push(rider);
    }

    // Create location groups
    locationGroups = [];

    for (const [key, riders] of groupsByDateAndTime.entries()) {
      const [votingDate, preferredTime] = key.split('|');

      // Group by street address
      const addressGroups = groupByStreetAddress(riders);

      for (const [streetAddress, ridersAtAddress] of addressGroups) {
        // Calculate center point
        const sumLat = ridersAtAddress.reduce((sum, r) => sum + r.latitude, 0);
        const sumLon = ridersAtAddress.reduce((sum, r) => sum + r.longitude, 0);

        // Use first rider's formatted address as the group name
        const firstRider = ridersAtAddress[0];

        locationGroups.push({
          id: crypto.randomUUID(),
          votingDate: votingDate as VotingDate,
          preferredTime: preferredTime as TimeSlot,
          address: firstRider.address || '',
          formattedAddress: firstRider.formattedAddress,
          streetAddress,
          latitude: sumLat / ridersAtAddress.length,
          longitude: sumLon / ridersAtAddress.length,
          riders: ridersAtAddress,
          riderCount: ridersAtAddress.length,
        });
      }
    }

    // Save to database
    await saveLocationGroupsToDatabase(locationGroups);
  }

  // Load driver assignments
  await loadDriverAssignmentsForGroups(locationGroups);

  // Build hierarchical structure: Day → Time Slot → Location
  const daySectionsMap = new Map<VotingDate, TimeSlotGroup[]>();

  for (const group of locationGroups) {
    if (!daySectionsMap.has(group.votingDate)) {
      daySectionsMap.set(group.votingDate, []);
    }

    const daySlots = daySectionsMap.get(group.votingDate)!;

    // Find or create time slot group
    let timeSlot = daySlots.find(ts => ts.preferredTime === group.preferredTime);

    if (!timeSlot) {
      timeSlot = {
        preferredTime: group.preferredTime,
        locationGroups: [],
        totalRiders: 0,
        totalGroups: 0,
      };
      daySlots.push(timeSlot);
    }

    // Add location group to time slot
    timeSlot.locationGroups.push(group);
    timeSlot.totalRiders += group.riderCount;
    timeSlot.totalGroups += 1;
  }

  // Convert to DaySection array
  const daySections: DaySection[] = [];

  for (const [votingDate, timeSlots] of daySectionsMap.entries()) {
    // Sort time slots chronologically
    timeSlots.sort((a, b) => {
      const timeOrder = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
                        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
      return timeOrder.indexOf(a.preferredTime) - timeOrder.indexOf(b.preferredTime);
    });

    // Calculate totals
    const totalRiders = timeSlots.reduce((sum, ts) => sum + ts.totalRiders, 0);
    const totalGroups = timeSlots.reduce((sum, ts) => sum + ts.totalGroups, 0);

    daySections.push({
      votingDate,
      displayName: formatVotingDate(votingDate),
      votingLocation: VOTING_LOCATIONS[votingDate],
      timeSlots,
      totalRiders,
      totalGroups,
      isExpanded: false, // Default: collapsed
    });
  }

  // Sort day sections: early-voting-date-1, early-voting-date-2, election-day
  daySections.sort((a, b) => {
    const order = ['early-voting-date-1', 'early-voting-date-2', 'election-day'];
    return order.indexOf(a.votingDate) - order.indexOf(b.votingDate);
  });

  return daySections;
}

/**
 * Format voting date for display
 */
function formatVotingDate(votingDate: VotingDate): string {
  switch (votingDate) {
    case 'early-voting-date-1':
      return 'Early Voting Day 1';
    case 'early-voting-date-2':
      return 'Early Voting Day 2';
    case 'election-day':
      return 'Election Day';
    default:
      return votingDate;
  }
}
