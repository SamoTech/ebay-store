import { currencySymbol, formatPrice } from '@/lib/utils/price';

describe('price utils', () => {
  describe('currencySymbol', () => {
    it('maps common currencies to symbols', () => {
      expect(currencySymbol('USD')).toBe('$');
      expect(currencySymbol('EUR')).toBe('€');
      expect(currencySymbol('GBP')).toBe('£');
      expect(currencySymbol('JPY')).toBe('¥');
    });

    it('is case-insensitive and defaults to USD', () => {
      expect(currencySymbol('gbp')).toBe('£');
      expect(currencySymbol()).toBe('$');
    });

    it('falls back to the currency code for unknown currencies', () => {
      expect(currencySymbol('SEK')).toBe('SEK ');
    });
  });

  describe('formatPrice', () => {
    it('formats with two decimals and the currency symbol', () => {
      expect(formatPrice(1999)).toBe('$1999.00');
      expect(formatPrice(149.5, 'GBP')).toBe('£149.50');
      expect(formatPrice(0, 'EUR')).toBe('€0.00');
    });

    it('never renders NaN', () => {
      expect(formatPrice(Number.NaN)).toBe('$0.00');
      expect(formatPrice(Number.POSITIVE_INFINITY, 'EUR')).toBe('€0.00');
    });
  });
});
