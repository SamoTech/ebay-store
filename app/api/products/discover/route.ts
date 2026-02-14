import { NextResponse } from 'next/server';
import { allProducts, Product, categories } from '../../../../lib/products';
import {
  getEbayIntegrationStatus,
  mapEbayItemToProduct,
  searchEbayProducts,
} from '../../../../lib/ebay-api';

// Optimized category queries with better keywords
const categoryQueries: Array<{ category: string; query: string }> = [
  // Electronics split into multiple queries for better results
  { category: 'Electronics', query: 'laptop MacBook Dell HP Lenovo' },
  { category: 'Electronics', query: 'smartphone iPhone Samsung Galaxy' },
  { category: 'Electronics', query: 'tablet iPad Android Surface' },
  { category: 'Electronics', query: 'headphones AirPods Sony Bose wireless' },
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
    // Fetch 5 products per query for variety
    const perQueryLimit = 5;

    // Fetch products from all queries in parallel
    const queryResults = await Promise.allSettled(
      categoryQueries.map(async (entry, idx) => {
        try {
          const data = await searchEbayProducts(entry.query, perQueryLimit);
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
          console.error(`Failed to fetch ${entry.category} (${entry.query}):`, error);
          return [];
        }
      })
    );

    // Extract successful results
    const liveProducts = queryResults
      .filter((result): result is PromiseFulfilledResult<Product[]> => result.status === 'fulfilled')
      .flatMap(result => result.value);

    // Group by category to check coverage
    const categoryCoverage = new Map<string, number>();
    liveProducts.forEach(product => {
      categoryCoverage.set(
        product.category,
        (categoryCoverage.get(product.category) || 0) + 1
      );
    });

    // Add static products for categories with 0 live products
    const categoriesWithProducts = new Set(categoryCoverage.keys());
    const allCategories = Array.from(new Set(categoryQueries.map(q => q.category)));
    
    const fallbackProducts: Product[] = [];
    allCategories.forEach(category => {
      if (!categoriesWithProducts.has(category) || (categoryCoverage.get(category) || 0) < 3) {
        // Add static products for this category
        const staticForCategory = allProducts
          .filter(p => p.category === category)
          .slice(0, 5);
        fallbackProducts.push(...staticForCategory);
      }
    });

    const finalProducts = [...liveProducts, ...fallbackProducts];

    // If we got at least some products, return them
    if (finalProducts.length > 0) {
      return NextResponse.json({
        source: liveProducts.length > 0 ? 'ebay_live_with_fallback' : 'fallback_static',
        products: finalProducts,
        total: finalProducts.length,
        liveCount: liveProducts.length,
        fallbackCount: fallbackProducts.length,
        categoryCoverage: Object.fromEntries(categoryCoverage),
        integration,
      });
    }

    // If no products at all, return all static products
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
