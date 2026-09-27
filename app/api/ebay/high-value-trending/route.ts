import { NextRequest, NextResponse } from 'next/server';
import { getHighValueTrendingProducts } from '@/lib/ebay-api';
import { withRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const MAX_LIMIT = 20;

async function handler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const requestedLimit = Number.parseInt(searchParams.get('limit') ?? '8', 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), MAX_LIMIT)
    : 8;

  try {
    const products = await getHighValueTrendingProducts(limit);

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        query: 'high-value-trending',
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
      { success: false, error: 'Failed to fetch high-value eBay products' },
      { status: 502 },
    );
  }
}

export const GET = withRateLimit(handler, { maxRequests: 20, windowMs: 60 * 1000 });
