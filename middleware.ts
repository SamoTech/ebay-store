import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const { pathname } = request.nextUrl;

  // Skip middleware for sitemaps, robots.txt, static files, API routes, and Next.js internals
  if (
    pathname === '/sitemap.xml' ||
    pathname === '/sitemap-index.xml' ||
    pathname === '/robots.txt' ||
    pathname.startsWith('/sitemaps/') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2|ttf|otf|xml|txt)$/)
  ) {
    return NextResponse.next();
  }

  // Allow all routes to pass through
  const response = NextResponse.next();

  // Add security headers but don't block navigation
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - sitemap files
     * - robots.txt
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap|robots|sitemaps|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|txt)).*)',
  ],
};
