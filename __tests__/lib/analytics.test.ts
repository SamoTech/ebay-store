/**
 * @jest-environment jsdom
 */
import { trackEvent } from '@/lib/analytics';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

describe('trackEvent', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(
      'saleh_cookie_consent_v1',
      JSON.stringify({ analytics: true, affiliate: true }),
    );

    Object.defineProperty(navigator, 'sendBeacon', {
      configurable: true,
      value: jest.fn(() => true),
    });

    (window as Window & {
      gtag?: (...args: unknown[]) => void;
    }).gtag = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  });

  it('sends standardized affiliate attribution to first-party analytics and GA4', async () => {
    window.history.pushState({}, '', '/category/electronics');

    await trackEvent({
      event: 'affiliate_outbound_click',
      productId: 42,
      source: 'product_card',
      category: 'Electronics',
      placement: 'product_card_cta',
      url: 'https://www.ebay.com/itm/42',
    });

    const sendBeacon = navigator.sendBeacon as jest.Mock;
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(sendBeacon).toHaveBeenCalledWith('/api/track', expect.any(Blob));

    expect(window.gtag).toHaveBeenCalledWith(
      'event',
      'affiliate_outbound_click',
      expect.objectContaining({
        product_id: 42,
        source: 'product_card',
        category: 'Electronics',
        page_type: 'category',
        placement: 'product_card_cta',
      }),
    );
  });

  it('does not send analytics without analytics consent', async () => {
    window.localStorage.setItem(
      'saleh_cookie_consent_v1',
      JSON.stringify({ analytics: false, affiliate: true }),
    );

    await trackEvent({
      event: 'affiliate_outbound_click',
      productId: 42,
      source: 'product_page',
      placement: 'primary_cta',
    });

    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(window.gtag).not.toHaveBeenCalled();
  });
});
