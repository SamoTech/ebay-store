import { NextResponse } from 'next/server';
import { searchEbayFindingAPI, EBAY_CONFIG } from '../../../../lib/ebay-api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const startTime = Date.now();
  
  try {
    console.log('🧪 Testing Finding API...');
    console.log('📋 EBAY_APP_ID:', EBAY_CONFIG.appId ? `${EBAY_CONFIG.appId.substring(0, 15)}...` : 'NOT SET');
    
    if (!EBAY_CONFIG.appId) {
      return NextResponse.json({
        success: false,
        error: 'EBAY_APP_ID not configured',
        config: {
          appId: 'NOT SET',
          hasClientId: !!EBAY_CONFIG.clientId,
          hasClientSecret: !!EBAY_CONFIG.clientSecret,
        },
        env: {
          EBAY_APP_ID: process.env.EBAY_APP_ID ? 'SET' : 'NOT SET',
          NEXT_PUBLIC_EBAY_APP_ID: process.env.NEXT_PUBLIC_EBAY_APP_ID ? 'SET' : 'NOT SET',
        }
      });
    }
    
    const keyword = 'wireless headphones';
    console.log(`🔍 Searching for: "${keyword}"`);
    
    const results = await searchEbayFindingAPI(keyword, 5);
    const duration = Date.now() - startTime;
    
    console.log(`✅ Found ${results.length} products in ${duration}ms`);
    
    return NextResponse.json({
      success: true,
      duration: `${duration}ms`,
      keyword,
      productsFound: results.length,
      config: {
        appId: `${EBAY_CONFIG.appId.substring(0, 15)}...`,
        hasClientId: !!EBAY_CONFIG.clientId,
        hasClientSecret: !!EBAY_CONFIG.clientSecret,
      },
      sampleProducts: results.slice(0, 3).map(p => ({
        title: p.title,
        price: p.price,
        image: p.image.substring(0, 50) + '...',
      })),
      allProducts: results.length === 0 ? 'NONE' : 'See sampleProducts above',
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('❌ Test failed:', error);
    
    return NextResponse.json({
      success: false,
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
