import { searchEbayProducts, mapBrowseItemToProduct, getEbayIntegrationStatus } from '@/lib/ebay-api';
import { NextResponse } from 'next/server';

/**
 * GET /api/ebay-test
 * 
 * Test eBay API integration by fetching sample products
 * Verifies that credentials are working correctly
 * 
 * Example response:
 * {
 *   "success": true,
 *   "status": { "mode": "client_credentials", ... },
 *   "test": {
 *     "query": "electronics",
 *     "productsFound": 5,
 *     "sampleProduct": { ... }
 *   }
 * }
 */
export async function GET() {
  try {
    // Check integration status
    const status = getEbayIntegrationStatus();
    
    if (status.mode === 'disabled') {
      return NextResponse.json(
        {
          success: false,
          status,
          error: 'eBay API is not configured',
          message: `Missing environment variables: ${status.missing.join(', ')}`,
        },
        { status: 400 }
      );
    }
    
    // Try to fetch sample products (returns Product[] already mapped)
    const testQuery = 'electronics';
    const products = await searchEbayProducts(testQuery, 5);
    
    if (!products || products.length === 0) {
      return NextResponse.json(
        {
          success: false,
          status,
          error: 'No products returned',
          message: 'API credentials may be invalid or eBay API is unavailable',
        },
        { status: 500 }
      );
    }
    
    // Get sample product (already mapped by searchEbayProducts)
    const sampleProduct = products[0];
    
    // Verify affiliate tracking
    const hasAffiliateTracking = sampleProduct?.affiliateLink.includes('campid=5338903178');
    
    return NextResponse.json({
      success: true,
      status,
      test: {
        query: testQuery,
        productsFound: products.length,
        affiliateTrackingActive: hasAffiliateTracking,
        sampleProduct: {
          title: sampleProduct.title,
          price: sampleProduct.price,
          currency: sampleProduct.currency,
          affiliateLink: sampleProduct.affiliateLink,
          hasCorrectCampaignId: hasAffiliateTracking,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to test eBay API',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      { status: 500 }
    );
  }
}
