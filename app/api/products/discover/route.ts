import { NextResponse } from 'next/server';
import { allProducts, Product, categories } from '../../../../lib/products';
import { getEbayIntegrationStatus, mapEbayItemToProduct, searchEbayProducts } from '../../../../lib/ebay-api';

const categoryQueries: Array<{ category: string; query: string }> = categories
  .filter((entry) => entry.slug !== 'all')
  .map((entry) => ({
    category: entry.name,
    query: `best ${entry.name} deals`,
  }));

export async function GET() {
  const integration = getEbayIntegrationStatus();

  try {
    const perCategoryLimit = 8;

    const categoryResults = await Promise.all(
      categoryQueries.map(async (entry, idx) => {
        const data = await searchEbayProducts(entry.query, perCategoryLimit);
        const items = data.itemSummaries || [];

        return items
          .map((item, itemIdx) => mapEbayItemToProduct(item, idx * 1000 + itemIdx + 1, entry.category))
          .filter((item): item is Product => Boolean(item));
      })
    );

    const liveProducts = categoryResults.flat();

    if (liveProducts.length === 0) {
      return NextResponse.json({
        source: 'fallback_static',
        products: allProducts,
        message: 'No eBay credentials or no live products returned; using static catalog fallback.',
        integration,
      });
    }

    return NextResponse.json({
      source: 'ebay_live',
      products: liveProducts,
      total: liveProducts.length,
      integration,
    });
  } catch (error) {
    return NextResponse.json({
      source: 'fallback_static',
      products: allProducts,
      error: 'Failed to fetch live eBay products; using static fallback.',
      integration,
      detail: error instanceof Error ? error.message : 'unknown_error',
    });
  }
}
