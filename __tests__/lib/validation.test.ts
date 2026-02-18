import { validatePriceAlertBody, validateSearchQuery } from '@/src/lib/validation';

describe('validation helpers', () => {
  it('validates search query', () => {
    const params = new URLSearchParams({ q: 'laptop', limit: '12', offset: '0' });
    const result = validateSearchQuery(params);
    expect(result.success).toBe(true);
  });

  it('rejects invalid price alert body', () => {
    const result = validatePriceAlertBody({ email: 'invalid', productId: 0, targetPrice: -1 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues.length).toBeGreaterThan(0);
    }
  });
});
