import { NextRequest, NextResponse } from 'next/server';
import { getEbayProducts, getTrendingProducts } from '@/lib/ebay';

export const dynamic = 'force-dynamic';

/**
 * eBay Product Search API Endpoint
 * GET /api/ebay/search?q=laptop
 * GET /api/ebay/search?trending=true
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const trending = searchParams.get('trending') === 'true';
    const limit = parseInt(searchParams.get('limit') || '12');

    let products;

    if (trending) {
      // Get today's trending products
      products = await getTrendingProducts();
    } else if (query) {
      // Search by keyword
      products = await getEbayProducts(query, limit);
    } else {
      return NextResponse.json(
        { error: 'Please provide ?q=keyword or ?trending=true' },
        { status: 400 }
      );
    }

    // Transform eBay response to our format
    const formattedProducts = products.map((item: any, index: number) => ({
      id: 1000 + index, // High ID to distinguish from static products
      title: item.title?.[0] || 'No title',
      price: parseFloat(item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ || '0'),
      currency: item.sellingStatus?.[0]?.currentPrice?.[0]?.['@currencyId'] || 'USD',
      image: item.galleryURL?.[0] || item.pictureURLLarge?.[0] || '',
      category: item.primaryCategory?.[0]?.categoryName?.[0] || 'General',
      affiliateLink: item.viewItemURL?.[0] || '#',
      description: item.subtitle?.[0] || item.title?.[0] || '',
      condition: item.condition?.[0]?.conditionDisplayName?.[0] || 'Unknown',
      itemId: item.itemId?.[0] || '',
      shipping: item.shippingInfo?.[0]?.shippingServiceCost?.[0]?.__value__ || 'N/A'
    }));

    return NextResponse.json({
      success: true,
      count: formattedProducts.length,
      query: query || 'trending',
      products: formattedProducts
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });

  } catch (error) {
    console.error('❌ eBay API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from eBay', details: (error as Error).message },
      { status: 500 }
    );
  }
}
