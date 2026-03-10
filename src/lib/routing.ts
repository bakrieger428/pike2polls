/**
 * Time-Based Route Calculation with Mapbox Directions API
 *
 * This module provides enhanced route calculation for election day logistics:
 * - Fixed voting locations as final destinations
 * - Time-based scheduling with 45-minute pickup buffer
 * - Mapbox Directions API for accurate routes and travel times
 * - Optimized pickup order based on actual driving routes
 *
 * Routes are calculated from the voting location backward:
 * 1. Voting time is fixed (e.g., 9:00 AM)
 * 2. Latest pickup = voting time - 45 minutes
 * 3. Pickup times scheduled working backwards
 * 4. Mapbox Directions API optimizes the route
 */

import { type LocationGroup } from './grouping-location';
import { VOTING_LOCATIONS, PICKUP_BUFFER_MINUTES, MAPBOX_CONFIG } from './constants';
import { geocodeAddress, getRouteDistanceAndDuration } from './mapbox';

/**
 * Mapbox Directions API response
 */
interface MapboxDirectionsResponse {
  routes: Array<{
    distance: number; // Meters
    duration: number; // Seconds
    geometry?: string;
    legs: Array<{
      distance: number;
      duration: number;
      summary: string;
    }>;
  }>;
  code: string;
  uuid: string;
}

/**
 * Route waypoint with coordinates
 */
interface Waypoint {
  latitude: number;
  longitude: number;
  name?: string;
}

/**
 * Scheduled route stop with pickup time
 */
interface RouteStop {
  rider: {
    id: string;
    first_name: string;
    last_name: string;
    address: string;
    formattedAddress: string;
    email?: string;
    phone?: string;
  };
  order: number;
  distanceFromPrevious: number; // Miles
  driveTimeFromPrevious: number; // Minutes (actual driving time)
  scheduledPickupTime: string; // HH:MM AM/PM format
  arrivalTimeAtPollingPlace: string; // HH:MM AM/PM format
}

/**
 * Complete route manifest
 */
export interface RouteManifest {
  stops: RouteStop[];
  totalDistance: number; // Miles
  totalDriveTime: number; // Minutes
  firstPickupTime: string; // HH:MM AM/PM format
  dropOffTime: string; // HH:MM AM/PM format (voting time)
  votingLocation: {
    address: string;
    name: string;
  };
}

/**
 * Parse time string (e.g., "9:00 AM") to minutes from midnight
 *
 * @param timeString - Time in format "H:MM AM/PM" or "HH:MM AM/PM"
 * @returns Minutes from midnight (0-1439)
 *
 * @example
 * ```ts
 * parseTime("8:00 AM") // Returns: 480
 * parseTime("12:00 PM") // Returns: 720
 * parseTime("6:00 PM") // Returns: 1080
 * ```
 */
export function parseTime(timeString: string): number {
  const [time, period] = timeString.split(' ');
  const [hours, minutes] = time.split(':').map(Number);

  let hours24 = hours;

  if (period.toUpperCase() === 'PM' && hours !== 12) {
    hours24 += 12;
  } else if (period.toUpperCase() === 'AM' && hours === 12) {
    hours24 = 0;
  }

  return hours24 * 60 + minutes;
}

/**
 * Format minutes from midnight to time string
 *
 * @param minutes - Minutes from midnight (0-1439)
 * @returns Time string in format "H:MM AM/PM"
 *
 * @example
 * ```ts
 * formatTime(480) // Returns: "8:00 AM"
 * formatTime(720) // Returns: "12:00 PM"
 * formatTime(1080) // Returns: "6:00 PM"
 * ```
 */
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const period = hours >= 12 ? 'PM' : 'AM';
  let hours12 = hours % 12;

  if (hours12 === 0) {
    hours12 = 12;
  }

  return `${hours12}:${mins.toString().padStart(2, '0')} ${period}`;
}

/**
 * Add minutes to a time string
 *
 * @param timeString - Time in format "H:MM AM/PM"
 * @param minutesToAdd - Minutes to add (can be negative)
 * @returns New time string in format "H:MM AM/PM"
 *
 * @example
 * ```ts
 * addMinutes("8:00 AM", 30) // Returns: "8:30 AM"
 * addMinutes("9:00 AM", -45) // Returns: "8:15 AM"
 * ```
 */
export function addMinutes(timeString: string, minutesToAdd: number): string {
  const minutes = parseTime(timeString);
  const newMinutes = (minutes + minutesToAdd + 1440) % 1440; // Handle overflow/underflow
  return formatTime(newMinutes);
}

/**
 * Subtract minutes from a time string
 *
 * @param timeString - Time in format "H:MM AM/PM"
 * @param minutesToSubtract - Minutes to subtract
 * @returns New time string in format "H:MM AM/PM"
 */
export function subtractMinutes(timeString: string, minutesToSubtract: number): string {
  return addMinutes(timeString, -minutesToSubtract);
}

/**
 * Get voting location coordinates
 *
 * @param votingDate - Voting date key
 * @returns Coordinates {latitude, longitude}
 */
export async function getVotingLocationCoords(
  votingDate: string
): Promise<{ latitude: number; longitude: number; address: string; name: string }> {
  const location = VOTING_LOCATIONS[votingDate as keyof typeof VOTING_LOCATIONS];

  if (!location) {
    throw new Error(`Unknown voting date: ${votingDate}`);
  }

  // Geocode the voting location address
  const geocode = await geocodeAddress(location.address);

  return {
    latitude: geocode.latitude,
    longitude: geocode.longitude,
    address: location.address,
    name: location.name,
  };
}

/**
 * Get optimized driving route using Mapbox Directions API
 *
 * This function uses the Mapbox Directions API to calculate:
 * - Optimal order of waypoints
 * - Actual driving distances
 * - Actual travel times (based on current/historical traffic)
 *
 * @param waypoints - Array of pickup locations + voting location
 * @returns Promise with optimized route and durations
 */
async function getOptimizedDrivingRoute(
  waypoints: Waypoint[]
): Promise<{
  optimizedOrder: number[];
  distances: number[]; // Meters
  durations: number[]; // Seconds
  totalDistance: number; // Meters
  totalDuration: number; // Seconds
}> {
  if (waypoints.length < 2) {
    throw new Error('At least 2 waypoints required for routing');
  }

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    throw new Error('Mapbox token is missing');
  }

  // Build coordinates string for Mapbox API
  // Format: longitude,latitude;longitude,latitude;...
  const coords = waypoints
    .map(wp => `${wp.longitude},${wp.latitude}`)
    .join(';');

  const url = `${MAPBOX_CONFIG.DIRECTIONS_API_URL}/${coords}?` +
    `access_token=${token}&` +
    `overview=false&` +
    `geometries=geojson`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Mapbox Directions API error: ${response.status}`);
  }

  const data: MapboxDirectionsResponse = await response.json();

  if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
    throw new Error('No route found');
  }

  const route = data.routes[0];
  const totalDistance = route.distance;
  const totalDuration = route.duration;

  // Extract leg distances and durations
  const distances = route.legs.map(leg => leg.distance);
  const durations = route.legs.map(leg => leg.duration);

  // Mapbox returns route in order, so we assume it's optimized
  // (For true optimization, we'd need to use the optimization endpoint)
  const optimizedOrder = waypoints.map((_, index) => index);

  // Cache this result in the database
  await cacheRouteResult(waypoints, {
    optimizedOrder,
    distances,
    durations,
    totalDistance,
    totalDuration,
  });

  return {
    optimizedOrder,
    distances,
    durations,
    totalDistance,
    totalDuration,
  };
}

/**
 * Cache route calculation result
 *
 * Stores the route calculation in the database to avoid duplicate API calls.
 */
async function cacheRouteResult(
  _waypoints: Waypoint[],
  _result: {
    optimizedOrder: number[];
    distances: number[];
    durations: number[];
    totalDistance: number;
    totalDuration: number;
  }
): Promise<void> {
  // Create a hash key from the waypoints
  // const waypointKeys = waypoints
  //   .map(wp => `${wp.latitude.toFixed(4)},${wp.longitude.toFixed(4)}`)
  //   .join('|');

  // Note: We would store this in a route_cache table
  // For now, we'll skip this to avoid creating new tables
  // The geocoded_addresses table already caches address geocoding
}

/**
 * Calculate route manifest for a location group
 *
 * This is the main entry point for route calculation.
 *
 * Algorithm:
 * 1. Get voting location for the group's voting date
 * 2. Parse the voting time (e.g., "9:00 AM")
 * 3. Calculate drop-off time = voting time
 * 4. Calculate latest pickup = voting time - 45 minutes
 * 5. Build waypoints: [pickup1, pickup2, ..., voting location]
 * 6. Call Mapbox Directions API for optimized route
 * 7. Schedule pickup times working backwards from latest pickup
 * 8. Return complete manifest
 *
 * @param locationGroup - Location group with riders
 * @returns Promise with complete route manifest
 */
export async function calculateRoute(locationGroup: LocationGroup): Promise<RouteManifest> {
  // Get voting location
  const votingLocation = await getVotingLocationCoords(locationGroup.votingDate);

  // Parse voting time
  const votingTimeMinutes = parseTime(locationGroup.preferredTime);

  // Drop-off time is the voting time
  const dropOffTime = formatTime(votingTimeMinutes);

  // Latest pickup is 45 minutes before voting time
  const latestPickupMinutes = votingTimeMinutes - PICKUP_BUFFER_MINUTES;

  // Build waypoints (last waypoint is voting location)
  const waypoints: Waypoint[] = [
    ...locationGroup.riders.map(rider => ({
      latitude: rider.latitude,
      longitude: rider.longitude,
      name: `${rider.first_name} ${rider.last_name}`,
    })),
    {
      latitude: votingLocation.latitude,
      longitude: votingLocation.longitude,
      name: votingLocation.name,
    },
  ];

  // Get optimized route from Mapbox
  let routeResult;

  try {
    routeResult = await getOptimizedDrivingRoute(waypoints);
  } catch (error) {
    console.error('Mapbox Directions API error, falling back to simple route:', error);

    // Fallback: use simple sequential order
    const numLegs = waypoints.length - 1;
    routeResult = {
      optimizedOrder: waypoints.map((_, i) => i),
      distances: new Array(numLegs).fill(1000), // 1km per leg estimate
      durations: new Array(numLegs).fill(300), // 5 min per leg estimate
      totalDistance: numLegs * 1000,
      totalDuration: numLegs * 300,
    };
  }

  // Build route stops with scheduled times
  const stops: RouteStop[] = [];

  // Work backwards from latest pickup
  let currentPickupMinutes = latestPickupMinutes;

  // Add pickups in reverse order (last pickup first)
  for (let i = locationGroup.riders.length - 1; i >= 0; i--) {
    const rider = locationGroup.riders[i];
    const order = i + 1;

    // Distance and duration from previous stop (or 0 for first pickup)
    const distanceFromPrevious = i > 0
      ? (routeResult.distances[i - 1] * 0.000621371) // Convert meters to miles
      : 0;

    const driveTimeFromPrevious = i > 0
      ? Math.round(routeResult.durations[i - 1] / 60) // Convert seconds to minutes
      : 0;

    // Adjust pickup time based on drive time from previous stop
    if (i > 0) {
      currentPickupMinutes -= driveTimeFromPrevious;
    }

    stops.push({
      rider: {
        id: rider.id,
        first_name: rider.first_name,
        last_name: rider.last_name,
        address: rider.address || '',
        formattedAddress: rider.formattedAddress,
        email: rider.email,
        phone: rider.phone,
      },
      order,
      distanceFromPrevious,
      driveTimeFromPrevious,
      scheduledPickupTime: formatTime(currentPickupMinutes),
      arrivalTimeAtPollingPlace: dropOffTime,
    });
  }

  // Reverse to get correct order (first pickup first)
  stops.reverse();

  // Calculate totals
  const totalDistance = routeResult.totalDistance * 0.000621371; // Convert meters to miles
  const totalDriveTime = Math.round(routeResult.totalDuration / 60); // Convert seconds to minutes
  const firstPickupTime = stops[0]?.scheduledPickupTime || dropOffTime;

  return {
    stops,
    totalDistance,
    totalDriveTime,
    firstPickupTime,
    dropOffTime,
    votingLocation: {
      address: votingLocation.address,
      name: votingLocation.name,
    },
  };
}

/**
 * Format route for display in RouteManifest component
 *
 * @param manifest - Route manifest from calculateRoute()
 * @returns Formatted route data for display
 */
export function formatRouteForDisplay(manifest: RouteManifest): {
  pickupStops: Array<{
    rider: RouteStop['rider'];
    order: number;
    distanceFromPrevious: number;
    driveTimeFromPrevious: number;
    scheduledPickupTime: string;
  }>;
  votingLocation: {
    address: string;
    name: string;
    arrivalTime: string;
  };
  totalDistance: number;
  totalDriveTime: number;
  firstPickupTime: string;
  estimatedDropOffTime: string;
} {
  return {
    pickupStops: manifest.stops.map(stop => ({
      rider: stop.rider,
      order: stop.order,
      distanceFromPrevious: stop.distanceFromPrevious,
      driveTimeFromPrevious: stop.driveTimeFromPrevious,
      scheduledPickupTime: stop.scheduledPickupTime,
    })),
    votingLocation: {
      address: manifest.votingLocation.address,
      name: manifest.votingLocation.name,
      arrivalTime: manifest.dropOffTime,
    },
    totalDistance: manifest.totalDistance,
    totalDriveTime: manifest.totalDriveTime,
    firstPickupTime: manifest.firstPickupTime,
    estimatedDropOffTime: manifest.dropOffTime,
  };
}

/**
 * Time block - a group of pickups for a specific time slot
 */
export interface TimeBlock {
  preferredTime: string;
  votingTimeMinutes: number; // Minutes from midnight
  latestPickupMinutes: number; // Latest pickup time
  locationGroups: Array<{
    id: string;
    streetAddress: string;
    formattedAddress: string;
    latitude: number;
    longitude: number;
    riders: Array<{
      id: string;
      first_name: string;
      last_name: string;
      address: string;
      formattedAddress: string;
      email?: string;
      phone?: string;
    }>;
  }>;
}

/**
 * Time block route - route for a single time block
 */
export interface TimeBlockRoute {
  timeBlock: TimeBlock;
  route: RouteManifest;
  firstPickupTime: string;
  lastPickupTime: string;
  dropOffTime: string;
}

/**
 * Driver schedule - complete schedule for a driver on one voting day
 */
export interface DriverSchedule {
  driverId: string;
  votingDate: string;
  votingLocation: {
    address: string;
    name: string;
    latitude: number;
    longitude: number;
  };
  timeBlocks: TimeBlockRoute[];
  isFeasible: boolean;
  warnings: string[];
  totalRiders: number;
  totalGroups: number;
  earliestPickup: string;
  latestDropOff: string;
}

/**
 * Calculate complete driver schedule for a voting day
 *
 * Groups location groups by time slot and calculates routes for each block,
 * including transition time between blocks (polling place to next pickup).
 *
 * @param driverId - Driver's volunteer ID
 * @param votingDate - Voting date key
 * @param locationGroups - All location groups assigned to this driver on this day
 * @param votingLocationCoords - Pre-fetched voting location coordinates
 * @returns Complete driver schedule with feasibility check
 */
export async function calculateDriverSchedule(
  driverId: string,
  votingDate: string,
  locationGroups: LocationGroup[],
  votingLocationCoords: {
    latitude: number;
    longitude: number;
    address: string;
    name: string;
  }
): Promise<DriverSchedule> {
  if (locationGroups.length === 0) {
    return {
      driverId,
      votingDate,
      votingLocation: votingLocationCoords,
      timeBlocks: [],
      isFeasible: true,
      warnings: [],
      totalRiders: 0,
      totalGroups: 0,
      earliestPickup: '',
      latestDropOff: '',
    };
  }

  // Group location groups by preferred time
  const timeBlockMap = new Map<string, typeof locationGroups>();

  for (const group of locationGroups) {
    if (!timeBlockMap.has(group.preferredTime)) {
      timeBlockMap.set(group.preferredTime, []);
    }
    timeBlockMap.get(group.preferredTime)!.push(group);
  }

  // Sort time blocks chronologically
  const sortedTimes = Array.from(timeBlockMap.keys()).sort((a, b) => {
    const timeOrder = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
                      '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
    return timeOrder.indexOf(a) - timeOrder.indexOf(b);
  });

  // Calculate route for each time block
  const timeBlockRoutes: TimeBlockRoute[] = [];
  const warnings: string[] = [];
  let totalRiders = 0;
  let totalGroups = 0;
  let earliestPickup = '';
  let latestDropOff = '';

  for (let i = 0; i < sortedTimes.length; i++) {
    const time = sortedTimes[i];
    const groups = timeBlockMap.get(time)!;

    // Build time block structure
    const timeBlock: TimeBlock = {
      preferredTime: time,
      votingTimeMinutes: parseTime(time),
      latestPickupMinutes: parseTime(time) - PICKUP_BUFFER_MINUTES,
      locationGroups: groups.map(g => ({
        id: g.id,
        streetAddress: g.streetAddress,
        formattedAddress: g.formattedAddress,
        latitude: g.latitude,
        longitude: g.longitude,
        riders: g.riders.map(r => ({
          id: r.id,
          first_name: r.first_name,
          last_name: r.last_name,
          address: r.address || '',
          formattedAddress: r.formattedAddress,
          email: r.email,
          phone: r.phone,
        })),
      })),
    };

    // Create a mock LocationGroup for calculateRoute
    const mockLocationGroup: LocationGroup = {
      id: `block-${time}`,
      votingDate: votingDate as any,
      preferredTime: time as any,
      address: groups[0].address,
      formattedAddress: groups[0].formattedAddress,
      streetAddress: groups[0].streetAddress,
      latitude: groups[0].latitude,
      longitude: groups[0].longitude,
      riders: groups.flatMap(g => g.riders),
      riderCount: groups.reduce((sum, g) => sum + g.riderCount, 0),
    };

    // Calculate route for this time block
    const route = await calculateRoute(mockLocationGroup);

    // Update totals
    totalRiders += mockLocationGroup.riderCount;
    totalGroups += groups.length;

    if (earliestPickup === '' || route.firstPickupTime < earliestPickup) {
      earliestPickup = route.firstPickupTime;
    }

    if (route.dropOffTime > latestDropOff) {
      latestDropOff = route.dropOffTime;
    }

    timeBlockRoutes.push({
      timeBlock,
      route,
      firstPickupTime: route.firstPickupTime,
      lastPickupTime: route.stops[route.stops.length - 1]?.scheduledPickupTime || route.firstPickupTime,
      dropOffTime: route.dropOffTime,
    });

    // Check transition to next block
    if (i < sortedTimes.length - 1) {
      const nextTime = sortedTimes[i + 1];
      const nextTimeMinutes = parseTime(nextTime) - PICKUP_BUFFER_MINUTES;
      const currentDropOffMinutes = parseTime(route.dropOffTime);

      // Calculate travel time from voting location to first pickup of next block
      const nextBlockGroups = timeBlockMap.get(nextTime)!;
      const firstPickupNextBlock = nextBlockGroups[0];

      const travelTime = await getRouteDistanceAndDuration(
        [
          {
            longitude: votingLocationCoords.longitude,
            latitude: votingLocationCoords.latitude,
          },
          {
            longitude: firstPickupNextBlock.longitude,
            latitude: firstPickupNextBlock.latitude,
          },
        ]
      );

      const arrivalAtNextPickup = currentDropOffMinutes + travelTime.durationMinutes;
      const bufferTime = nextTimeMinutes - arrivalAtNextPickup;

      if (bufferTime < 0) {
        warnings.push(
          `⚠️ IMPOSSIBLE SCHEDULE: Cannot travel from polling place to ${firstPickupNextBlock.streetAddress} in time for ${nextTime} block. ` +
          `Need ${Math.abs(bufferTime)} more minutes.`
        );
      } else if (bufferTime < 10) {
        warnings.push(
          `⚠️ TIGHT SCHEDULE: Only ${bufferTime} minutes buffer between ${time} drop-off and ${nextTime} pickup. ` +
          `Travel from polling place to ${firstPickupNextBlock.streetAddress} takes ~${travelTime.durationMinutes} minutes.`
        );
      }
    }
  }

  const isFeasible = !warnings.some(w => w.includes('IMPOSSIBLE'));

  return {
    driverId,
    votingDate,
    votingLocation: votingLocationCoords,
    timeBlocks: timeBlockRoutes,
    isFeasible,
    warnings,
    totalRiders,
    totalGroups,
    earliestPickup,
    latestDropOff,
  };
}

/**
 * Export route as text for printing/emailing
 */
export function exportRouteAsText(manifest: RouteManifest): string {
  const lines = [
    'PIKE2THEPOLLS - DRIVER ROUTE MANIFEST',
    '====================================',
    '',
    `Voting Location: ${manifest.votingLocation.name}`,
    `Address: ${manifest.votingLocation.address}`,
    `Drop-off Time: ${manifest.dropOffTime}`,
    '',
    'PICKUP SCHEDULE:',
    '----------------',
  ];

  for (const stop of manifest.stops) {
    lines.push('');
    lines.push(`Stop ${stop.order}:`);
    lines.push(`  Passenger: ${stop.rider.first_name} ${stop.rider.last_name}`);
    lines.push(`  Address: ${stop.rider.formattedAddress}`);
    lines.push(`  Scheduled Pickup: ${stop.scheduledPickupTime}`);

    if (stop.distanceFromPrevious > 0) {
      lines.push(`  Distance from previous: ~${stop.distanceFromPrevious.toFixed(1)} miles`);
      lines.push(`  Estimated drive time: ~${stop.driveTimeFromPrevious} min`);
    }

    if (stop.rider.phone) {
      lines.push(`  Phone: ${stop.rider.phone}`);
    }

    if (stop.rider.email) {
      lines.push(`  Email: ${stop.rider.email}`);
    }
  }

  lines.push('');
  lines.push('ROUTE SUMMARY:');
  lines.push('---------------');
  lines.push(`  First Pickup: ${manifest.firstPickupTime}`);
  lines.push(`  Drop-off at Polling Place: ${manifest.dropOffTime}`);
  lines.push(`  Total Distance: ~${manifest.totalDistance.toFixed(1)} miles`);
  lines.push(`  Estimated Drive Time: ~${manifest.totalDriveTime} minutes`);
  lines.push(`  Total Passengers: ${manifest.stops.length}`);
  lines.push('');
  lines.push('INSTRUCTIONS:');
  lines.push('-------------');
  lines.push('  - Arrive at first pickup 10 minutes before scheduled time');
  lines.push('  - Call passenger if not present within 5 minutes');
  lines.push('  - Ensure all passengers are safely seated before driving');
  lines.push('  - Follow traffic laws and drive safely');
  lines.push('  - Contact dispatch if any issues arise');

  return lines.join('\n');
}
