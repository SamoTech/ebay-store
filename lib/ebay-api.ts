/**
 * Consolidated eBay API Integration
 * 
 * This module provides:
 * 1. eBay Finding API (public search)
 * 2. eBay Browse API (OAuth-based)
 * 3. Affiliate link generation with Campaign ID
 * 4. Product data mapping and normalization
 * 
 * Supports both Finding API (simple) and Browse API (advanced)
 */

import { Product, createSearchLink } from './products';

// ═══════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════

const EBAY_FINDING_API = 'https://svcs.ebay.com/services/search/FindingService/v1';
const EBAY_BROWSE_API = 'https://api.ebay.com/buy/browse/v1';
const EBAY_OAUTH_API = 'https://api.ebay.com/identity/v1/oauth2/token';

// eBay Partner Network Affiliate Tracking
const CAMPID = '5338903178';
const SITEID = '0';
const MKRID = '711-53200-19255-0';
const MKCID = '1';

export const EBAY_CONFIG = {
  appId: process.env.NEXT_PUBLIC_EBAY_APP_ID || process.env.EBAY_APP_ID || '',
  trackingId: process.env.NEXT_PUBLIC_EBAY_TRACKING_ID || CAMPID,
  clientId: process.env.EBAY_CLIENT_ID,
  clientSecret: process.env.EBAY_CLIENT_SECRET,
  oauthToken: process.env.EBAY_OAUTH_TOKEN,
  marketplaceId: process.env.EBAY_MARKETPLACE_ID || 'EBAY_US',
  oauthScope: process.env.EBAY_OAUTH_SCOPE || 'https://api.ebay.com/oauth/api_scope',
};

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface EbayProduct {
  title: string;
  price: string;
  image: string;
  itemId: string;
  viewItemURL?: string;
  condition?: string;
  shippingInfo?: any;
}

export interface EbayFindingApiResponse {
  findItemsByKeywordsResponse?: Array<{
    searchResult?: Array<{
      item?: EbayProduct[];
      '@count'?: string;
    }>;
    ack?: Array<string>;
  }>;
}

export interface EbayTokenResponse {
  access_token: string;
  expires_in: number;
}

export interface EbayIntegrationStatus {
  mode: 'manual_token' | 'client_credentials' | 'finding_api' | 'disabled';
  marketplaceId: string;
  missing: string[];
  apiType: 'Browse' | 'Finding' | 'None';
}

export interface EbayItemSummary {
  itemId: string;
  title: string;
  image?: { imageUrl?: string };
  thumbnailImages?: Array<{ imageUrl?: string }>;
  additionalImages?: Array<{ imageUrl?: string }>;
  price?: { value?: string; currency?: string };
  itemWebUrl?: string;
  shortDescription?: string;
}

export interface EbaySearchResponse {
  itemSummaries?: EbayItemSummary[];
  total?: number;
}

// ═══════════════════════════════════════════════════════════
// TOKEN MANAGEMENT (Browse API)
// ═══════════════════════════════════════════════════════════

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getEbayAccessToken(): Promise<string | null> {
  // Priority 1: Manual token from env
  if (EBAY_CONFIG.oauthToken) {
    return EBAY_CONFIG.oauthToken;
  }

  // Priority 2: Cached token (if still valid)
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  // Priority 3: Generate new token via client credentials
  const { clientId, clientSecret, oauthScope } = EBAY_CONFIG;
  if (!clientId || !clientSecret) {
    return null; // Fall back to Finding API
  }

  try {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      scope: oauthScope,
    });

    const response = await fetch(EBAY_OAUTH_API, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('❌ Failed to get eBay OAuth token:', response.status);
      return null;
    }

    const tokenData = (await response.json()) as EbayTokenResponse;

    tokenCache = {
      token: tokenData.access_token,
      expiresAt: Date.now() + Math.max(0, tokenData.expires_in - 60) * 1000,
    };

    console.log('✅ eBay OAuth token acquired (Browse API)');
    return tokenCache.token;
  } catch (error) {
    console.error('❌ Error getting eBay access token:', error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════
// AFFILIATE TRACKING
// ═══════════════════════════════════════════════════════════

/**
 * Creates an affiliate-tracked URL from an eBay product URL
 * @param ebayUrl - The original eBay product URL
 * @param customId - Optional custom tracking ID for granular analytics
 * @returns Affiliate-tracked URL with Campaign ID
 */
export function createAffiliateUrl(ebayUrl: string, customId?: string): string {
  try {
    const url = new URL(ebayUrl);
    
    // Add required affiliate tracking parameters
    url.searchParams.set('mkcid', MKCID);
    url.searchParams.set('mkrid', MKRID);
    url.searchParams.set('siteid', SITEID);
    url.searchParams.set('campid', CAMPID);
    
    // Optional: Add custom ID for granular tracking
    if (customId) {
      url.searchParams.set('customid', encodeURIComponent(customId));
    }
    
    return url.toString();
  } catch (error) {
    console.error('❌ Error creating affiliate URL:', error);
    return ebayUrl;
  }
}

// ═══════════════════════════════════════════════════════════
// INTEGRATION STATUS
// ═══════════════════════════════════════════════════════════

export function getEbayIntegrationStatus(): EbayIntegrationStatus {
  const { oauthToken, clientId, clientSecret, appId, marketplaceId } = EBAY_CONFIG;

  // Check OAuth (Browse API)
  if (oauthToken) {
    return {
      mode: 'manual_token',
      marketplaceId,
      missing: [],
      apiType: 'Browse',
    };
  }

  const missingOAuth: string[] = [];
  if (!clientId) missingOAuth.push('EBAY_CLIENT_ID');
  if (!clientSecret) missingOAuth.push('EBAY_CLIENT_SECRET');

  if (missingOAuth.length === 0) {
    return {
      mode: 'client_credentials',
      marketplaceId,
      missing: [],
      apiType: 'Browse',
    };
  }

  // Check Finding API (fallback)
  if (appId) {
    return {
      mode: 'finding_api',
      marketplaceId,
      missing: missingOAuth,
      apiType: 'Finding',
    };
  }

  // No API configured
  return {
    mode: 'disabled',
    marketplaceId,
    missing: [...missingOAuth, 'EBAY_APP_ID'],
    apiType: 'None',
  };
}

// ═══════════════════════════════════════════════════════════
// BROWSE API (OAuth-based, advanced features)
// ═══════════════════════════════════════════════════════════

export async function searchEbayBrowseAPI(
  keyword: string,
  limit = 20
): Promise<EbaySearchResponse> {
  const token = await getEbayAccessToken();

  if (!token) {
    console.warn('⚠️ No OAuth token available, falling back to Finding API');
    return { itemSummaries: [], total: 0 };
  }

  try {
    const response = await fetch(
      `${EBAY_BROWSE_API}/item_summary/search?q=${encodeURIComponent(keyword)}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-EBAY-C-MARKETPLACE-ID': EBAY_CONFIG.marketplaceId,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      console.error('❌ eBay Browse API error:', response.status);
      return { itemSummaries: [], total: 0 };
    }

    const data = await response.json();
    console.log(`✅ eBay Browse API: Found ${data.itemSummaries?.length || 0} items for "${keyword}"`);
    return data;
  } catch (error) {
    console.error('❌ Error fetching from eBay Browse API:', error);
    return { itemSummaries: [], total: 0 };
  }
}

// ═══════════════════════════════════════════════════════════
// FINDING API (Public, no OAuth required)
// ═══════════════════════════════════════════════════════════

/**
 * Fetch products from eBay Finding API (public search)
 * @param keyword - Search keyword
 * @param maxResults - Maximum number of results (default: 12)
 * @returns Array of eBay products
 */
export async function searchEbayFindingAPI(
  keyword: string,
  maxResults: number = 12
): Promise<EbayProduct[]> {
  try {
    if (!EBAY_CONFIG.appId) {
      console.warn('⚠️ eBay App ID not configured. API search disabled.');
      return [];
    }

    const url =
      `${EBAY_FINDING_API}?` +
      `OPERATION-NAME=findItemsByKeywords` +
      `&SERVICE-VERSION=1.13.0` +
      `&SECURITY-APPNAME=${EBAY_CONFIG.appId}` +
      `&RESPONSE-DATA-FORMAT=JSON` +
      `&REST-PAYLOAD` +
      `&keywords=${encodeURIComponent(keyword)}` +
      `&paginationInput.entriesPerPage=${maxResults}` +
      `&sortOrder=BestMatch`;

    console.log('🔍 Fetching from eBay Finding API:', keyword);

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('❌ eBay Finding API error:', response.status, response.statusText);
      return [];
    }

    const data: EbayFindingApiResponse = await response.json();

    const items = data.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item || [];
    const ack = data.findItemsByKeywordsResponse?.[0]?.ack?.[0];

    if (ack === 'Success') {
      console.log(`✅ eBay Finding API: Found ${items.length} items for "${keyword}"`);
      return items;
    } else {
      console.warn('⚠️ eBay Finding API returned non-success:', ack);
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching from eBay Finding API:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════
// UNIFIED SEARCH (Auto-selects best API)
// ═══════════════════════════════════════════════════════════

/**
 * Search eBay products using the best available API
 * Automatically falls back from Browse API to Finding API
 */
export async function searchEbayProducts(
  keyword: string,
  maxResults: number = 12
): Promise<Product[]> {
  const status = getEbayIntegrationStatus();

  // Try Browse API first (if OAuth available)
  if (status.apiType === 'Browse') {
    const browseResults = await searchEbayBrowseAPI(keyword, maxResults);
    if (browseResults.itemSummaries && browseResults.itemSummaries.length > 0) {
      return browseResults.itemSummaries
        .map((item, index) => mapBrowseItemToProduct(item, index, 'Search'))
        .filter((p): p is Product => p !== null);
    }
  }

  // Fallback to Finding API
  if (status.apiType === 'Finding' || status.apiType === 'Browse') {
    const findingResults = await searchEbayFindingAPI(keyword, maxResults);
    return findingResults
      .map((item, index) => mapFindingItemToProduct(item, index, 'Search'))
      .filter((p): p is Product => p !== null);
  }

  console.warn('⚠️ No eBay API configured');
  return [];
}

/**
 * Search multiple keywords and combine results
 * @param keywords - Array of search terms
 * @param perKeyword - Results per keyword (default: 4)
 * @returns Combined array of products
 */
export async function searchMultipleKeywords(
  keywords: string[],
  perKeyword: number = 4
): Promise<Product[]> {
  try {
    const results = await Promise.all(
      keywords.map(keyword => searchEbayProducts(keyword, perKeyword))
    );

    return results.flat();
  } catch (error) {
    console.error('❌ Error in multi-keyword search:', error);
    return [];
  }
}

/**
 * Get trending products from eBay for today
 * Rotates categories based on day of week
 */
export async function getTrendingProducts(): Promise<Product[]> {
  const dayOfWeek = new Date().getDay();

  const categoryKeywords = [
    'iPhone 15 Pro',           // Sunday
    'PlayStation 5',           // Monday
    'Nike Air Jordan',         // Tuesday
    'MacBook Pro M3',          // Wednesday
    'Samsung Galaxy S24',      // Thursday
    'Nintendo Switch OLED',    // Friday
    'Apple Watch Series 9',    // Saturday
  ];

  const keyword = categoryKeywords[dayOfWeek];
  console.log(`📅 Today's trending category: ${keyword}`);

  return searchEbayProducts(keyword, 8);
}

// ═══════════════════════════════════════════════════════════
// DATA MAPPING
// ═══════════════════════════════════════════════════════════

function resolveEbayImage(item: EbayItemSummary): string {
  return (
    item.image?.imageUrl ||
    item.thumbnailImages?.[0]?.imageUrl ||
    item.additionalImages?.[0]?.imageUrl ||
    'https://via.placeholder.com/400x300?text=No+Image'
  );
}

export function mapBrowseItemToProduct(
  item: EbayItemSummary,
  id: number,
  category: string
): Product | null {
  const priceValue = Number(item.price?.value || 0);

  if (!item.title || !priceValue || Number.isNaN(priceValue)) {
    return null;
  }

  const image = resolveEbayImage(item);

  // Apply affiliate tracking to the eBay URL with custom ID for category tracking
  const affiliateLink = item.itemWebUrl
    ? createAffiliateUrl(item.itemWebUrl, `browse-${category.toLowerCase()}`)
    : createSearchLink(item.title, `fallback-${category.toLowerCase()}`);

  return {
    id,
    title: item.title,
    price: priceValue,
    currency: item.price?.currency || 'USD',
    image,
    category,
    affiliateLink,
    description:
      item.shortDescription ||
      `Live product from eBay ${category} results.`,
  };
}

export function mapFindingItemToProduct(
  item: EbayProduct,
  id: number,
  category: string
): Product | null {
  const priceValue = parseFloat(item.price);

  if (!item.title || !priceValue || Number.isNaN(priceValue)) {
    return null;
  }

  // Apply affiliate tracking
  const affiliateLink = item.viewItemURL
    ? createAffiliateUrl(item.viewItemURL, `finding-${category.toLowerCase()}`)
    : createSearchLink(item.title, `fallback-${category.toLowerCase()}`);

  return {
    id,
    title: item.title,
    price: priceValue,
    currency: 'USD',
    image: item.image,
    category,
    affiliateLink,
    description: `${item.condition || 'New'} - Live product from eBay ${category} results.`,
  };
}

// ═══════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════

export { CAMPID, SITEID, MKRID, MKCID };

// Re-export legacy function names for backward compatibility
export const getEbayProducts = searchEbayFindingAPI;
