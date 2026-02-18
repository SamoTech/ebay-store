import { NextResponse } from 'next/server';
import { allProducts } from '../../../../lib/products';
import { getEbayIntegrationStatus, searchEbayProducts } from '../../../../lib/ebay-api';
import { withRateLimit } from '../../../../lib/rate-limit';

export const dynamic = 'force-dynamic';
export const revalidate = 600;

const dealCategories = ['iPhone 15', 'PlayStation 5', 'Nike Sneakers', 'MacBook Pro', 'Samsung Galaxy', 'Nintendo Switch', 'Apple Watch'];

async function getDailyDeal() {
  try {
    const todayCategory = dealCategories[new Date().getDay()];
    const status = getEbayIntegrationStatus();

    if (status.mode !== 'disabled') {
      const products = await searchEbayProducts(todayCategory, 1);
      if (products.length > 0) {
        return NextResponse.json({ deal: products[0], category: todayCategory, source: 'ebay-api', expiresAt: getEndOfDay() });
      }
    }

    return NextResponse.json({
      deal: allProducts[Math.floor(Math.random() * allProducts.length)],
      category: todayCategory,
      source: 'fallback',
      expiresAt: getEndOfDay(),
    });
  } catch {
    return NextResponse.json({
      deal: allProducts[Math.floor(Math.random() * allProducts.length)],
      category: 'Mixed',
      source: 'fallback-error',
      expiresAt: getEndOfDay(),
    });
  }
}

function getEndOfDay(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();
}

export const GET = withRateLimit(getDailyDeal, { maxRequests: 60, windowMs: 60 * 1000 });
