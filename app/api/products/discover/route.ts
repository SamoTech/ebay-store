import { NextResponse } from 'next/server';
import { allProducts, Product, categories } from '../../../../lib/products';
import {
  getEbayIntegrationStatus,
  mapEbayItemToProduct,
  searchEbayProducts,
} from '../../../../lib/ebay-api';

// Optimized category queries with better keywords
const categoryQueries: Array<{ category: string; query: string }> = [
  { category: 'Electronics', query: 'electronics laptop smartphone tablet trending' },
  { category: 'Gaming', query: 'gaming console playstation xbox nintendo switch' },
  { category: 'Sneakers', query: 'sneakers nike jordan adidas running shoes' },
  { category: 'Smart Home', query: 'smart home alexa echo nest devices' },
  { category: 'Beauty', query: 'beauty cosmetics skincare makeup trending' },
  { category: 'Collectibles', query: 'collectibles cards funko vintage rare' },
  { category: 'Home', query: 'home kitchen appliances cookware furniture' },
  { category: 'Fitness', query: 'fitness equipment yoga weights exercise' },
  { category: 'Pet Supplies', query: 'pet supplies dog cat food toys' },
  { category: 'Baby', query: 'baby stroller car seat monitor essentials' },
  { category: 'Auto', query: 'auto car accessories dash cam tools' },
  { category: 'Office', query: 'office desk chair keyboard monitor supplies' },
];

export async function GET() {
  const integration = getEbayIntegrationStatus();

  // If API is not configured, return static products immediately
  if (integration.mode === 'disabled') {
    return NextResponse.json({
      source: 'fallback_static',
      products: allProducts,
      message: 'eBay API not configured; using static catalog.',
      integration,
    });
  }

  try {
    // Fetch 10 products per category for better variety
    const perCategoryLimit = 10;

    // Fetch products from all categories in parallel
    const categoryResults = await Promise.all(
      categoryQueries.map(async (entry, idx) => {
        try {
          const data = await searchEbayProducts(entry.query, perCategoryLimit);
          const items = data.itemSummaries || [];

          return items
            .map((item, itemIdx) =>
              mapEbayItemToProduct(
                item,
                idx * 1000 + itemIdx + 1,
                entry.category
              )
            )
            .filter((item): item is Product => Boolean(item));
        } catch (error) {
          // If one category fails, return empty array for that category
          console.error(`Failed to fetch ${entry.category}:`, error);
          return [];
        }
      })
    );

    const liveProducts = categoryResults.flat();

    // If we got at least some products from API, use them
    if (liveProducts.length > 0) {
      return NextResponse.json({
        source: 'ebay_live',
        products: liveProducts,
        total: liveProducts.length,
        categoriesLoaded: categoryResults.filter(r => r.length > 0).length,
        integration,
      });
    }

    // If no products returned, fall back to static
    return NextResponse.json({
      source: 'fallback_static',
      products: allProducts,
      message: 'No live products returned from eBay; using static catalog fallback.',
      integration,
    });
  } catch (error) {
    // On any error, fall back to static products
    return NextResponse.json({
      source: 'fallback_static',
      products: allProducts,
      error: 'Failed to fetch live eBay products; using static fallback.',
      integration,
      detail: error instanceof Error ? error.message : 'unknown_error',
    });
  }
}
