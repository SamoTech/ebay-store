import { NextResponse } from 'next/server';
import { allProducts, Product, categories } from '../../../../lib/products';
import {
  getEbayIntegrationStatus,
  searchEbayProducts,
  EBAY_CONFIG,
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
    console.log('🔍 eBay Integration Status:', {
      mode: status.mode,
      apiType: status.apiType,
      hasClientId: !!EBAY_CONFIG.clientId,
      hasClientSecret: !!EBAY_CONFIG.clientSecret,
      clientIdLength: EBAY_CONFIG.clientId?.length || 0,
      missing: status.missing,
    });

    // Use eBay API if configured (Browse API with OAuth)
    if (status.mode !== 'disabled') {
      console.log('🔍 Fetching fresh products from eBay Browse API...');

      // Use rotating keyword based on day of week
      const dayOfWeek = new Date().getDay();
      const keyword = DAILY_KEYWORDS[dayOfWeek];
      
      console.log(`📅 Day ${dayOfWeek} - Searching for: "${keyword}"`);

      try {
        // Fetch from eBay (will use Browse API with OAuth)
        const products = await searchEbayProducts(keyword, 20);

        console.log(`📦 searchEbayProducts returned ${products.length} products`);

        if (products.length > 0) {
          console.log(`✅ Successfully fetched ${products.length} live products from eBay`);
          console.log(`📝 Sample product: ${products[0]?.title}`);
          
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

        console.error('❌ eBay API returned 0 products - this should not happen with valid credentials');
        console.error('🔍 Check Vercel Function Logs for OAuth token errors');
        
        // Return error instead of fallback
        return NextResponse.json(
          {
            error: 'eBay API returned no products',
            source: 'error',
            details: {
              keyword,
              status: status.mode,
              message: 'OAuth may have failed or API rate limit reached',
            },
            products: [],
            total: 0,
          },
          { status: 503 }
        );
      } catch (apiError) {
        console.error('❌ searchEbayProducts threw error:', apiError);
        
        if (apiError instanceof Error) {
          console.error('Error name:', apiError.name);
          console.error('Error message:', apiError.message);
          console.error('Error stack:', apiError.stack);
        }
        
        // Return cached if available, even if expired
        if (productCache) {
          console.log('⚠️ Using expired cache due to API error');
          return NextResponse.json({
            products: productCache,
            source: 'ebay_cached_expired',
            total: productCache.length,
            warning: 'Using cached data due to API error',
          });
        }
        
        // Return error without static fallback
        return NextResponse.json(
          {
            error: 'Failed to fetch from eBay API',
            source: 'error',
            details: {
              message: apiError instanceof Error ? apiError.message : 'Unknown error',
            },
            products: [],
            total: 0,
          },
          { status: 503 }
        );
      }
    }

    // API disabled - return configuration error
    console.error('❌ eBay API is DISABLED');
    console.error('Missing credentials:', status.missing);
    
    return NextResponse.json(
      {
        error: 'eBay API not configured',
        source: 'error',
        details: {
          missing: status.missing,
          message: 'Set EBAY_CLIENT_ID and EBAY_CLIENT_SECRET environment variables',
        },
        products: [],
        total: 0,
      },
      { status: 503 }
    );
  } catch (error) {
    console.error('❌ Fatal error in discover endpoint:', error);

    // Return cached if available, even if expired
    if (productCache) {
      console.log('⚠️ Using expired cache due to fatal error');
      return NextResponse.json({
        products: productCache,
        source: 'ebay_cached_expired',
        total: productCache.length,
      });
    }

    // Return error without static fallback
    return NextResponse.json(
      {
        error: 'Server error',
        source: 'error',
        details: {
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        products: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}
