import { NextRequest, NextResponse } from 'next/server';
import { allProducts, Product } from '../../../../lib/products';
import {
  getEbayIntegrationStatus,
  searchEbayProducts,
  EBAY_CONFIG,
} from '../../../../lib/ebay-api';
import { getIdentifier, rateLimit } from '../../../../lib/rate-limit';

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

export async function GET(request: NextRequest) {
  const identifier = `products-discover:${getIdentifier(request)}`;
  const rateLimitResult = rateLimit(identifier, 60, 60 * 1000);

  if (!rateLimitResult.success) {
    const retryAfter = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000);

    return NextResponse.json(
      { error: 'Too many requests. Please try again later.', success: false, retryAfter },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
        },
      }
    );
  }

  try {
    const now = Date.now();
    const staticFallback = {
      products: allProducts,
      source: 'fallback_static',
      total: allProducts.length,
    };
    
    // Return cached products if still valid
    if (productCache && now < cacheExpiry) {
      console.log('✅ Serving cached eBay products');
      return NextResponse.json({
        products: productCache,
        source: 'ebay_cached',
        total: productCache.length,
        expiresIn: Math.round((cacheExpiry - now) / 1000 / 60), // minutes
      }, {
        headers: {
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
        }
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
          
          // Shuffle for variety (without mutating cache)
          const shuffled = [...products].sort(() => Math.random() - 0.5);

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
        
        // Use static fallback so homepage still shows products
        return NextResponse.json({
          ...staticFallback,
          warning: 'eBay API returned no products, serving static fallback catalog',
          details: {
            keyword,
            status: status.mode,
            message: 'OAuth may have failed or API rate limit reached',
          },
        });
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
        
        // Fall back to static catalog so homepage keeps working
        return NextResponse.json({
          ...staticFallback,
          warning: 'Using static fallback catalog due to eBay API error',
          details: {
            message: apiError instanceof Error ? apiError.message : 'Unknown error',
          },
        });
      }
    }

    // API disabled - return static fallback catalog
    console.error('❌ eBay API is DISABLED');
    console.error('Missing credentials:', status.missing);

    return NextResponse.json({
      ...staticFallback,
      warning: 'eBay API not configured, serving static fallback catalog',
      details: {
        missing: status.missing,
        message: 'Set EBAY_CLIENT_ID and EBAY_CLIENT_SECRET environment variables',
      },
    });
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

    // Always return fallback catalog to avoid empty homepage
    return NextResponse.json({
      products: allProducts,
      source: 'fallback_static',
      total: allProducts.length,
      warning: 'Serving static fallback catalog due to server error',
      details: {
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}
