import { NextResponse } from 'next/server';
import { allProducts, Product, categories } from '../../../../lib/products';
import {
  getEbayIntegrationStatus,
  searchEbayFindingAPI,
} from '../../../../lib/ebay-api';

// Force dynamic rendering - required for runtime environment variables
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Rotating daily categories for variety
const DAILY_KEYWORDS = [
  'electronics bluetooth',     // Sunday
  'gaming console',            // Monday  
  'smart home',                // Tuesday
  'nike sneakers',             // Wednesday
  'kitchen appliances',        // Thursday
  'laptop accessories',        // Friday
  'wireless headphones',       // Saturday
];

export async function GET() {
  try {
    const status = getEbayIntegrationStatus();
    console.log('🔍 eBay Status:', status.mode);

    // Use Finding API directly (no OAuth, faster)
    if (status.mode !== 'disabled') {
      const dayOfWeek = new Date().getDay();
      const keyword = DAILY_KEYWORDS[dayOfWeek];
      
      console.log(`🔍 Searching eBay: "${keyword}"`);

      // Use Finding API directly - fast and reliable
      const ebayItems = await searchEbayFindingAPI(keyword, 20);

      if (ebayItems.length > 0) {
        // Map to Product format
        const products: Product[] = ebayItems.map((item, index) => ({
          id: index + 1000,
          title: item.title,
          price: parseFloat(item.price),
          currency: 'USD',
          image: item.image,
          category: 'eBay',
          affiliateLink: item.viewItemURL || `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(item.title)}`,
          description: `${item.condition || 'New'} - Live from eBay`,
        }));

        console.log(`✅ Found ${products.length} eBay products`);

        return NextResponse.json({
          products,
          source: 'ebay_live',
          total: products.length,
          keyword,
        });
      }

      console.warn('⚠️ No eBay results');
    }

    // Fallback
    console.log('⚠️ Using static fallback');
    const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
    const limited = shuffled.slice(0, 20);

    return NextResponse.json({
      products: limited,
      source: 'fallback',
      total: limited.length,
    });
  } catch (error) {
    console.error('❌ Error:', error);

    const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
    const limited = shuffled.slice(0, 20);

    return NextResponse.json({
      products: limited,
      source: 'fallback-error',
      total: limited.length,
    });
  }
}
