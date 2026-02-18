import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateStore = new Map<string, number[]>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 60;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(ip: string): { limited: boolean; remaining: number } {
  const now = Date.now();
  const recent = (rateStore.get(ip) ?? []).filter((ts) => now - ts < RATE_WINDOW_MS);

  if (recent.length >= RATE_MAX) {
    rateStore.set(ip, recent);
    return { limited: true, remaining: 0 };
  }

  recent.push(now);
  rateStore.set(ip, recent);
  return { limited: false, remaining: RATE_MAX - recent.length };
}

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.ebay.com https://svcs.ebay.com;");
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api')) {
    const ip = getClientIp(request);
    const result = isRateLimited(ip);
    if (result.limited) {
      const response = NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      response.headers.set('X-RateLimit-Limit', RATE_MAX.toString());
      response.headers.set('X-RateLimit-Remaining', '0');
      return applySecurityHeaders(response);
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', RATE_MAX.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    return applySecurityHeaders(response);
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
