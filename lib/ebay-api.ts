import { Product, createSearchLink } from './products';

const EBAY_BROWSE_API = 'https://api.ebay.com/buy/browse/v1';
const EBAY_OAUTH_API = 'https://api.ebay.com/identity/v1/oauth2/token';

interface EbayTokenResponse {
  access_token: string;
  expires_in: number;
}

export interface EbayIntegrationStatus {
  mode: 'manual_token' | 'client_credentials' | 'disabled';
  marketplaceId: string;
  missing: string[];
}

export interface EbayItemSummary {
  itemId: string;
  title: string;
  image?: { imageUrl?: string };
  price?: { value?: string; currency?: string };
  itemWebUrl?: string;
  shortDescription?: string;
}

export interface EbaySearchResponse {
  itemSummaries?: EbayItemSummary[];
  total?: number;
}

let tokenCache: { token: string; expiresAt: number } | null = null;

function getMarketplaceId() {
  return process.env.EBAY_MARKETPLACE_ID || 'EBAY_US';
}

function getOauthScope() {
  return process.env.EBAY_OAUTH_SCOPE || 'https://api.ebay.com/oauth/api_scope';
}

export function getEbayIntegrationStatus(): EbayIntegrationStatus {
  const explicitToken = process.env.EBAY_OAUTH_TOKEN;
  if (explicitToken) {
    return {
      mode: 'manual_token',
      marketplaceId: getMarketplaceId(),
      missing: [],
    };
  }

  const missing: string[] = [];
  if (!process.env.EBAY_CLIENT_ID) missing.push('EBAY_CLIENT_ID');
  if (!process.env.EBAY_CLIENT_SECRET) missing.push('EBAY_CLIENT_SECRET');

  return {
    mode: missing.length ? 'disabled' : 'client_credentials',
    marketplaceId: getMarketplaceId(),
    missing,
  };
}

async function getEbayAccessToken(): Promise<string | null> {
  const explicitToken = process.env.EBAY_OAUTH_TOKEN;
  if (explicitToken) return explicitToken;

  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: getOauthScope(),
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

  if (!response.ok) return null;

  const tokenData = (await response.json()) as EbayTokenResponse;
  tokenCache = {
    token: tokenData.access_token,
    expiresAt: Date.now() + Math.max(0, tokenData.expires_in - 60) * 1000,
  };

  return tokenCache.token;
}

export async function searchEbayProducts(keyword: string, limit = 20): Promise<EbaySearchResponse> {
  const token = await getEbayAccessToken();
  if (!token) {
    return { itemSummaries: [], total: 0 };
  }

  const response = await fetch(
    `${EBAY_BROWSE_API}/item_summary/search?q=${encodeURIComponent(keyword)}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': getMarketplaceId(),
      },
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error(`eBay API error ${response.status}`);
  }

  return response.json();
}

export function mapEbayItemToProduct(item: EbayItemSummary, id: number, category: string): Product | null {
  const priceValue = Number(item.price?.value || 0);
  if (!item.title || !priceValue || Number.isNaN(priceValue)) return null;

  const image = item.image?.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image';
  const affiliateLink = item.itemWebUrl || createSearchLink(item.title);

  return {
    id,
    title: item.title,
    price: priceValue,
    currency: item.price?.currency || 'USD',
    image,
    category,
    affiliateLink,
    description: item.shortDescription || `Live product from eBay ${category} results.`,
  };
}
