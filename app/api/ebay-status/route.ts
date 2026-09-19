import { NextResponse } from 'next/server';

/**
 * @deprecated Consolidated into /api/ebay/status.
 *
 * Kept as a permanent redirect so existing links keep working. The previous
 * implementation echoed credential prefixes and environment details, which
 * must never be publicly readable.
 */
export const dynamic = 'force-dynamic';

export function GET() {
  // Relative Location keeps the redirect on whatever host served the request
  // (absolute URLs derived from `request.url` can leak the bind address).
  return new NextResponse(null, {
    status: 308,
    headers: { Location: '/api/ebay/status' },
  });
}
