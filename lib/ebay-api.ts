const EBAY_BROWSE_API = 'https://api.ebay.com/buy/browse/v1';

export interface EbayItemSummary {
  itemId: string;
  title: string;
  image?: { imageUrl?: string };
  price?: { value?: string; currency?: string };
  itemWebUrl?: string;
}

export interface EbaySearchResponse {
  itemSummaries?: EbayItemSummary[];
  total?: number;
}

export async function searchEbayProducts(keyword: string, limit = 20): Promise<EbaySearchResponse> {
  const token = process.env.EBAY_OAUTH_TOKEN;

  if (!token) {
    return { itemSummaries: [], total: 0 };
  }

  const response = await fetch(
    `${EBAY_BROWSE_API}/item_summary/search?q=${encodeURIComponent(keyword)}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': process.env.EBAY_MARKETPLACE_ID || 'EBAY_US',
      },
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error(`eBay API error ${response.status}`);
  }

  return response.json();
}
