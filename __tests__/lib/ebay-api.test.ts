import {
  createAffiliateUrl,
  getEbayIntegrationStatus,
  mapBrowseItemToProduct,
  mapFindingItemToProduct,
  type EbayItemSummary,
} from '@/lib/ebay-api';
import { LIVE_PRODUCT_ID_OFFSET, isLiveProduct, liveProductId } from '@/lib/products';

const CREDENTIAL_KEYS = [
  'EBAY_CLIENT_ID',
  'EBAY_CLIENT_SECRET',
  'EBAY_APP_ID',
  'EBAY_CAMPAIGN_ID',
  'NEXT_PUBLIC_EBAY_CAMPAIGN_ID',
];

describe('ebay-api', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    CREDENTIAL_KEYS.forEach((key) => {
      if (originalEnv[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = originalEnv[key];
      }
    });
  });

  describe('createAffiliateUrl', () => {
    it('adds required tracking parameters', () => {
      const url = createAffiliateUrl(
        'https://www.ebay.com/itm/123456789',
        'test-category'
      );

      expect(url).toContain('mkcid=1');
      expect(url).toContain('mkrid=711-53200-19255-0');
      expect(url).toContain('siteid=0');
      expect(url).toContain('campid=5338903178');
      expect(url).toContain('customid=test-category');
    });

    it('handles URLs without custom ID', () => {
      const url = createAffiliateUrl('https://www.ebay.com/itm/123456789');
      
      expect(url).toContain('campid=5338903178');
      expect(url).not.toContain('customid');
    });

    it('preserves existing query parameters', () => {
      const url = createAffiliateUrl(
        'https://www.ebay.com/itm/123456789?var=red'
      );
      
      expect(url).toContain('var=red');
      expect(url).toContain('campid=5338903178');
    });

    it('handles invalid URLs gracefully', () => {
      const invalidUrl = 'not-a-valid-url';
      const result = createAffiliateUrl(invalidUrl);
      
      expect(result).toBe(invalidUrl);
    });

    it('encodes custom ID properly (no double encoding)', () => {
      const url = createAffiliateUrl(
        'https://www.ebay.com/itm/123456789',
        'test category with spaces'
      );
      
      expect(url).toContain('customid=test%20category%20with%20spaces');
      expect(url).not.toContain('%2520');
    });

    it('uses the configured campaign ID instead of the built-in default', () => {
      process.env.NEXT_PUBLIC_EBAY_CAMPAIGN_ID = '1234567890';

      const url = createAffiliateUrl('https://www.ebay.com/itm/123456789');

      expect(url).toContain('campid=1234567890');
      expect(url).not.toContain('campid=5338903178');
    });
  });

  describe('getEbayIntegrationStatus', () => {
    it('detects client credentials mode', () => {
      process.env.EBAY_CLIENT_ID = 'test-client-id';
      process.env.EBAY_CLIENT_SECRET = 'test-client-secret';
      delete process.env.EBAY_APP_ID;

      const status = getEbayIntegrationStatus();
      
      expect(status.mode).toBe('client_credentials');
      expect(status.marketplaceId).toBe('EBAY_US');
      expect(status.missing).toHaveLength(0);
      expect(status.apiType).toBe('Browse');
    });

    it('identifies missing credentials', () => {
      delete process.env.EBAY_CLIENT_ID;
      delete process.env.EBAY_CLIENT_SECRET;
      delete process.env.EBAY_APP_ID;

      const status = getEbayIntegrationStatus();
      
      expect(status.mode).toBe('disabled');
      expect(status.missing).toContain('EBAY_CLIENT_ID');
      expect(status.missing).toContain('EBAY_CLIENT_SECRET');
    });

    it('falls back to the Finding API when an app id is set', () => {
      delete process.env.EBAY_CLIENT_ID;
      delete process.env.EBAY_CLIENT_SECRET;
      process.env.EBAY_APP_ID = 'legacy-app-id';

      const status = getEbayIntegrationStatus();

      expect(status.mode).toBe('finding_api');
      expect(status.apiType).toBe('Finding');
    });
  });

  describe('live product IDs', () => {
    it('assigns IDs above the static catalog range', () => {
      const item: EbayItemSummary = {
        itemId: 'v1|123456789|0',
        title: 'Live item',
        price: { value: '49.99', currency: 'USD' },
        itemWebUrl: 'https://www.ebay.com/itm/123456789',
      };

      const product = mapBrowseItemToProduct(item, liveProductId(0), 'Search');

      expect(product).not.toBeNull();
      expect(product!.id).toBeGreaterThanOrEqual(LIVE_PRODUCT_ID_OFFSET);
      expect(isLiveProduct(product!)).toBe(true);
      expect(product!.isLive).toBe(true);
      expect(product!.affiliateLink).toContain('campid=');
    });

    it('maps condition and shipping when eBay returns them', () => {
      const item: EbayItemSummary = {
        itemId: 'v1|123456789|0',
        title: 'Live item',
        price: { value: '49.99', currency: 'EUR' },
        itemWebUrl: 'https://www.ebay.com/itm/123456789',
        condition: 'Pre-owned',
        shippingOptions: [{ shippingCost: { value: '0.00', currency: 'EUR' } }],
      };

      const product = mapBrowseItemToProduct(item, liveProductId(3), 'Search');

      expect(product!.currency).toBe('EUR');
      expect(product!.condition).toBe('Pre-owned');
      expect(product!.shipping).toBe('Free shipping');
    });

    it('drops items without a usable price', () => {
      const item: EbayItemSummary = {
        itemId: 'v1|1|0',
        title: 'No price',
        itemWebUrl: 'https://www.ebay.com/itm/1',
      };

      expect(mapBrowseItemToProduct(item, liveProductId(0), 'Search')).toBeNull();
    });

    it('maps legacy Finding API items to live products', () => {
      const product = mapFindingItemToProduct(
        {
          title: 'Legacy item',
          price: '19.99',
          image: 'https://i.ebayimg.com/images/g/abc/s-l225.jpg',
          itemId: 'abc',
          viewItemURL: 'https://www.ebay.com/itm/abc',
          condition: 'New',
        },
        liveProductId(1),
        'Search',
      );

      expect(product!.id).toBeGreaterThanOrEqual(LIVE_PRODUCT_ID_OFFSET);
      expect(product!.isLive).toBe(true);
    });
  });

  describe('static catalog guard', () => {
    it('never marks static catalog items as live', () => {
      expect(isLiveProduct({ id: 1 })).toBe(false);
      expect(isLiveProduct({ id: 999 })).toBe(false);
      expect(isLiveProduct({ id: 1000 })).toBe(true);
    });
  });
});
