import { NextResponse } from 'next/server';
import { allProducts, categories } from '../../../../../lib/products';
import {
  getEbayIntegrationStatus,
  searchEbayProducts,
} from '../../../../../lib/ebay-api';

// Category-specific search queries mapped by slug
const categoryQueryMap: Record<string, { query: string; categoryName: string }> = {
  electronics: { query: 'electronics', categoryName: 'Electronics' },
  gaming: { query: 'gaming console', categoryName: 'Gaming' },
  'smart-home': { query: 'smart home', categoryName: 'Smart Home' },
  sneakers: { query: 'sneakers', categoryName: 'Sneakers' },
  'home-kitchen': { query: 'kitchen appliances', categoryName: 'Home & Kitchen' },
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
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

    // Use eBay API if configured
    if (status.mode !== 'disabled') {
      console.log(`🔍 Fetching ${categoryName} from eBay...`);
      
      // searchEbayProducts returns Product[] already mapped
      const products = await searchEbayProducts(query, 20);

      if (products.length > 0) {
        return NextResponse.json({
          products,
          category: categoryName,
          source: 'ebay-api',
          total: products.length,
        });
      }
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
