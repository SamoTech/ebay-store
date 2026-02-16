import { NextResponse } from 'next/server';
import { EBAY_CONFIG } from '@/lib/ebay';

export const dynamic = 'force-dynamic';

/**
 * eBay API Diagnostic Endpoint
 * Tests configuration and makes a direct API call
 */
export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    config: {
      appIdConfigured: !!EBAY_CONFIG.appId,
      appIdLength: EBAY_CONFIG.appId?.length || 0,
      appIdPreview: EBAY_CONFIG.appId ? `${EBAY_CONFIG.appId.slice(0, 10)}...${EBAY_CONFIG.appId.slice(-5)}` : 'NOT SET',
      trackingId: EBAY_CONFIG.trackingId
    },
    envVars: {
      NEXT_PUBLIC_EBAY_APP_ID: !!process.env.NEXT_PUBLIC_EBAY_APP_ID,
      NEXT_PUBLIC_EBAY_TRACKING_ID: !!process.env.NEXT_PUBLIC_EBAY_TRACKING_ID
    }
  };

  // Test actual API call
  try {
    const testUrl = 
      `https://svcs.ebay.com/services/search/FindingService/v1?` +
      `OPERATION-NAME=findItemsByKeywords` +
      `&SERVICE-VERSION=1.13.0` +
      `&SECURITY-APPNAME=${EBAY_CONFIG.appId}` +
      `&RESPONSE-DATA-FORMAT=JSON` +
      `&REST-PAYLOAD` +
      `&keywords=laptop` +
      `&paginationInput.entriesPerPage=3`;

    console.log('🧪 Testing eBay API with URL:', testUrl);

    const response = await fetch(testUrl);
    const data = await response.json();

    const result = {
      ...diagnostics,
      apiTest: {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        ack: data.findItemsByKeywordsResponse?.[0]?.ack?.[0] || 'Unknown',
        itemCount: data.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.['@count'] || '0',
        errorMessage: data.errorMessage?.[0]?.error?.[0]?.message?.[0] || null,
        rawResponse: data
      }
    };

    console.log('🧪 Test result:', JSON.stringify(result, null, 2));

    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json({
      ...diagnostics,
      apiTest: {
        success: false,
        error: (error as Error).message,
        stack: (error as Error).stack
      }
    }, { status: 500 });
  }
}
