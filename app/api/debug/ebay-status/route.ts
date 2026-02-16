import { NextResponse } from 'next/server';
import { getEbayIntegrationStatus, EBAY_CONFIG } from '../../../../lib/ebay-api';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const status = getEbayIntegrationStatus();
  
  // Mask sensitive data
  const maskedConfig = {
    appId: EBAY_CONFIG.appId ? `${EBAY_CONFIG.appId.substring(0, 10)}...` : 'NOT SET',
    clientId: EBAY_CONFIG.clientId ? `${EBAY_CONFIG.clientId.substring(0, 10)}...` : 'NOT SET',
    clientSecret: EBAY_CONFIG.clientSecret ? '***SET***' : 'NOT SET',
    oauthToken: EBAY_CONFIG.oauthToken ? '***SET***' : 'NOT SET',
    marketplaceId: EBAY_CONFIG.marketplaceId,
    trackingId: EBAY_CONFIG.trackingId,
  };

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    integration: status,
    config: maskedConfig,
    env: {
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL ? 'yes' : 'no',
      vercelEnv: process.env.VERCEL_ENV,
    },
    diagnosis: {
      isConfigured: status.mode !== 'disabled',
      canUseBrowseAPI: status.apiType === 'Browse',
      canUseFindingAPI: status.apiType === 'Finding',
      needsConfiguration: status.mode === 'disabled',
    },
    instructions: status.mode === 'disabled' 
      ? 'Add EBAY_APP_ID or EBAY_CLIENT_ID/EBAY_CLIENT_SECRET to Vercel environment variables'
      : 'eBay API is configured and ready to use',
  });
}
