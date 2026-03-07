/**
 * Rider Grouping Algorithm
 *
 * This module provides proximity-based grouping of riders for efficient dispatch.
 * Riders are first grouped by voting date/time, then clustered by geographic proximity.
 *
 * Algorithm:
 * 1. Filter signups with valid addresses
 * 2. Group by voting_date + preferred_time
 * 3. For each time slot:
 *    - Geocode all addresses (with caching)
 *    - Calculate distances between all pairs
 *    - Cluster riders within maxDistanceMiles
 *    - Create groups with center points
 * 4. Return groups with rider information
 */

import { geocodeAddress, calculateDistance, calculateCenter } from './mapbox';
import { type Signup } from './supabase';

/**
 * Rider with geocoded coordinates
 */
interface RiderWithCoords extends Signup {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

/**
 * Rider group with coordinates and member information
 */
export interface RiderGroupWithRiders {
  id: string;
  voting_date: string;
  preferred_time: string;
  group_name?: string;
  riders: RiderWithCoords[];
  centerLat: number;
  centerLon: number;
  riderCount: number;
}

/**
 * Group riders by proximity
 *
 * This function groups riders by:
 * 1. Primary grouping: voting_date + preferred_time
 * 2. Secondary grouping: Geographic clustering within maxDistanceMiles
 *
 * @param signups - All signups to group
 * @param maxDistanceMiles - Maximum distance for clustering (default: 2 miles)
 * @returns Promise with array of rider groups
 *
 * @example
 * ```ts
 * const groups = await groupRidersByProximity(signups, 2);
 * console.log(`Created ${groups.length} groups`);
 * ```
 */
export async function groupRidersByProximity(
  signups: Signup[],
  maxDistanceMiles: number = 2
): Promise<RiderGroupWithRiders[]> {
  // Step 1: Filter signups with valid addresses
  const signupsWithAddresses = signups.filter(
    (signup) => signup.address && signup.address.trim().length > 0
  );

  if (signupsWithAddresses.length === 0) {
    return [];
  }

  // Step 2: Group by voting_date + preferred_time
  const timeSlots = groupByTimeSlot(signupsWithAddresses);

  // Step 3: Process each time slot
  const allGroups: RiderGroupWithRiders[] = [];

  for (const [timeKey, slotSignups] of Object.entries(timeSlots)) {
    const [votingDate, preferredTime] = timeKey.split('|');

    // Geocode all addresses in this time slot
    const ridersWithCoords = await geocodeSignups(slotSignups);

    // Cluster riders by proximity
    const clusters = clusterRidersByProximity(ridersWithCoords, maxDistanceMiles);

    // Create group objects
    for (let i = 0; i < clusters.length; i++) {
      const cluster = clusters[i];
      const center = calculateCenter(
        cluster.map((r) => ({ latitude: r.latitude, longitude: r.longitude }))
      );

      const group: RiderGroupWithRiders = {
        id: crypto.randomUUID(),
        voting_date: votingDate,
        preferred_time: preferredTime,
        group_name: generateGroupName(cluster, votingDate, preferredTime, i),
        riders: cluster,
        centerLat: center.latitude,
        centerLon: center.longitude,
        riderCount: cluster.length,
      };

      allGroups.push(group);
    }
  }

  return allGroups;
}

/**
 * Group signups by voting date and preferred time
 */
function groupByTimeSlot(signups: Signup[]): Record<string, Signup[]> {
  const groups: Record<string, Signup[]> = {};

  for (const signup of signups) {
    const key = `${signup.voting_date}|${signup.preferred_time}`;

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(signup);
  }

  return groups;
}

/**
 * Geocode multiple signups and add coordinates
 */
async function geocodeSignups(signups: Signup[]): Promise<RiderWithCoords[]> {
  const results: RiderWithCoords[] = [];

  for (const signup of signups) {
    if (!signup.address) {
      continue;
    }

    try {
      const geocode = await geocodeAddress(signup.address);

      results.push({
        ...signup,
        latitude: geocode.latitude,
        longitude: geocode.longitude,
        formattedAddress: geocode.formattedAddress,
      });
    } catch (error) {
      console.error(`Failed to geocode address for ${signup.first_name} ${signup.last_name}:`, error);
      // Continue with other signups
    }
  }

  return results;
}

/**
 * Cluster riders by geographic proximity
 *
 * Uses a simple distance-based clustering algorithm:
 * - Start with first rider as a cluster center
 * - Find all riders within maxDistanceMiles of the center
 * - Remove those riders from the pool
 * - Repeat until all riders are clustered
 *
 * @param riders - Riders with coordinates
 * @param maxDistanceMiles - Maximum distance for clustering
 * @returns Array of rider clusters
 */
function clusterRidersByProximity(
  riders: RiderWithCoords[],
  maxDistanceMiles: number
): RiderWithCoords[][] {
  const clusters: RiderWithCoords[][] = [];
  const remainingRiders = [...riders];

  while (remainingRiders.length > 0) {
    // Start a new cluster with the first remaining rider
    const cluster: RiderWithCoords[] = [remainingRiders[0]];
    remainingRiders.shift();

    // Find all riders within maxDistanceMiles of any rider in the cluster
    let foundNewRider = true;

    while (foundNewRider && remainingRiders.length > 0) {
      foundNewRider = false;

      for (let i = remainingRiders.length - 1; i >= 0; i--) {
        const rider = remainingRiders[i];

        // Check if this rider is within maxDistanceMiles of any rider in the cluster
        const isNearCluster = cluster.some((clusterRider) => {
          const distance = calculateDistance(
            clusterRider.latitude,
            clusterRider.longitude,
            rider.latitude,
            rider.longitude
          );

          return distance <= maxDistanceMiles;
        });

        if (isNearCluster) {
          cluster.push(rider);
          remainingRiders.splice(i, 1);
          foundNewRider = true;
        }
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}

/**
 * Generate a human-readable group name
 */
function generateGroupName(
  riders: RiderWithCoords[],
  votingDate: string,
  preferredTime: string,
  index: number
): string {
  const timeLabel = formatTimeLabel(preferredTime);
  const dateLabel = formatDateLabel(votingDate);

  // Try to find a common street or area
  const streets = riders
    .map((r) => r.formattedAddress?.split(',')[0])
    .filter(Boolean)
    .slice(0, 2);

  if (streets.length > 0) {
    return `${dateLabel} ${timeLabel} - ${streets.join(' / ')} Area`;
  }

  // Fallback to generic name
  return `${dateLabel} ${timeLabel} - Group ${index + 1}`;
}

/**
 * Format time label for display
 */
function formatTimeLabel(preferredTime: string): string {
  // Convert "10:00 AM" to "10am"
  return preferredTime.toLowerCase().replace(' ', '').replace(':', '');
}

/**
 * Format date label for display
 */
function formatDateLabel(votingDate: string): string {
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

/**
 * Filter groups by voting date and/or preferred time
 *
 * @param groups - All rider groups
 * @param votingDate - Optional voting date filter
 * @param preferredTime - Optional preferred time filter
 * @returns Filtered groups
 */
export function filterGroups(
  groups: RiderGroupWithRiders[],
  votingDate?: string,
  preferredTime?: string
): RiderGroupWithRiders[] {
  return groups.filter((group) => {
    if (votingDate && votingDate !== 'all' && group.voting_date !== votingDate) {
      return false;
    }

    if (preferredTime && preferredTime !== 'all' && group.preferred_time !== preferredTime) {
      return false;
    }

    return true;
  });
}

/**
 * Get unique voting dates from groups
 */
export function getVotingDates(groups: RiderGroupWithRiders[]): string[] {
  const dates = new Set(groups.map((g) => g.voting_date));
  return Array.from(dates).sort();
}

/**
 * Get unique preferred times from groups
 */
export function getPreferredTimes(groups: RiderGroupWithRiders[]): string[] {
  const times = new Set(groups.map((g) => g.preferred_time));
  return Array.from(times).sort();
}

/**
 * Calculate pickup order for riders in a group
 *
 * Uses a simple nearest-neighbor algorithm to create an efficient route.
 *
 * @param group - Rider group with coordinates
 * @returns Array of riders with pickup order
 */
export function calculatePickupOrder(group: RiderGroupWithRiders): Array<{
  rider: RiderWithCoords;
  order: number;
  distanceFromPrevious: number;
}> {
  if (group.riders.length === 0) {
    return [];
  }

  if (group.riders.length === 1) {
    return [
      {
        rider: group.riders[0],
        order: 1,
        distanceFromPrevious: 0,
      },
    ];
  }

  const remaining = [...group.riders];
  const ordered: Array<{
    rider: RiderWithCoords;
    order: number;
    distanceFromPrevious: number;
  }> = [];

  // Start with the rider closest to the group center
  let current = remaining.reduce((closest, rider) => {
    const distanceToCenter = calculateDistance(
      group.centerLat,
      group.centerLon,
      rider.latitude,
      rider.longitude
    );

    const closestDistance = calculateDistance(
      group.centerLat,
      group.centerLon,
      closest.latitude,
      closest.longitude
    );

    return distanceToCenter < closestDistance ? rider : closest;
  });

  ordered.push({
    rider: current,
    order: 1,
    distanceFromPrevious: 0,
  });

  // Remove current from remaining
  const currentIndex = remaining.indexOf(current);
  remaining.splice(currentIndex, 1);

  // Find nearest remaining rider for each subsequent stop
  let order = 2;

  while (remaining.length > 0) {
    const nearest = remaining.reduce((closest, rider) => {
      const distanceFromCurrent = calculateDistance(
        current.latitude,
        current.longitude,
        rider.latitude,
        rider.longitude
      );

      const closestDistance = calculateDistance(
        current.latitude,
        current.longitude,
        closest.latitude,
        closest.longitude
      );

      return distanceFromCurrent < closestDistance ? rider : closest;
    });

    const distance = calculateDistance(
      current.latitude,
      current.longitude,
      nearest.latitude,
      nearest.longitude
    );

    ordered.push({
      rider: nearest,
      order: order++,
      distanceFromPrevious: distance,
    });

    // Update current and remove from remaining
    current = nearest;
    const nearestIndex = remaining.indexOf(nearest);
    remaining.splice(nearestIndex, 1);
  }

  return ordered;
}
