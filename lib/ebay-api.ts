import { Product, createSearchLink } from './products';
import { TokenManager } from '@/src/lib/token-manager';
import { logger } from '@/src/lib/logger';
import { LruRequestCache } from '@/src/features/search/services/search-cache';

const EBAY_FINDING_API = 'https://svcs.ebay.com/services/search/FindingService/v1';
const EBAY_BROWSE_API = 'https://api.ebay.com/buy/browse/v1';
const EBAY_OAUTH_API = 'https://api.ebay.com/identity/v1/oauth2/token';

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

export interface EbayFindingItem {
  title: string;
  price: string;
  image: string;
  itemId: string;
  viewItemURL?: string;
  condition?: string;
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
}

export interface EbaySearchResponse {
  itemSummaries?: EbayItemSummary[];
  total?: number;
}

const tokenManager = new TokenManager({
  clientId: EBAY_CONFIG.clientId,
  clientSecret: EBAY_CONFIG.clientSecret,
  scope: EBAY_CONFIG.oauthScope,
  tokenUrl: EBAY_OAUTH_API,
  manualToken: EBAY_CONFIG.oauthToken,
});

const browseCache = new LruRequestCache<EbaySearchResponse>(200);

export function createAffiliateUrl(ebayUrl: string, customId?: string): string {
  try {
    const url = new URL(ebayUrl);
    url.searchParams.set('mkcid', MKCID);
    url.searchParams.set('mkrid', MKRID);
    url.searchParams.set('siteid', SITEID);
    url.searchParams.set('campid', CAMPID);
    if (customId) {
      url.searchParams.set('customid', encodeURIComponent(customId));
    }
    return url.toString();
  } catch {
    return ebayUrl;
  }
}

export function getEbayIntegrationStatus(): EbayIntegrationStatus {
  const { oauthToken, clientId, clientSecret, appId, marketplaceId } = EBAY_CONFIG;

  if (oauthToken) return { mode: 'manual_token', marketplaceId, missing: [], apiType: 'Browse' };

  const missingOAuth: string[] = [];
  if (!clientId) missingOAuth.push('EBAY_CLIENT_ID');
  if (!clientSecret) missingOAuth.push('EBAY_CLIENT_SECRET');

  if (missingOAuth.length === 0) return { mode: 'client_credentials', marketplaceId, missing: [], apiType: 'Browse' };
  if (appId) return { mode: 'finding_api', marketplaceId, missing: missingOAuth, apiType: 'Finding' };

  return { mode: 'disabled', marketplaceId, missing: [...missingOAuth, 'EBAY_APP_ID'], apiType: 'None' };
}

export async function searchEbayBrowseAPI(keyword: string, limit = 20): Promise<EbaySearchResponse> {
  const cacheKey = `browse:${keyword}:${limit}`;
  return browseCache.getOrCompute(cacheKey, 600, async () => {
    const token = await tokenManager.getToken();
    if (!token) return { itemSummaries: [], total: 0 };

    const response = await fetch(
      `${EBAY_BROWSE_API}/item_summary/search?q=${encodeURIComponent(keyword)}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-EBAY-C-MARKETPLACE-ID': EBAY_CONFIG.marketplaceId,
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
  if (!EBAY_CONFIG.appId) {
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

  const response = await fetch(url, { next: { revalidate: 600 } });
  if (!response.ok) return [];

  const data = (await response.json()) as EbayFindingApiResponse;
  const items = data.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item ?? [];
  const ack = data.findItemsByKeywordsResponse?.[0]?.ack?.[0];
  return ack === 'Success' ? items : [];
}

export async function searchEbayProducts(keyword: string, maxResults = 12): Promise<Product[]> {
  const status = getEbayIntegrationStatus();

  if (status.apiType === 'Browse') {
    const browseResults = await searchEbayBrowseAPI(keyword, maxResults);
    if (browseResults.itemSummaries && browseResults.itemSummaries.length > 0) {
      return browseResults.itemSummaries
        .map((item, index) => mapBrowseItemToProduct(item, index, 'Search'))
        .filter((p): p is Product => p !== null);
    }
  }

  if (status.apiType === 'Finding' || (status.apiType === 'Browse' && EBAY_CONFIG.appId)) {
    const findingResults = await searchEbayFindingAPI(keyword, maxResults);
    if (findingResults.length > 0) {
      return findingResults
        .map((item, index) => mapFindingItemToProduct(item, index, 'Search'))
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

export function mapBrowseItemToProduct(item: EbayItemSummary, id: number, category: string): Product | null {
  const priceValue = Number(item.price?.value || 0);
  if (!item.title || !priceValue || Number.isNaN(priceValue)) return null;

  const affiliateLink = item.itemWebUrl
    ? createAffiliateUrl(item.itemWebUrl, `browse-${category.toLowerCase()}`)
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
  };
}

export function mapFindingItemToProduct(item: EbayFindingItem, id: number, category: string): Product | null {
  const priceValue = Number.parseFloat(item.price);
  if (!item.title || !priceValue || Number.isNaN(priceValue)) return null;

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

export { CAMPID, SITEID, MKRID, MKCID };
export const getEbayProducts = searchEbayFindingAPI;
