import { NextResponse } from 'next/server';
import {
  getEbayIntegrationStatus,
  searchEbayProducts,
} from '../../../../lib/ebay-api';
import { allProducts } from '../../../../lib/products';

// Force dynamic rendering - required for runtime environment variables
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const limit = parseInt(searchParams.get('limit') || '12', 10);

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required', products: [] },
      { status: 400 }
    );
  }

  try {
    const status = getEbayIntegrationStatus();
    console.log(`🔍 Search query: "${query}" - eBay Status:`, status.mode);

    // Use eBay API if configured
    if (status.mode !== 'disabled') {
      console.log(`🔍 Searching eBay API for: "${query}"`);
      
      const products = await searchEbayProducts(query, limit);

      if (products.length > 0) {
        console.log(`✅ Found ${products.length} eBay products for "${query}"`);
        return NextResponse.json({
          products,
          query,
          source: 'ebay-api',
          total: products.length,
        });
      }

      console.warn(`⚠️ No eBay results for "${query}", using fallback`);
    } else {
      console.warn('⚠️ eBay API disabled, using fallback search');
    }

    // Fallback to static products
    const fallbackProducts = allProducts.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );

    return NextResponse.json({
      products: fallbackProducts.slice(0, limit),
      query,
      source: 'fallback',
      total: fallbackProducts.length,
    });
  } catch (error) {
    console.error(`❌ Error searching for "${query}":`, error);

    const fallbackProducts = allProducts.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );

    return NextResponse.json({
      products: fallbackProducts.slice(0, limit),
      query,
      source: 'fallback-error',
      total: fallbackProducts.length,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
