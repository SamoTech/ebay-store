import { NextResponse } from 'next/server';

/**
 * @deprecated Consolidated into /api/health.
 *
 * Kept as a permanent redirect so existing links keep working. The previous
 * implementation echoed credential prefixes and environment details, which
 * must never be publicly readable.
 */
export const dynamic = 'force-dynamic';

export function GET(request: Request) {
  return NextResponse.redirect(new URL('/api/health', request.url), 308);
}
