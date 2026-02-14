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

export async function GET() {
  const integration = getEbayIntegrationStatus();

  // If API disabled, return featured product based on day
  if (integration.mode === 'disabled') {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / 86400000);
    const dealIndex = dayOfYear % featuredProducts.length;

    return NextResponse.json({
      source: 'static',
      deal: featuredProducts[dealIndex],
      rotatesAt: 'midnight',
    });
  }

  try {
    // Fetch products with today's query
    const query = getDailyQuery();
    const data = await searchEbayProducts(query, 20);
    const items = data.itemSummaries || [];

    // Filter for items with discounts (have original price)
    const discountedItems = items.filter(item => {
      const hasDiscount = item.marketingPrice?.originalPrice?.value && 
                         item.price?.value &&
                         item.marketingPrice.originalPrice.value > item.price.value;
      
      if (!hasDiscount) return false;
      
      // Calculate discount percentage
      const discount = ((item.marketingPrice!.originalPrice!.value - item.price!.value) / 
                       item.marketingPrice!.originalPrice!.value) * 100;
      
      // Only include items with 20%+ discount
      return discount >= 20;
    });

    // Map to our product format
    const dealProducts = discountedItems
      .map((item, idx) => mapEbayItemToProduct(item, idx + 1, 'Deal'))
      .filter(Boolean);

    if (dealProducts.length > 0) {
      // Select deal based on day (for consistency throughout the day)
      const today = new Date();
      const start = new Date(today.getFullYear(), 0, 0);
      const diff = today.getTime() - start.getTime();
      const dayOfYear = Math.floor(diff / 86400000);
      const selectedDeal = dealProducts[dayOfYear % dealProducts.length];

      return NextResponse.json({
        source: 'ebay_live',
        deal: selectedDeal,
        rotatesAt: 'midnight',
        totalDealsAvailable: dealProducts.length,
        query,
      });
    }

    // Fallback to static if no good deals found
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / 86400000);
    const dealIndex = dayOfYear % featuredProducts.length;

    return NextResponse.json({
      source: 'fallback_static',
      deal: featuredProducts[dealIndex],
      rotatesAt: 'midnight',
      message: 'No high-discount deals found; using curated deal',
    });
  } catch (error) {
    console.error('Error fetching daily deal:', error);

    // Fallback to static on error
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / 86400000);
    const dealIndex = dayOfYear % featuredProducts.length;

    return NextResponse.json({
      source: 'fallback_static',
      deal: featuredProducts[dealIndex],
      rotatesAt: 'midnight',
      error: 'API error',
    });
  }
}
