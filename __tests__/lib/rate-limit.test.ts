import { rateLimit, resetRateLimit } from '@/lib/rate-limit';

describe('rateLimit', () => {
  const id = 'unit-test-client';

  beforeEach(() => {
    resetRateLimit(id);
  });

  it('allows requests under limit and blocks over limit', () => {
    const first = rateLimit(id, 2, 60_000);
    const second = rateLimit(id, 2, 60_000);
    const third = rateLimit(id, 2, 60_000);

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    expect(third.success).toBe(false);
  });
});
