import { createAffiliateUrl, getEbayIntegrationStatus } from '@/lib/ebay-api';

describe('ebay-api', () => {
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

    it('encodes custom ID properly', () => {
      const url = createAffiliateUrl(
        'https://www.ebay.com/itm/123456789',
        'test category with spaces'
      );
      
      expect(url).toContain('customid=test%20category%20with%20spaces');
    });
  });

  describe('getEbayIntegrationStatus', () => {
    it('detects client credentials mode', () => {
      const status = getEbayIntegrationStatus();
      
      expect(status.mode).toBe('client_credentials');
      expect(status.marketplaceId).toBe('EBAY_US');
      expect(status.missing).toHaveLength(0);
    });

    it('identifies missing credentials', () => {
      const originalClientId = process.env.EBAY_CLIENT_ID;
      delete process.env.EBAY_CLIENT_ID;
      
      const status = getEbayIntegrationStatus();
      
      expect(status.mode).toBe('disabled');
      expect(status.missing).toContain('EBAY_CLIENT_ID');
      
      process.env.EBAY_CLIENT_ID = originalClientId;
    });
  });
});
