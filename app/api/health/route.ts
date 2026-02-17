import { NextResponse } from 'next/server';
import { getEbayIntegrationStatus, EBAY_CONFIG } from '@/lib/ebay-api';

/**
 * Health Check Endpoint
 * 
 * Returns the status of eBay API integration and configuration.
 * Use this to diagnose why live products aren't loading.
 * 
 * GET /api/health
 */
export async function GET() {
  const status = getEbayIntegrationStatus();
  
  // Check for configuration issues
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // Critical: OAuth credentials
  if (!EBAY_CONFIG.clientId) {
    errors.push('EBAY_CLIENT_ID is missing - Live products will not load');
  }
  if (!EBAY_CONFIG.clientSecret) {
    errors.push('EBAY_CLIENT_SECRET is missing - Live products will not load');
  }
  
  // Warning: Deprecated Finding API
  if (EBAY_CONFIG.appId) {
    warnings.push(
      'EBAY_APP_ID is set but deprecated. Remove it to use Browse API with OAuth.'
    );
  }
  
  // Warning: Campaign ID
  if (!EBAY_CONFIG.trackingId || EBAY_CONFIG.trackingId === '5338903178') {
    warnings.push(
      'Using default Campaign ID. Set EBAY_CAMPAIGN_ID for your affiliate account.'
    );
  }
  
  // Determine overall health
  const isHealthy = errors.length === 0 && status.mode !== 'disabled';
  const httpStatus = isHealthy ? 200 : 503;
  
  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      ebay: {
        integration: {
          mode: status.mode,
          apiType: status.apiType,
          marketplaceId: status.marketplaceId,
          missing: status.missing,
        },
        configuration: {
          hasClientId: !!EBAY_CONFIG.clientId,
          hasClientSecret: !!EBAY_CONFIG.clientSecret,
          hasCampaignId: !!EBAY_CONFIG.trackingId,
          hasAppId: !!EBAY_CONFIG.appId, // Should be false
          hasManualToken: !!EBAY_CONFIG.oauthToken,
        },
      },
      diagnostics: {
        errors,
        warnings,
        recommendation:
          errors.length > 0
            ? 'Fix errors above to enable live eBay products'
            : warnings.length > 0
            ? 'Configuration is working but can be improved'
            : 'Configuration is optimal',
      },
      expectedBehavior:
        status.mode === 'client_credentials'
          ? 'Live eBay products should load via Browse API with OAuth'
          : status.mode === 'manual_token'
          ? 'Live eBay products should load using manual OAuth token'
          : status.mode === 'finding_api'
          ? 'Using deprecated Finding API - upgrade to Browse API recommended'
          : 'Live products DISABLED - static fallback only',
    },
    { status: httpStatus }
  );
}
