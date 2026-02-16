/**
 * Rate Limiting Utility
 * 
 * Provides in-memory rate limiting to prevent API abuse.
 * Uses a simple token bucket algorithm with sliding window.
 * 
 * @example
 * ```typescript
 * import { rateLimit, withRateLimit } from '@/lib/rate-limit';
 * 
 * // Option 1: Manual usage
 * const { success, remaining } = rateLimit(identifier);
 * if (!success) {
 *   return new Response('Too many requests', { status: 429 });
 * }
 * 
 * // Option 2: Middleware wrapper
 * export const POST = withRateLimit(handler, { maxRequests: 5 });
 * ```
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: number[]; // timestamp array
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

interface RateLimitOptions {
  maxRequests?: number;
  windowMs?: number;
}

// In-memory store for rate limiting
// Note: This resets on server restart. For production, consider Redis.
const store: RateLimitStore = {};

// Cleanup old entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  const oneHourAgo = now - (60 * 60 * 1000);
  
  for (const key in store) {
    store[key] = store[key].filter(time => time > oneHourAgo);
    if (store[key].length === 0) {
      delete store[key];
    }
  }
}, 5 * 60 * 1000);

/**
 * Check rate limit for a given identifier
 * 
 * @param identifier - Unique identifier (usually IP address or user ID)
 * @param maxRequests - Maximum requests allowed in the window (default: 10)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns Rate limit result with success status and remaining requests
 */
export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Initialize if not exists
  if (!store[identifier]) {
    store[identifier] = [];
  }
  
  // Filter out requests outside the window (sliding window)
  store[identifier] = store[identifier].filter(
    time => time > windowStart
  );
  
  // Check if limit exceeded
  if (store[identifier].length >= maxRequests) {
    const oldestRequest = Math.min(...store[identifier]);
    const resetAt = oldestRequest + windowMs;
    
    return {
      success: false,
      remaining: 0,
      resetAt,
    };
  }
  
  // Add current request
  store[identifier].push(now);
  
  return {
    success: true,
    remaining: maxRequests - store[identifier].length,
    resetAt: now + windowMs,
  };
}

/**
 * Get client identifier from request
 * Uses IP address or falls back to a hash of user agent
 */
export function getIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (for proxies like Vercel)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  // Use IP if available
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  if (request.ip) {
    return request.ip;
  }
  
  // Fallback: Use hash of user agent (less reliable)
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return `ua-${hashString(userAgent)}`;
}

/**
 * Simple string hash function
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Middleware wrapper for rate limiting
 * 
 * @param handler - The route handler function
 * @param options - Rate limit options
 * @returns Wrapped handler with rate limiting
 * 
 * @example
 * ```typescript
 * export const POST = withRateLimit(
 *   async (request) => {
 *     // Your handler code
 *     return NextResponse.json({ success: true });
 *   },
 *   { maxRequests: 5, windowMs: 60000 }
 * );
 * ```
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: RateLimitOptions = {}
) {
  const maxRequests = options.maxRequests || 10;
  const windowMs = options.windowMs || 60000;
  
  return async (request: NextRequest): Promise<NextResponse> => {
    const identifier = getIdentifier(request);
    const { success, remaining, resetAt } = rateLimit(
      identifier,
      maxRequests,
      windowMs
    );
    
    // Rate limit exceeded
    if (!success) {
      const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
      
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          success: false,
          retryAfter 
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetAt.toString(),
            'Retry-After': retryAfter.toString(),
          }
        }
      );
    }
    
    // Call original handler
    const response = await handler(request);
    
    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', resetAt.toString());
    
    return response;
  };
}

/**
 * Reset rate limit for a specific identifier
 * Useful for testing or admin overrides
 */
export function resetRateLimit(identifier: string): void {
  delete store[identifier];
}

/**
 * Get current rate limit status for an identifier
 */
export function getRateLimitStatus(identifier: string): {
  requests: number;
  timestamps: number[];
} {
  return {
    requests: store[identifier]?.length || 0,
    timestamps: store[identifier] || [],
  };
}
