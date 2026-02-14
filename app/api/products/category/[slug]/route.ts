import { NextResponse } from 'next/server';
import { allProducts, categories } from '../../../../../lib/products';
import {
  getEbayIntegrationStatus,
  mapEbayItemToProduct,
  searchEbayProducts,
} from '../../../../../lib/ebay-api';

// Category-specific search queries mapped by slug
const categoryQueryMap: Record<string, { query: string; categoryName: string }> = {
  'electronics': { 
    query: 'electronics laptop smartphone tablet trending', 
    categoryName: 'Electronics' 
  },
  'gaming': { 
    query: 'gaming console playstation xbox nintendo switch', 
    categoryName: 'Gaming' 
  },
  'sneakers': { 
    query: 'sneakers nike jordan adidas running shoes', 
    categoryName: 'Sneakers' 
  },
  'smart-home': { 
    query: 'smart home alexa echo nest devices', 
    categoryName: 'Smart Home' 
  },
  'beauty': { 
    query: 'beauty cosmetics skincare makeup trending', 
    categoryName: 'Beauty' 
  },
  'collectibles': { 
    query: 'collectibles cards funko vintage rare', 
    categoryName: 'Collectibles' 
  },
  'home': { 
    query: 'home kitchen appliances cookware furniture', 
    categoryName: 'Home' 
  },
  'fitness': { 
    query: 'fitness equipment yoga weights exercise', 
    categoryName: 'Fitness' 
  },
  'pet-supplies': { 
    query: 'pet supplies dog cat food toys', 
    categoryName: 'Pet Supplies' 
  },
  'baby': { 
    query: 'baby stroller car seat monitor essentials', 
    categoryName: 'Baby' 
  },
  'auto': { 
    query: 'auto car accessories dash cam tools', 
    categoryName: 'Auto' 
  },
  'office': { 
    query: 'office desk chair keyboard monitor supplies', 
    categoryName: 'Office' 
  },
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

  // Get the exact category name for this slug
  const categoryInfo = categoryQueryMap[slug];
  const categoryName = categoryInfo?.categoryName || category.name;

  // Get static products for this category as fallback
  const staticProducts = allProducts.filter(p => p.category === categoryName);

  // If API is not configured or category is 'all', return static
  if (integration.mode === 'disabled' || slug === 'all') {
    return NextResponse.json({
      source: 'static',
      category: categoryName,
      products: slug === 'all' ? allProducts : staticProducts,
      total: slug === 'all' ? allProducts.length : staticProducts.length,
    });
  }

  try {
    // Get search query for this category
    const query = categoryInfo?.query || category.name;
    
    // Fetch up to 20 products for category pages
    const data = await searchEbayProducts(query, 20);
    const items = data.itemSummaries || [];

    const liveProducts = items
      .map((item, idx) => mapEbayItemToProduct(item, idx + 1, categoryName))
      .filter(Boolean);

    if (liveProducts.length > 0) {
      return NextResponse.json({
        source: 'ebay_live',
        category: categoryName,
        products: liveProducts,
        total: liveProducts.length,
        totalAvailable: data.total || 0,
      });
    }

    // Fall back to static if no products
    return NextResponse.json({
      source: 'fallback_static',
      category: categoryName,
      products: staticProducts,
      total: staticProducts.length,
      message: 'No live products available; using static fallback.',
    });
  } catch (error) {
    // Fall back to static on error
    return NextResponse.json({
      source: 'fallback_static',
      category: categoryName,
      products: staticProducts,
      total: staticProducts.length,
      error: 'Failed to fetch live products',
      detail: error instanceof Error ? error.message : 'unknown_error',
    });
  }
}
