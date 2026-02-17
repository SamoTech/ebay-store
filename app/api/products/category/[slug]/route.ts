import { NextRequest, NextResponse } from 'next/server';
import { allProducts } from '../../../../../lib/products';
import {
  getEbayIntegrationStatus,
  searchEbayProducts,
} from '../../../../../lib/ebay-api';
import { getIdentifier, rateLimit } from '../../../../../lib/rate-limit';

// Force dynamic rendering - required for runtime environment variables
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Category-specific search queries mapped by slug
const categoryQueryMap: Record<string, { query: string; categoryName: string }> = {
  electronics: { query: 'electronics', categoryName: 'Electronics' },
  gaming: { query: 'gaming console', categoryName: 'Gaming' },
  'smart-home': { query: 'smart home', categoryName: 'Smart Home' },
  sneakers: { query: 'sneakers', categoryName: 'Sneakers' },
  'home-kitchen': { query: 'kitchen appliances', categoryName: 'Home & Kitchen' },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const identifier = `products-category:${getIdentifier(request)}`;
  const rateLimitResult = rateLimit(identifier, 60, 60 * 1000);

  if (!rateLimitResult.success) {
    const retryAfter = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000);

    return NextResponse.json(
      { error: 'Too many requests. Please try again later.', success: false, retryAfter },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
        },
      }
    );
  }

  // Next.js 16: params is now a Promise
  const { slug } = await params;

  const categoryInfo = categoryQueryMap[slug];
  if (!categoryInfo) {
    return NextResponse.json(
      { error: 'Category not found', products: [] },
      { status: 404 }
    );
  }

  const { query, categoryName } = categoryInfo;

  try {
    const status = getEbayIntegrationStatus();
    console.log(`🔍 Category "${categoryName}" - eBay Status:`, status.mode);

    // Use eBay API if configured
    if (status.mode !== 'disabled') {
      console.log(`🔍 Fetching ${categoryName} from eBay...`);
      
      // searchEbayProducts returns Product[] already mapped
      const products = await searchEbayProducts(query, 20);

      if (products.length > 0) {
        console.log(`✅ Found ${products.length} eBay products for ${categoryName}`);
        return NextResponse.json({
          products,
          category: categoryName,
          source: 'ebay-api',
          total: products.length,
        });
      }

      console.warn(`⚠️ No eBay results for ${categoryName}, using fallback`);
    } else {
      console.warn(`⚠️ eBay API disabled for ${categoryName}`);
    }

    // Fallback to static products
    console.log(`⚠️ Using fallback data for ${categoryName}`);
    const fallbackProducts = allProducts.filter(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase()
    );

    return NextResponse.json({
      products: fallbackProducts,
      category: categoryName,
      source: 'fallback',
      total: fallbackProducts.length,
    });
  } catch (error) {
    console.error(`❌ Error fetching ${categoryName}:`, error);
    
    const fallbackProducts = allProducts.filter(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase()
    );

    return NextResponse.json({
      products: fallbackProducts,
      category: categoryName,
      source: 'fallback-error',
      total: fallbackProducts.length,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
