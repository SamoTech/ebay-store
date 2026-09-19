import { Product, createSearchLink, isLiveProduct, liveProductId } from './products';
import { createAffiliateUrl, DEFAULT_CAMPAIGN_ID, getCampaignId } from './affiliate';
import { TokenManager } from '@/src/lib/token-manager';
import { logger } from '@/src/lib/logger';
import { LruRequestCache } from '@/src/features/search/services/search-cache';

const EBAY_FINDING_API = 'https://svcs.ebay.com/services/search/FindingService/v1';
const EBAY_BROWSE_API = 'https://api.ebay.com/buy/browse/v1';
const EBAY_OAUTH_API = 'https://api.ebay.com/identity/v1/oauth2/token';

export interface EbayConfig {
  appId: string;
  trackingId: string;
  clientId?: string;
  clientSecret?: string;
  oauthToken?: string;
  marketplaceId: string;
  oauthScope: string;
}

/**
 * Read eBay configuration from the environment.
 *
 * Called on demand (rather than once at module load) so tests, preview
 * deploys, and long-lived processes always see the current environment.
 */
export function readEbayConfig(): EbayConfig {
  return {
    appId: process.env.NEXT_PUBLIC_EBAY_APP_ID || process.env.EBAY_APP_ID || '',
    trackingId:
      process.env.EBAY_CAMPAIGN_ID ||
      process.env.NEXT_PUBLIC_EBAY_CAMPAIGN_ID ||
      process.env.NEXT_PUBLIC_EBAY_TRACKING_ID ||
      DEFAULT_CAMPAIGN_ID,
    clientId: process.env.EBAY_CLIENT_ID,
    clientSecret: process.env.EBAY_CLIENT_SECRET,
    oauthToken: process.env.EBAY_OAUTH_TOKEN,
    marketplaceId: process.env.EBAY_MARKETPLACE_ID || 'EBAY_US',
    oauthScope: process.env.EBAY_OAUTH_SCOPE || 'https://api.ebay.com/oauth/api_scope',
  };
}

/** Snapshot of the configuration at import time (server side). */
export const EBAY_CONFIG = readEbayConfig();

export interface EbayFindingItem {
  title: string;
  price: string;
  image: string;
  itemId: string;
  viewItemURL?: string;
  condition?: string;
  shippingInfo?: Array<{
    shippingServiceCost?: Array<{ __value__?: string }>;
  }>;
}

export interface EbayFindingApiResponse {
  findItemsByKeywordsResponse?: Array<{
    searchResult?: Array<{
      item?: EbayFindingItem[];
      '@count'?: string;
    }>;
    ack?: Array<string>;
  }>;
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
  condition?: string;
  shippingOptions?: Array<{
    shippingCost?: { value?: string; currency?: string };
    shippingType?: string;
  }>;
}

export interface EbaySearchResponse {
  itemSummaries?: EbayItemSummary[];
  total?: number;
}

/**
 * Token managers are cached per credential set so a token fetched once is
 * reused until it expires, while changing env vars (tests, config updates)
 * transparently produces a fresh manager.
 */
let tokenManager: TokenManager | null = null;
let tokenManagerKey = '';

function getTokenManager(): TokenManager {
  const config = readEbayConfig();
  const key = [
    config.clientId ?? '',
    config.clientSecret ?? '',
    config.oauthScope,
    config.oauthToken ?? '',
  ].join('|');

  if (!tokenManager || tokenManagerKey !== key) {
    tokenManager = new TokenManager({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      scope: config.oauthScope,
      tokenUrl: EBAY_OAUTH_API,
      manualToken: config.oauthToken,
    });
    tokenManagerKey = key;
  }

  return tokenManager;
}

const browseCache = new LruRequestCache<EbaySearchResponse>(200);

/**
 * Add affiliate tracking to an eBay URL.
 *
 * Delegates to the shared affiliate module so the campaign ID always comes
 * from `NEXT_PUBLIC_EBAY_CAMPAIGN_ID` / `EBAY_CAMPAIGN_ID` (and never from a
 * hard-coded constant).
 */
export function createAffiliateUrlForConfig(
  ebayUrl: string,
  customId?: string,
): string {
  return createAffiliateUrl(ebayUrl, customId);
}

/** Current campaign ID (exposed for diagnostics such as /api/health). */
export function getActiveCampaignId(): string {
  return getCampaignId();
}

export function getEbayIntegrationStatus(): EbayIntegrationStatus {
  const { oauthToken, clientId, clientSecret, appId, marketplaceId } = readEbayConfig();

  if (oauthToken) return { mode: 'manual_token', marketplaceId, missing: [], apiType: 'Browse' };

  const missingOAuth: string[] = [];
  if (!clientId) missingOAuth.push('EBAY_CLIENT_ID');
  if (!clientSecret) missingOAuth.push('EBAY_CLIENT_SECRET');

  if (missingOAuth.length === 0) return { mode: 'client_credentials', marketplaceId, missing: [], apiType: 'Browse' };
  if (appId) return { mode: 'finding_api', marketplaceId, missing: missingOAuth, apiType: 'Finding' };

  return { mode: 'disabled', marketplaceId, missing: [...missingOAuth, 'EBAY_APP_ID'], apiType: 'None' };
}

export async function searchEbayBrowseAPI(keyword: string, limit = 20): Promise<EbaySearchResponse> {
  const config = readEbayConfig();
  const cacheKey = `browse:${config.marketplaceId}:${keyword}:${limit}`;

  return browseCache.getOrCompute(cacheKey, 600, async () => {
    const token = await getTokenManager().getToken();
    if (!token) return { itemSummaries: [], total: 0 };

    const response = await fetch(
      `${EBAY_BROWSE_API}/item_summary/search?q=${encodeURIComponent(keyword)}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-EBAY-C-MARKETPLACE-ID': config.marketplaceId,
        },
        next: { revalidate: 600 },
      },
    );

    if (!response.ok) {
      logger.warn('Browse API request failed', { status: response.status, keyword });
      return { itemSummaries: [], total: 0 };
    }

    return (await response.json()) as EbaySearchResponse;
  });
}

export async function searchEbayFindingAPI(keyword: string, maxResults = 12): Promise<EbayFindingItem[]> {
  const { appId } = readEbayConfig();
  if (!appId) {
    return [];
  }

  const url =
    `${EBAY_FINDING_API}?` +
    `OPERATION-NAME=findItemsByKeywords` +
    `&SERVICE-VERSION=1.13.0` +
    `&SECURITY-APPNAME=${appId}` +
    `&RESPONSE-DATA-FORMAT=JSON` +
    `&REST-PAYLOAD` +
    `&keywords=${encodeURIComponent(keyword)}` +
    `&paginationInput.entriesPerPage=${maxResults}` +
    `&sortOrder=BestMatch`;

  const response = await fetch(url, { next: { revalidate: 600 } });
  if (!response.ok) return [];

  const data = (await response.json()) as EbayFindingApiResponse;
  const items = data.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item ?? [];
  const ack = data.findItemsByKeywordsResponse?.[0]?.ack?.[0];
  return ack === 'Success' ? items : [];
}

export async function searchEbayProducts(keyword: string, maxResults = 12): Promise<Product[]> {
  const config = readEbayConfig();
  const status = getEbayIntegrationStatus();

  if (status.apiType === 'Browse') {
    const browseResults = await searchEbayBrowseAPI(keyword, maxResults);
    if (browseResults.itemSummaries && browseResults.itemSummaries.length > 0) {
      return browseResults.itemSummaries
        // Live items use IDs >= LIVE_PRODUCT_ID_OFFSET (1000) so they can never
        // be mistaken for static catalog items by the UI.
        .map((item, index) => mapBrowseItemToProduct(item, liveProductId(index), 'Search'))
        .filter((p): p is Product => p !== null);
    }
  }

  if (status.apiType === 'Finding' || (status.apiType === 'Browse' && config.appId)) {
    const findingResults = await searchEbayFindingAPI(keyword, maxResults);
    if (findingResults.length > 0) {
      return findingResults
        .map((item, index) => mapFindingItemToProduct(item, liveProductId(index), 'Search'))
        .filter((p): p is Product => p !== null);
    }
  }

  return [];
}

export async function searchMultipleKeywords(keywords: string[], perKeyword = 4): Promise<Product[]> {
  const results = await Promise.all(keywords.map((keyword) => searchEbayProducts(keyword, perKeyword)));
  return results.flat();
}

export async function getTrendingProducts(): Promise<Product[]> {
  const dayOfWeek = new Date().getDay();
  const categoryKeywords = [
    'iPhone 15 Pro',
    'PlayStation 5',
    'Nike Air Jordan',
    'MacBook Pro M3',
    'Samsung Galaxy S24',
    'Nintendo Switch OLED',
    'Apple Watch Series 9',
  ];
  return searchEbayProducts(categoryKeywords[dayOfWeek], 8);
}

function resolveEbayImage(item: EbayItemSummary): string {
  return item.image?.imageUrl || item.thumbnailImages?.[0]?.imageUrl || item.additionalImages?.[0]?.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image';
}

/** Summarise eBay shipping options into a short label. */
export function summarizeShipping(item: EbayItemSummary): string | undefined {
  const option = item.shippingOptions?.[0];
  if (!option) return undefined;

  const cost = Number(option.shippingCost?.value ?? Number.NaN);
  if (Number.isFinite(cost) && cost === 0) return 'Free shipping';
  if (Number.isFinite(cost) && cost > 0) return `Shipping ${cost.toFixed(2)}`;
  return option.shippingType;
}

export function mapBrowseItemToProduct(item: EbayItemSummary, id: number, category: string): Product | null {
  const priceValue = Number(item.price?.value || 0);
  if (!item.title || !priceValue || Number.isNaN(priceValue)) return null;

  const affiliateLink = item.itemWebUrl
    ? createAffiliateUrlForConfig(item.itemWebUrl, `browse-${category.toLowerCase()}`)
    : createSearchLink(item.title, `fallback-${category.toLowerCase()}`);

  return {
    id,
    title: item.title,
    price: priceValue,
    currency: item.price?.currency || 'USD',
    image: resolveEbayImage(item),
    category,
    affiliateLink,
    description: item.shortDescription || `Live product from eBay ${category} results.`,
    isLive: isLiveProduct({ id }),
    condition: item.condition,
    shipping: summarizeShipping(item),
  };
}

export function mapFindingItemToProduct(item: EbayFindingItem, id: number, category: string): Product | null {
  const priceValue = Number.parseFloat(item.price);
  if (!item.title || !priceValue || Number.isNaN(priceValue)) return null;

  const affiliateLink = item.viewItemURL
    ? createAffiliateUrlForConfig(item.viewItemURL, `finding-${category.toLowerCase()}`)
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
    isLive: isLiveProduct({ id }),
    condition: item.condition,
    shipping: resolveFindingShipping(item),
  };
}

function resolveFindingShipping(item: EbayFindingItem): string | undefined {
  const cost = Number.parseFloat(
    item.shippingInfo?.[0]?.shippingServiceCost?.[0]?.__value__ ?? '',
  );
  if (!Number.isFinite(cost)) return undefined;
  return cost === 0 ? 'Free shipping' : `Shipping ${cost.toFixed(2)}`;
}

export { DEFAULT_CAMPAIGN_ID, createAffiliateUrl };
export const getEbayProducts = searchEbayFindingAPI;
