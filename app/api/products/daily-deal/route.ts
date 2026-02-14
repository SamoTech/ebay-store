import { NextResponse } from 'next/server';
import { featuredProducts } from '../../../../lib/products';
import {
  getEbayIntegrationStatus,
  mapEbayItemToProduct,
  searchEbayProducts,
} from '../../../../lib/ebay-api';

export const revalidate = 3600; // 1 hour

// Daily rotating search queries for variety
const dealQueries = [
  'electronics trending deals discount',
  'gaming console playstation xbox deals',
  'nike jordan sneakers limited',
  'apple macbook iphone deals',
  'smart home alexa echo discount',
  'beauty dyson trending deals',
  'collectibles pokemon cards rare',
];

// Get query based on day of year
function getDailyQuery(): string {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  
  return dealQueries[dayOfYear % dealQueries.length];
}

// Get deal index based on day of year
function getDealIndex(totalDeals: number): number {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  
  return dayOfYear % totalDeals;
}

export async function GET() {
  const integration = getEbayIntegrationStatus();

  // Select deal from featured products (with original prices = discounts)
  const dealsWithDiscounts = featuredProducts.filter(p => p.originalPrice && p.originalPrice > p.price);
  const dealIndex = getDealIndex(dealsWithDiscounts.length);
  const staticDeal = dealsWithDiscounts[dealIndex];

  // If API disabled, return static featured product
  if (integration.mode === 'disabled') {
    return NextResponse.json({
      source: 'static',
      deal: staticDeal,
      rotatesAt: 'midnight',
    });
  }

  try {
    // Fetch products with today's query
    const query = getDailyQuery();
    const data = await searchEbayProducts(query, 20);
    const items = data.itemSummaries || [];

    // Map to our product format
    const dealProducts = items
      .map((item, idx) => mapEbayItemToProduct(item, idx + 1000, 'Deal'))
      .filter(Boolean);

    if (dealProducts.length > 0) {
      // Select deal based on day (for consistency throughout the day)
      const selectedDeal = dealProducts[getDealIndex(dealProducts.length)];

      return NextResponse.json({
        source: 'ebay_live',
        deal: selectedDeal,
        rotatesAt: 'midnight',
        totalDealsAvailable: dealProducts.length,
        query,
      });
    }

    // Fallback to static if no products found
    return NextResponse.json({
      source: 'fallback_static',
      deal: staticDeal,
      rotatesAt: 'midnight',
      message: 'No deals found from API; using curated deal',
    });
  } catch (error) {
    console.error('Error fetching daily deal:', error);

    // Fallback to static on error
    return NextResponse.json({
      source: 'fallback_static',
      deal: staticDeal,
      rotatesAt: 'midnight',
      error: 'API error',
    });
  }
}
