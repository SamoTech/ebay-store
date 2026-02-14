import { getEbayIntegrationStatus } from '@/lib/ebay-api';
import { NextResponse } from 'next/server';

/**
 * GET /api/ebay-status
 * 
 * Check the status of eBay API integration
 * Returns configuration mode and any missing credentials
 * 
 * Example response:
 * {
 *   "mode": "client_credentials",
 *   "marketplaceId": "EBAY_US",
 *   "missing": []
 * }
 */
export async function GET() {
  try {
    const status = getEbayIntegrationStatus();
    
    return NextResponse.json({
      success: true,
      ...status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get eBay API status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
