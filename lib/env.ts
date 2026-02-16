/**
 * Environment Variable Validation
 * 
 * This file validates that all required environment variables are present
 * and provides a typed interface for accessing them throughout the app.
 * 
 * Required environment variables:
 * - WEB3FORMS_ACCESS_KEY: API key for Web3Forms newsletter service
 * - EBAY_APP_ID: eBay Partner Network application ID
 * - NEXT_PUBLIC_GA_ID: Google Analytics measurement ID
 */

const requiredEnvVars = [
  'WEB3FORMS_ACCESS_KEY',
  'EBAY_APP_ID',
  'NEXT_PUBLIC_GA_ID',
] as const;

const optionalEnvVars = [
  'SENTRY_DSN',
  'DATABASE_URL',
] as const;

/**
 * Validates that all required environment variables are present
 * @throws {Error} If any required environment variables are missing
 */
function validateEnv(): void {
  // Skip validation in test environment
  if (process.env.NODE_ENV === 'test') {
    console.log('⏭️ Skipping environment validation in test mode');
    return;
  }
  
  const missing = requiredEnvVars.filter(
    key => !process.env[key] || process.env[key] === ''
  );
  
  if (missing.length > 0) {
    const errorMessage = [
      '',
      '❌ Missing Required Environment Variables',
      '',
      ...missing.map(key => `  - ${key}`),
      '',
      '📄 Please check:',
      '  1. Your .env.local file (for local development)',
      '  2. Vercel Dashboard → Settings → Environment Variables (for production)',
      '  3. .env.example file for reference',
      '',
      '📚 Documentation: See SETUP_GUIDE.md for details',
      '',
    ].join('\n');
    
    throw new Error(errorMessage);
  }
  
  // Log success
  console.log('✅ All required environment variables loaded');
  
  // Log optional variables status
  const missingOptional = optionalEnvVars.filter(
    key => !process.env[key] || process.env[key] === ''
  );
  
  if (missingOptional.length > 0) {
    console.log('⚠️ Optional environment variables not set:', missingOptional.join(', '));
  }
}

// Run validation on module import
validateEnv();

/**
 * Typed environment configuration object
 * 
 * Use this instead of process.env for type safety and autocompletion
 * 
 * @example
 * import { env } from '@/lib/env';
 * 
 * const apiKey = env.web3FormsKey;
 */
export const env = {
  // Required variables
  web3FormsKey: process.env.WEB3FORMS_ACCESS_KEY!,
  ebayAppId: process.env.EBAY_APP_ID!,
  gaId: process.env.NEXT_PUBLIC_GA_ID!,
  
  // Optional variables
  sentryDsn: process.env.SENTRY_DSN,
  databaseUrl: process.env.DATABASE_URL,
  
  // System variables
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
} as const;

/**
 * Type definition for environment configuration
 */
export type Env = typeof env;

/**
 * Get environment variable with fallback
 * @param key - Environment variable key
 * @param fallback - Fallback value if not found
 */
export function getEnv(key: string, fallback?: string): string {
  return process.env[key] || fallback || '';
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return env.isProduction;
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return env.isDevelopment;
}

/**
 * Check if running in test
 */
export function isTest(): boolean {
  return env.isTest;
}
