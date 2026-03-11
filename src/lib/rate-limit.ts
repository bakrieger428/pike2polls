/**
 * Rate Limiting Utility
 *
 * Provides rate limiting functionality to prevent abuse and spam.
 * Uses in-memory storage for development, with Upstash Redis support for production.
 *
 * Usage:
 * ```typescript
 * import { checkRateLimit } from '@/lib/rate-limit';
 *
 * const result = await checkRateLimit('signup', request.ip);
 * if (!result.success) {
 *   return new Response('Too many requests', { status: 429 });
 * }
 * ```
 */

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
}

/**
 * In-memory rate limit store for development
 * In production, use Upstash Redis for distributed rate limiting
 */
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const inMemoryStore = new Map<string, RateLimitEntry>();

/**
 * Clean up expired entries from in-memory store
 * Run periodically to prevent memory leaks
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of inMemoryStore.entries()) {
    if (entry.resetAt < now) {
      inMemoryStore.delete(key);
    }
  }
}

// Cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Rate limit configuration for different endpoints
 */
export const RATE_LIMITS = {
  // Signup form: 10 requests per minute per IP
  signup: { limit: 10, window: 60 * 1000 }, // 1 minute

  // Volunteer form: 5 requests per minute per IP
  volunteer: { limit: 5, window: 60 * 1000 }, // 1 minute

  // Admin login: 5 requests per 5 minutes per IP
  admin: { limit: 5, window: 5 * 60 * 1000 }, // 5 minutes

  // Mapbox geocoding: 100 requests per minute globally
  mapbox: { limit: 100, window: 60 * 1000 }, // 1 minute
} as const;

export type RateLimitType = keyof typeof RATE_LIMITS;

/**
 * Check if a request should be rate limited
 *
 * @param type - The type of rate limit to check
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @returns Rate limit result with success status and metadata
 */
export async function checkRateLimit(
  type: RateLimitType,
  identifier: string
): Promise<RateLimitResult> {
  const config = RATE_LIMITS[type];
  const now = Date.now();
  const key = `${type}:${identifier}`;

  // Check if using Upstash Redis (production)
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return await checkRateLimitUpstash(key, config.limit, config.window, now);
  }

  // Fall back to in-memory storage (development)
  return checkRateLimitInMemory(key, config.limit, config.window, now);
}

/**
 * In-memory rate limiting (development)
 * NOTE: This doesn't work across multiple server instances
 */
function checkRateLimitInMemory(
  key: string,
  limit: number,
  window: number,
  now: number
): RateLimitResult {
  const entry = inMemoryStore.get(key);

  // Clean up expired entries
  if (entry && entry.resetAt < now) {
    inMemoryStore.delete(key);
  }

  const currentEntry = inMemoryStore.get(key);

  if (!currentEntry) {
    // First request in window
    const resetAt = now + window;
    inMemoryStore.set(key, { count: 1, resetAt });

    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetAt: new Date(resetAt),
    };
  }

  // Check if limit exceeded
  if (currentEntry.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetAt: new Date(currentEntry.resetAt),
    };
  }

  // Increment counter
  currentEntry.count += 1;

  return {
    success: true,
    limit,
    remaining: limit - currentEntry.count,
    resetAt: new Date(currentEntry.resetAt),
  };
}

/**
 * Upstash Redis rate limiting (production)
 * Provides distributed rate limiting across multiple server instances
 *
 * Requires environment variables:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 *
 * Get free Redis at: https://upstash.com/
 */
async function checkRateLimitUpstash(
  key: string,
  limit: number,
  window: number,
  now: number
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;

  // Use Redis pipeline for atomic operations
  const response = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      ['GET', key],
      ['INCR', key],
      ['EXPIREAT', key, Math.floor((now + window) / 1000)],
    ]),
  });

  if (!response.ok) {
    // Fall back to allowing request if Upstash fails
    console.error('Rate limit check failed:', await response.text());
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetAt: new Date(now + window),
    };
  }

  const results = await response.json();
  const count = (results[1]?.result as number) || 1;

  return {
    success: count <= limit,
    limit,
    remaining: Math.max(0, limit - count),
    resetAt: new Date(now + window),
  };
}

/**
 * Get client IP address from request headers
 * Works with Vercel, Cloudflare, and standard proxies
 */
export function getClientIP(request: Request): string {
  // Check various headers for IP address
  const headers = request.headers;

  // Vercel / Cloudflare
  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;

  // Standard proxy headers
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) return xRealIp;

  // Fallback to remote address (not available in Edge runtime)
  return 'unknown';
}

/**
 * Parse rate limit type from request path
 */
export function getRateLimitTypeFromPath(path: string): RateLimitType | null {
  if (path.startsWith('/signup')) return 'signup';
  if (path.startsWith('/volunteer')) return 'volunteer';
  if (path.startsWith('/admin/login')) return 'admin';
  return null;
}
