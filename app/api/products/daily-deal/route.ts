import { NextResponse } from 'next/server';
import { featuredProducts } from '../../../../lib/products';
import {
  getEbayIntegrationStatus,
  searchEbayProducts,
} from '../../../../lib/ebay-api';

export const revalidate = 3600; // 1 hour

/**
 * Get daily deal - rotates featured products or fetches trending from eBay
 */
export async function GET() {
  try {
    const status = getEbayIntegrationStatus();

    // Use eBay API if available
    if (status.mode !== 'disabled') {
      const dayOfWeek = new Date().getDay();
      const trendingKeywords = [
        'iPhone 15 Pro',
        'PlayStation 5',
        'Nike Air Jordan',
        'MacBook Pro M3',
        'Samsung Galaxy S24',
        'Nintendo Switch OLED',
        'Apple Watch Series 9',
      ];

      const keyword = trendingKeywords[dayOfWeek];
      console.log(`📅 Daily deal keyword: ${keyword}`);

      // searchEbayProducts returns Product[] already mapped
      const products = await searchEbayProducts(keyword, 1);

      if (products.length > 0) {
        const deal = products[0];
        return NextResponse.json({
          deal,
          source: 'ebay-api',
          keyword,
        });
      }
    }

    // Fallback to featured products
    const randomIndex = Math.floor(Math.random() * featuredProducts.length);
    const deal = featuredProducts[randomIndex];

    return NextResponse.json({
      deal,
      source: 'fallback',
    });
  } catch (error) {
    console.error('❌ Error fetching daily deal:', error);

    const randomIndex = Math.floor(Math.random() * featuredProducts.length);
    const deal = featuredProducts[randomIndex];

    return NextResponse.json({
      deal,
      source: 'fallback-error',
    });
  }
}
