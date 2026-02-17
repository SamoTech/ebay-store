import { NextResponse } from 'next/server';
import { allProducts, Product, categories } from '../../../../lib/products';
import {
  getEbayIntegrationStatus,
  searchEbayProducts,
} from '../../../../lib/ebay-api';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Cache for 24 hours at the route level
export const revalidate = 86400;

// In-memory cache for eBay products
let productCache: Product[] | null = null;
let cacheExpiry = 0;

// Rotating daily keywords for variety
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
    const now = Date.now();
    
    // Return cached products if still valid
    if (productCache && now < cacheExpiry) {
      console.log('✅ Serving cached eBay products');
      return NextResponse.json({
        products: productCache,
        source: 'ebay_cached',
        total: productCache.length,
        expiresIn: Math.round((cacheExpiry - now) / 1000 / 60), // minutes
      });
    }

    const status = getEbayIntegrationStatus();
    console.log('🔍 eBay Status:', status.mode, status.apiType);

    // Use eBay API if configured (Browse API with OAuth)
    if (status.mode !== 'disabled') {
      console.log('🔍 Fetching fresh products from eBay...');

      // Use rotating keyword based on day of week
      const dayOfWeek = new Date().getDay();
      const keyword = DAILY_KEYWORDS[dayOfWeek];
      
      console.log(`📅 Today's keyword: "${keyword}"`);

      // Fetch from eBay (will use Browse API with OAuth)
      const products = await searchEbayProducts(keyword, 20);

      if (products.length > 0) {
        console.log(`✅ Got ${products.length} products from eBay`);
        
        // Cache for 24 hours
        productCache = products;
        cacheExpiry = now + (24 * 60 * 60 * 1000);
        
        // Shuffle for variety
        const shuffled = products.sort(() => Math.random() - 0.5);

        return NextResponse.json({
          products: shuffled,
          source: 'ebay_live',
          total: shuffled.length,
          keyword,
          cachedUntil: new Date(cacheExpiry).toISOString(),
        });
      }

      console.warn('⚠️ eBay API returned 0 products');
    } else {
      console.warn('⚠️ eBay API disabled:', status.missing);
    }

    // Fallback: Return shuffled static products
    console.log('⚠️ Using fallback products');
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

    // Return cached if available, even if expired
    if (productCache) {
      console.log('⚠️ Using expired cache due to error');
      return NextResponse.json({
        products: productCache,
        source: 'ebay_cached_expired',
        total: productCache.length,
      });
    }

    // Final fallback
    const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
    const limited = shuffled.slice(0, 20);

    return NextResponse.json({
      products: limited,
      source: 'fallback-error',
      total: limited.length,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
