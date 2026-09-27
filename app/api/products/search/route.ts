import { NextResponse } from 'next/server';
import { getEbayIntegrationStatus, getHighValueTrendingProducts, searchEbayProducts } from '../../../../lib/ebay-api';
import { allProducts } from '../../../../lib/products';
import { withRateLimit } from '../../../../lib/rate-limit';
import { asValidationErrorResponse, validateSearchQuery } from '@/src/lib/validation';
import { logger } from '@/src/lib/logger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function isHighValueDiscoveryQuery(query: string): boolean {
  const normalized = query.toLowerCase().trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-');
  return normalized === 'high-value-deals' || normalized === 'high-value-trending';
}

async function searchProducts(request: Request) {
  const validation = validateSearchQuery(new URL(request.url).searchParams);
  if (!validation.success) {
    return NextResponse.json(asValidationErrorResponse(validation), { status: 400 });
  }

  const { q: query, limit } = validation.data;

  try {
    const status = getEbayIntegrationStatus();
    const useHighValueDiscovery = isHighValueDiscoveryQuery(query);
    logger.info('Search request', { query, mode: status.mode, intent: useHighValueDiscovery ? 'high-value-discovery' : 'keyword' });

    if (status.mode !== 'disabled') {
      const products = useHighValueDiscovery
        ? await getHighValueTrendingProducts(limit)
        : await searchEbayProducts(query, limit);

      if (products.length > 0) {
        return NextResponse.json({
          products,
          query,
          source: useHighValueDiscovery ? 'ebay-high-value-trending' : 'ebay-api',
          total: products.length,
        });
      }
    }

    const fallbackProducts = allProducts.filter(
      (p) => p.title.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()),
    );

    return NextResponse.json({
      products: fallbackProducts.slice(0, limit),
      query,
      source: 'fallback',
      total: fallbackProducts.length,
    });
  } catch (error) {
    logger.error('Search route failure', { query, error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json({ products: [], query, source: 'fallback-error', total: 0 }, { status: 500 });
  }
}

export const GET = withRateLimit(searchProducts, { maxRequests: 60, windowMs: 60 * 1000 });
