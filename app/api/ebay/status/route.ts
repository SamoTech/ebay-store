import { NextResponse } from 'next/server';
import { getEbayIntegrationStatus } from '../../../../lib/ebay-api';

export async function GET() {
  const integration = getEbayIntegrationStatus();

  return NextResponse.json({
    ok: integration.mode !== 'disabled',
    integration,
  });
}
