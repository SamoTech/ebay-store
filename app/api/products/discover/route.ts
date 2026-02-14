import { NextResponse } from 'next/server';
import { allProducts, Product } from '../../../../lib/products';
import { mapEbayItemToProduct, searchEbayProducts } from '../../../../lib/ebay-api';

const categoryQueries: Array<{ category: string; query: string }> = [
  { category: 'Electronics', query: 'best seller electronics' },
  { category: 'Gaming', query: 'gaming console accessories' },
  { category: 'Sneakers', query: 'popular sneakers' },
  { category: 'Smart Home', query: 'smart home devices' },
  { category: 'Beauty', query: 'beauty tech gadgets' },
  { category: 'Collectibles', query: 'collectible trending items' },
];

export async function GET() {
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
      });
    }

    return NextResponse.json({
      source: 'ebay_live',
      products: liveProducts,
      total: liveProducts.length,
    });
  } catch (error) {
    return NextResponse.json({
      source: 'fallback_static',
      products: allProducts,
      error: 'Failed to fetch live eBay products; using static fallback.',
      detail: String(error),
    });
  }
}
