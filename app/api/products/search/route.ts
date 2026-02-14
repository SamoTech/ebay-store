import { NextRequest, NextResponse } from 'next/server';
import { Product } from '../../../../lib/products';
import { mapEbayItemToProduct, searchEbayProducts } from '../../../../lib/ebay-api';

function normalizeCategory(categoryRaw: string | null): string {
  if (!categoryRaw) return 'General';

  return categoryRaw
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');
  const category = normalizeCategory(request.nextUrl.searchParams.get('category'));

  if (!query) {
    return NextResponse.json({ error: 'Missing q parameter' }, { status: 400 });
  }

  try {
    const data = await searchEbayProducts(query);

    const products = (data.itemSummaries || [])
      .map((item, index) =>
        mapEbayItemToProduct(item, index + 1, category)
      )
      .filter((item): item is Product => Boolean(item));

    return NextResponse.json({
      source: 'ebay_search',
      query,
      category,
      total: products.length,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products', detail: String(error) },
      { status: 500 }
    );
  }
}
