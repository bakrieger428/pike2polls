/**
 * Next.js Middleware
 *
 * Runs on every request before it reaches your application.
 * Perfect for rate limiting, authentication checks, and redirects.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, getClientIP, getRateLimitTypeFromPath } from '@/lib/rate-limit';

/**
 * Routes that should be excluded from middleware processing
 */
const EXCLUDED_PATHS = [
  '/_next',
  '/api',
  '/static',
  '/favicon.ico',
  '/robots.txt',
];

/**
 * Configure which paths the middleware should run on
 *
 * Matcher format:
 * - /path: Exact path match
 * - /path/*: Wildcard match
 */
export const config = {
  matcher: [
    /*
     * Match all pathnames except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};

/**
 * Middleware handler
 * Runs on every matched request
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);

  // Log rate limit checks (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] ${pathname} from ${clientIP}`);
  }

  // Check rate limiting for protected routes
  const rateLimitType = getRateLimitTypeFromPath(pathname);

  if (rateLimitType) {
    const result = await checkRateLimit(rateLimitType, clientIP);

    if (!result.success) {
      // Rate limit exceeded - return 429 Too Many Requests
      const response = new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: `Rate limit exceeded. Please try again later.`,
          retryAfter: Math.ceil((result.resetAt.getTime() - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((result.resetAt.getTime() - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetAt.toISOString(),
          },
        }
      );

      // Add CORS headers if needed
      response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

      return response;
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.resetAt.toISOString());

    return response;
  }

  // No rate limiting needed - proceed normally
  return NextResponse.next();
}
