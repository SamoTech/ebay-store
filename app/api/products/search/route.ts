import { NextRequest, NextResponse } from 'next/server';
import { Product } from '../../../../lib/products';
import { searchEbayProducts } from '../../../../lib/ebay-api';

function normalizeCategory(categoryRaw: string | null): string {
  if (!categoryRaw) return 'General';
  return categoryRaw.trim() || 'General';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = normalizeCategory(searchParams.get('category'));
    const maxResults = parseInt(searchParams.get('limit') || '20', 10);

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Product search: "${query}" in ${category}`);

    // searchEbayProducts returns Product[] already mapped
    const ebayProducts = await searchEbayProducts(query, maxResults);

    return NextResponse.json({
      products: ebayProducts,
      query,
      category,
      total: ebayProducts.length,
      source: 'ebay-api',
    });
  } catch (error) {
    console.error('❌ Error in /api/products/search:', error);
    return NextResponse.json(
      {
        error: 'Failed to search products',
        products: [],
        query: '',
        category: 'General',
        total: 0,
      },
      { status: 500 }
    );
  }
}
