import { createAffiliateUrl, createSearchLink, getCampaignId, isUsingDefaultCampaignId, DEFAULT_CAMPAIGN_ID } from '@/lib/affiliate';

describe('affiliate', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    ['NEXT_PUBLIC_EBAY_CAMPAIGN_ID', 'EBAY_CAMPAIGN_ID'].forEach((key) => {
      if (originalEnv[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = originalEnv[key];
      }
    });
  });

  describe('createAffiliateUrl', () => {
    it('adds the EPN tracking parameters', () => {
      const url = new URL(createAffiliateUrl('https://www.ebay.com/itm/123'));

      expect(url.searchParams.get('mkcid')).toBe('1');
      expect(url.searchParams.get('mkrid')).toBe('711-53200-19255-0');
      expect(url.searchParams.get('siteid')).toBe('0');
      expect(url.searchParams.get('campid')).toBe(DEFAULT_CAMPAIGN_ID);
    });

    it('percent-encodes the custom id (not + or double-encoded)', () => {
      const url = createAffiliateUrl('https://www.ebay.com/itm/123', 'home page/a');

      expect(url).toContain('customid=home%20page%2Fa');
      expect(url).not.toContain('+');
      expect(url).not.toContain('%2520');
    });

    it('keeps existing query parameters', () => {
      const url = createAffiliateUrl('https://www.ebay.com/itm/123?var=red');

      expect(url).toContain('var=red');
      expect(url).toContain('campid=');
    });

    it('returns the input for an invalid URL', () => {
      expect(createAffiliateUrl('not-a-url')).toBe('not-a-url');
    });

    it('honours NEXT_PUBLIC_EBAY_CAMPAIGN_ID', () => {
      process.env.NEXT_PUBLIC_EBAY_CAMPAIGN_ID = '9999999999';

      expect(createAffiliateUrl('https://www.ebay.com/itm/123')).toContain('campid=9999999999');
      expect(isUsingDefaultCampaignId()).toBe(false);
    });

    it('falls back to the default campaign id', () => {
      delete process.env.NEXT_PUBLIC_EBAY_CAMPAIGN_ID;
      delete process.env.EBAY_CAMPAIGN_ID;

      expect(getCampaignId()).toBe(DEFAULT_CAMPAIGN_ID);
      expect(isUsingDefaultCampaignId()).toBe(true);
    });
  });

  describe('createSearchLink', () => {
    it('builds a search URL with affiliate tracking', () => {
      const url = new URL(createSearchLink('gaming laptop'));

      expect(url.searchParams.get('_nkw')).toBe('gaming laptop');
      expect(url.searchParams.get('campid')).toBe(DEFAULT_CAMPAIGN_ID);
    });

    it('encodes spaces as %20, not +', () => {
      expect(createSearchLink('macbook pro')).toContain('_nkw=macbook%20pro');
    });
  });
});
