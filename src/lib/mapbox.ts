/**
 * Mapbox Geocoding Integration
 *
 * This module provides geocoding functionality using the Mapbox Geocoding API.
 * It includes caching to avoid duplicate API calls for the same addresses.
 *
 * @see https://docs.mapbox.com/api/search/geocoding/
 */

import { getSupabaseClient, TABLES } from './supabase';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const MAPBOX_API_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

/**
 * Geocoding result interface
 */
export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

/**
 * Validate Mapbox token is configured
 */
function validateMapboxToken(): void {
  if (!MAPBOX_TOKEN) {
    throw new Error(
      'Mapbox token is missing. Please add NEXT_PUBLIC_MAPBOX_TOKEN to your environment variables.'
    );
  }
}

/**
 * Geocode an address to coordinates
 *
 * This function:
 * 1. Checks the cache first (geocoded_addresses table)
 * 2. If not cached, calls the Mapbox Geocoding API
 * 3. Saves the result to cache for future use
 * 4. Returns the coordinates
 *
 * @param address - The address to geocode
 * @returns Promise with latitude, longitude, and formatted address
 *
 * @example
 * ```ts
 * const result = await geocodeAddress('123 Main St, Indianapolis, IN');
 * console.log(result.latitude, result.longitude);
 * ```
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  // Validate Mapbox token
  validateMapboxToken();

  // Trim and normalize address
  const normalizedAddress = address.trim();

  if (!normalizedAddress) {
    throw new Error('Address cannot be empty');
  }

  const supabase = getSupabaseClient();

  // Check cache first
  const { data: cached, error: cacheError } = await supabase
    .from(TABLES.GEOCODED_ADDRESSES)
    .select('*')
    .ilike('address', normalizedAddress)
    .maybeSingle();

  if (cacheError) {
    console.error('Error checking geocode cache:', cacheError);
  }

  // Return cached result if available
  if (cached) {
    return {
      latitude: Number(cached.latitude),
      longitude: Number(cached.longitude),
      formattedAddress: cached.formatted_address || normalizedAddress,
    };
  }

  // Call Mapbox Geocoding API
  try {
    // Encode address for URL
    const encodedAddress = encodeURIComponent(normalizedAddress);
    const url = `${MAPBOX_API_URL}/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}&country=US&limit=1`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Check if we got results
    if (!data.features || data.features.length === 0) {
      throw new Error(`Address not found: ${normalizedAddress}`);
    }

    const feature = data.features[0];
    const [longitude, latitude] = feature.center;
    const formattedAddress = feature.place_name || normalizedAddress;

    // Save to cache
    const { error: insertError } = await supabase
      .from(TABLES.GEOCODED_ADDRESSES)
      .insert({
        address: normalizedAddress,
        latitude: String(latitude),
        longitude: String(longitude),
        formatted_address: formattedAddress,
      });

    if (insertError) {
      console.error('Error caching geocoded address:', insertError);
      // Don't throw - we still got the result
    }

    return {
      latitude,
      longitude,
      formattedAddress,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to geocode address: ${normalizedAddress}`);
  }
}

/**
 * Batch geocode multiple addresses
 *
 * Geocodes multiple addresses in parallel, with caching for each.
 *
 * @param addresses - Array of addresses to geocode
 * @returns Promise with array of geocode results (same order as input)
 *
 * @example
 * ```ts
 * const results = await geocodeAddresses([
 *   '123 Main St, Indianapolis, IN',
 *   '456 Oak Ave, Indianapolis, IN',
 * ]);
 * ```
 */
export async function geocodeAddresses(
  addresses: string[]
): Promise<(GeocodeResult | null)[]> {
  // Filter out empty addresses
  const validAddresses = addresses.filter((addr) => addr && addr.trim().length > 0);

  // Geocode in parallel
  const results = await Promise.allSettled(
    validAddresses.map((address) => geocodeAddress(address))
  );

  // Map results back to original array order
  return addresses.map((address, index) => {
    if (!address || address.trim().length === 0) {
      return null;
    }

    const result = results[index];
    if (result.status === 'fulfilled') {
      return result.value;
    }

    console.error(`Failed to geocode "${address}":`, result.reason);
    return null;
  });
}

/**
 * Calculate distance between two coordinates using the Haversine formula
 *
 * Returns the distance in miles.
 *
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in miles
 *
 * @example
 * ```ts
 * const distance = calculateDistance(39.7684, -86.1581, 39.7776, -86.1459);
 * console.log(`Distance: ${distance.toFixed(2)} miles`);
 * ```
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate the center point of multiple coordinates
 *
 * Returns the average latitude and longitude.
 *
 * @param coordinates - Array of {latitude, longitude} objects
 * @returns Center point with latitude and longitude
 *
 * @example
 * ```ts
 * const center = calculateCenter([
 *   { latitude: 39.7684, longitude: -86.1581 },
 *   { latitude: 39.7776, longitude: -86.1459 },
 * ]);
 * ```
 */
export function calculateCenter(
  coordinates: Array<{ latitude: number; longitude: number }>
): { latitude: number; longitude: number } {
  if (coordinates.length === 0) {
    throw new Error('Cannot calculate center of empty coordinate array');
  }

  if (coordinates.length === 1) {
    return coordinates[0];
  }

  const sumLat = coordinates.reduce((sum, coord) => sum + coord.latitude, 0);
  const sumLon = coordinates.reduce((sum, coord) => sum + coord.longitude, 0);

  return {
    latitude: sumLat / coordinates.length,
    longitude: sumLon / coordinates.length,
  };
}

/**
 * Check if a coordinate is within a specified radius of a center point
 *
 * @param lat1 - Latitude of center point
 * @param lon1 - Longitude of center point
 * @param lat2 - Latitude of point to check
 * @param lon2 - Longitude of point to check
 * @param radiusMiles - Radius in miles (default: 2)
 * @returns True if the point is within the radius
 *
 * @example
 * ```ts
 * const isNearby = isWithinRadius(
 *   39.7684, -86.1581,
 *   39.7776, -86.1459,
 *   2 // miles
 * );
 * ```
 */
export function isWithinRadius(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  radiusMiles: number = 2
): boolean {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return distance <= radiusMiles;
}
