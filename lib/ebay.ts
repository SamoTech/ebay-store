export const EBAY_CONFIG = {
  appId: process.env.NEXT_PUBLIC_EBAY_APP_ID || '',
  trackingId: process.env.NEXT_PUBLIC_EBAY_TRACKING_ID || '5338903178'
};

export interface EbayProduct {
  title: string;
  price: string;
  image: string;
  itemId: string;
  viewItemURL?: string;
  condition?: string;
  shippingInfo?: any;
}

export interface EbayApiResponse {
  findItemsByKeywordsResponse?: Array<{
    searchResult?: Array<{
      item?: EbayProduct[];
      '@count'?: string;
    }>;
    ack?: Array<string>;
  }>;
}

/**
 * Fetch products from eBay Finding API
 * @param keyword - Search keyword
 * @param maxResults - Maximum number of results (default: 12)
 * @returns Array of eBay products
 */
export async function getEbayProducts(
  keyword: string, 
  maxResults: number = 12
): Promise<EbayProduct[]> {
  try {
    if (!EBAY_CONFIG.appId) {
      console.warn('⚠️ eBay App ID not configured. Using mock data.');
      return [];
    }

    const url = 
      `https://svcs.ebay.com/services/search/FindingService/v1?` +
      `OPERATION-NAME=findItemsByKeywords` +
      `&SERVICE-VERSION=1.13.0` +
      `&SECURITY-APPNAME=${EBAY_CONFIG.appId}` +
      `&RESPONSE-DATA-FORMAT=JSON` +
      `&REST-PAYLOAD` +
      `&keywords=${encodeURIComponent(keyword)}` +
      `&paginationInput.entriesPerPage=${maxResults}` +
      `&sortOrder=BestMatch`;

    console.log('🔍 Fetching from eBay API:', keyword);
    
    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      console.error('❌ eBay API error:', response.status, response.statusText);
      return [];
    }

    const data: EbayApiResponse = await response.json();
    
    const items = data.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item || [];
    const ack = data.findItemsByKeywordsResponse?.[0]?.ack?.[0];
    
    if (ack === 'Success') {
      console.log(`✅ eBay API: Found ${items.length} items for "${keyword}"`);
      return items;
    } else {
      console.warn('⚠️ eBay API returned non-success:', ack);
      return [];
    }
    
  } catch (error) {
    console.error('❌ Error fetching from eBay API:', error);
    return [];
  }
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
): Promise<EbayProduct[]> {
  try {
    const results = await Promise.all(
      keywords.map(keyword => getEbayProducts(keyword, perKeyword))
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
export async function getTrendingProducts(): Promise<EbayProduct[]> {
  const dayOfWeek = new Date().getDay();
  
  const categoryKeywords = [
    'iPhone 15 Pro',           // Sunday
    'PlayStation 5',           // Monday  
    'Nike Air Jordan',         // Tuesday
    'MacBook Pro M3',          // Wednesday
    'Samsung Galaxy S24',      // Thursday
    'Nintendo Switch OLED',    // Friday
    'Apple Watch Series 9'     // Saturday
  ];
  
  const keyword = categoryKeywords[dayOfWeek];
  console.log(`📅 Today's trending category: ${keyword}`);
  
  return getEbayProducts(keyword, 8);
}
