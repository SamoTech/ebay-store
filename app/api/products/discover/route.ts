import { NextRequest, NextResponse } from 'next/server';
import { allProducts } from '../../../../lib/products';
import { getEbayIntegrationStatus, searchEbayProducts } from '../../../../lib/ebay-api';
import { getIdentifier, rateLimit } from '../../../../lib/rate-limit';

export const dynamic = 'force-dynamic';
export const revalidate = 600;

let productCache: { products: typeof allProducts; expiresAt: number } | null = null;

const DAILY_KEYWORDS = [
  'electronics bluetooth wireless',
  'gaming console accessories',
  'smart home devices',
  'nike adidas sneakers shoes',
  'kitchen appliances gadgets',
  'laptop macbook accessories',
  'headphones earbuds audio',
];

export async function GET(request: NextRequest) {
  const identifier = `products-discover:${getIdentifier(request)}`;
  const rateLimitResult = rateLimit(identifier, 60, 60 * 1000);

  if (!rateLimitResult.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.', success: false }, { status: 429 });
  }

  const now = Date.now();
  if (productCache && now < productCache.expiresAt) {
    return NextResponse.json({ products: productCache.products, source: 'ebay_cached', total: productCache.products.length });
  }

  const status = getEbayIntegrationStatus();
  if (status.mode !== 'disabled') {
    const keyword = DAILY_KEYWORDS[new Date().getDay()];
    const products = await searchEbayProducts(keyword, 20);
    if (products.length > 0) {
      productCache = { products, expiresAt: now + 10 * 60 * 1000 };
      return NextResponse.json({ products, source: 'ebay_live', total: products.length, keyword });
    }
  }

  return NextResponse.json({ products: allProducts, source: 'fallback_static', total: allProducts.length });
}
