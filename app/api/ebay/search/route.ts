import { NextRequest, NextResponse } from 'next/server';
import { getTrendingProducts, searchEbayProducts } from '@/lib/ebay-api';
import { withRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const MAX_LIMIT = 50;

/**
 * GET /api/ebay/search — legacy product search endpoint.
 *
 * Kept for backwards compatibility with the `/api/ebay/*` surface; new code
 * should use `/api/products/search` (validation + static fallback) instead.
 *
 * @example
 * GET /api/ebay/search?q=laptop
 * GET /api/ebay/search?trending=true&limit=12
 */
async function handler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim() ?? '';
  const trending = searchParams.get('trending') === 'true';
  const requestedLimit = Number.parseInt(searchParams.get('limit') ?? '12', 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), MAX_LIMIT)
    : 12;

  if (!trending && !query) {
    return NextResponse.json(
      { success: false, error: 'Please provide ?q=keyword or ?trending=true' },
      { status: 400 },
    );
  }

  try {
    const products = trending
      ? await getTrendingProducts()
      : await searchEbayProducts(query, limit);

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        query: trending ? 'trending' : query,
        products,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch from eBay' },
      { status: 502 },
    );
  }
}

export const GET = withRateLimit(handler, { maxRequests: 30, windowMs: 60 * 1000 });
