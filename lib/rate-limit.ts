/**
 * Simple in-memory rate limiter for API routes
 * For production, use @upstash/ratelimit with Redis
 */

import { RateLimitError } from './error-handler';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
};

/**
 * Clean up expired entries
 */
function cleanup() {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetAt < now) {
      delete store[key];
    }
  });
}

// Run cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(cleanup, 5 * 60 * 1000);
}

/**
 * Check rate limit for identifier
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store[identifier];

  // No previous requests or window expired
  if (!entry || entry.resetAt < now) {
    store[identifier] = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    };
  }

  // Increment counter
  entry.count++;

  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Middleware for API routes
 */
export function rateLimitMiddleware(
  request: Request,
  config?: RateLimitConfig
): void {
  const identifier =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  const result = checkRateLimit(identifier, config);

  if (!result.allowed) {
    throw new RateLimitError(
      `Rate limit exceeded. Try again in ${Math.ceil((result.resetAt - Date.now()) / 1000)}s`
    );
  }
}
