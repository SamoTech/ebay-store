import { NextResponse } from 'next/server';
import { allProducts, Product, categories } from '../../../../lib/products';
import {
  getEbayIntegrationStatus,
  searchEbayProducts,
} from '../../../../lib/ebay-api';

// Force dynamic rendering - required for runtime environment variables
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Rotating daily categories for variety
const DAILY_KEYWORDS = [
  'electronics bluetooth wireless',     // Sunday
  'gaming console accessories',         // Monday  
  'smart home devices',                 // Tuesday
  'nike adidas sneakers shoes',        // Wednesday
  'kitchen appliances gadgets',        // Thursday
  'laptop macbook accessories',        // Friday
  'headphones earbuds audio',          // Saturday
];

export async function GET() {
  try {
    const status = getEbayIntegrationStatus();
    console.log('🔍 eBay Integration Status:', JSON.stringify(status));

    // Use eBay API if configured
    if (status.mode !== 'disabled') {
      console.log('🔍 Discovering products from eBay API...');

      // Use rotating keyword based on day of week
      const dayOfWeek = new Date().getDay();
      const keyword = DAILY_KEYWORDS[dayOfWeek];
      
      console.log(`📅 Today's discovery keyword: "${keyword}"`);

      // Single optimized search - much faster than multiple parallel calls
      const products = await searchEbayProducts(keyword, 20);

      if (products.length > 0) {
        console.log(`✅ Found ${products.length} live eBay products`);
        
        // Shuffle for variety
        const shuffled = products.sort(() => Math.random() - 0.5);

        return NextResponse.json({
          products: shuffled,
          source: 'ebay_live',
          total: shuffled.length,
          keyword,
        });
      }

      console.warn('⚠️ eBay API returned 0 products, using fallback');
    } else {
      console.warn('⚠️ eBay API disabled - missing credentials:', status.missing);
    }

    // Fallback: Return shuffled static products
    console.log('⚠️ Using fallback discover products');
    const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
    const limited = shuffled.slice(0, 20);

    return NextResponse.json({
      products: limited,
      source: 'fallback',
      total: limited.length,
      categories: categories.map((c) => c.name),
    });
  } catch (error) {
    console.error('❌ Error in discover endpoint:', error);

    const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
    const limited = shuffled.slice(0, 20);

    return NextResponse.json({
      products: limited,
      source: 'fallback-error',
      total: limited.length,
    });
  }
}
