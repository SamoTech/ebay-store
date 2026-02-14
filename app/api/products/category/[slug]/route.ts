import { NextResponse } from 'next/server';
import { allProducts, categories } from '../../../../../lib/products';
import {
  getEbayIntegrationStatus,
  mapEbayItemToProduct,
  searchEbayProducts,
} from '../../../../../lib/ebay-api';

// Category-specific search queries
const categoryQueryMap: Record<string, string> = {
  'electronics': 'electronics laptop smartphone tablet trending',
  'gaming': 'gaming console playstation xbox nintendo switch',
  'sneakers': 'sneakers nike jordan adidas running shoes',
  'smart-home': 'smart home alexa echo nest devices',
  'beauty': 'beauty cosmetics skincare makeup trending',
  'collectibles': 'collectibles cards funko vintage rare',
  'home': 'home kitchen appliances cookware furniture',
  'fitness': 'fitness equipment yoga weights exercise',
  'pet-supplies': 'pet supplies dog cat food toys',
  'baby': 'baby stroller car seat monitor essentials',
  'auto': 'auto car accessories dash cam tools',
  'office': 'office desk chair keyboard monitor supplies',
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const integration = getEbayIntegrationStatus();

  // Find category by slug
  const category = categories.find(c => c.slug === slug);
  
  if (!category) {
    return NextResponse.json(
      { error: 'Category not found' },
      { status: 404 }
    );
  }

  // Get static products for this category as fallback
  const staticProducts = allProducts.filter(p => p.category === category.name);

  // If API is not configured or category is 'all', return static
  if (integration.mode === 'disabled' || slug === 'all') {
    return NextResponse.json({
      source: 'static',
      category: category.name,
      products: slug === 'all' ? allProducts : staticProducts,
      total: slug === 'all' ? allProducts.length : staticProducts.length,
    });
  }

  try {
    // Get search query for this category
    const query = categoryQueryMap[slug] || category.name;
    
    // Fetch up to 20 products for category pages
    const data = await searchEbayProducts(query, 20);
    const items = data.itemSummaries || [];

    const liveProducts = items
      .map((item, idx) => mapEbayItemToProduct(item, idx + 1, category.name))
      .filter(Boolean);

    if (liveProducts.length > 0) {
      return NextResponse.json({
        source: 'ebay_live',
        category: category.name,
        products: liveProducts,
        total: liveProducts.length,
        totalAvailable: data.total || 0,
      });
    }

    // Fall back to static if no products
    return NextResponse.json({
      source: 'fallback_static',
      category: category.name,
      products: staticProducts,
      total: staticProducts.length,
      message: 'No live products available; using static fallback.',
    });
  } catch (error) {
    // Fall back to static on error
    return NextResponse.json({
      source: 'fallback_static',
      category: category.name,
      products: staticProducts,
      total: staticProducts.length,
      error: 'Failed to fetch live products',
      detail: error instanceof Error ? error.message : 'unknown_error',
    });
  }
}
