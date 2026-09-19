/**
 * Environment variable validation.
 *
 * Call `validateEnvironment()` from `instrumentation.ts` (server start) or a
 * route handler — this module must not run checks as an import side effect,
 * otherwise every import logs and tests get noisy.
 */

import { getEbayIntegrationStatus } from './ebay-api';
import { isUsingDefaultCampaignId } from './affiliate';

export interface EnvironmentStatus {
  isValid: boolean;
  mode: 'production' | 'development' | 'test';
  ebayApi: {
    configured: boolean;
    mode: string;
    missing: string[];
  };
  warnings: string[];
}

export function validateEnvironment(): EnvironmentStatus {
  const warnings: string[] = [];
  const ebayStatus = getEbayIntegrationStatus();

  const nodeEnv = process.env.NODE_ENV || 'development';
  const mode = nodeEnv as 'production' | 'development' | 'test';

  if (ebayStatus.mode === 'disabled') {
    warnings.push(`⚠️  eBay API disabled. Missing: ${ebayStatus.missing.join(', ')}`);
    warnings.push('📦 Running in static catalog mode');
  } else {
    console.log(`✅ eBay API configured: ${ebayStatus.mode} (${ebayStatus.marketplaceId})`);
  }

  if (isUsingDefaultCampaignId()) {
    warnings.push(
      '⚠️  Using the default eBay Partner Network campaign ID. Set NEXT_PUBLIC_EBAY_CAMPAIGN_ID (or EBAY_CAMPAIGN_ID server-side) to track your own commissions.',
    );
  }

  if (!process.env.GROQ_API_KEY) {
    warnings.push('ℹ️  GROQ_API_KEY not set — the chatbot falls back to static replies.');
  }

  if (!process.env.ANALYTICS_READ_TOKEN && mode === 'production') {
    warnings.push(
      'ℹ️  ANALYTICS_READ_TOKEN not set — GET /api/track is disabled in production.',
    );
  }

  warnings.forEach((warning) => console.warn(warning));

  return {
    isValid: true,
    mode,
    ebayApi: {
      configured: ebayStatus.mode !== 'disabled',
      mode: ebayStatus.mode,
      missing: ebayStatus.missing,
    },
    warnings,
  };
}
