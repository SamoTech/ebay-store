/**
 * Environment variable validation on startup
 */

import { getEbayIntegrationStatus } from './ebay-api';

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

  // Check Node environment
  const nodeEnv = process.env.NODE_ENV || 'development';
  const mode = nodeEnv as 'production' | 'development' | 'test';

  // Check eBay API configuration
  if (ebayStatus.mode === 'disabled') {
    warnings.push(
      `⚠️  eBay API disabled. Missing: ${ebayStatus.missing.join(', ')}`
    );
    warnings.push('📦 Running in static-only mode');
  } else {
    console.log(`✅ eBay API configured: ${ebayStatus.mode}`);
    console.log(`🌍 Marketplace: ${ebayStatus.marketplaceId}`);
  }

  // Check Vercel KV (optional but recommended)
  if (!process.env.KV_REST_API_URL && mode === 'production') {
    warnings.push(
      '⚠️  Vercel KV not configured. Token caching will use memory (not persistent).'
    );
  }

  // Check analytics (optional)
  if (!process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID && mode === 'production') {
    warnings.push('ℹ️  Vercel Analytics not configured');
  }

  // Print warnings
  warnings.forEach((warning) => console.warn(warning));

  return {
    isValid: ebayStatus.mode !== 'disabled' || warnings.length === 0,
    mode,
    ebayApi: {
      configured: ebayStatus.mode !== 'disabled',
      mode: ebayStatus.mode,
      missing: ebayStatus.missing,
    },
    warnings,
  };
}

/**
 * Run validation on server startup
 */
if (typeof window === 'undefined') {
  validateEnvironment();
}
