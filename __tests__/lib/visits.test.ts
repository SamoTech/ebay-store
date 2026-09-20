import {
  createVisitWindowKey,
  formatVisitCount,
  getVisitWindow,
  VISIT_WINDOW_MS,
} from '@/lib/visits';

describe('visit counter helpers', () => {
  it('uses a 30-minute deduplication window', () => {
    const now = 1_800_000_000_000;
    expect(getVisitWindow(now)).toBe(Math.floor(now / VISIT_WINDOW_MS));
    expect(getVisitWindow(now + VISIT_WINDOW_MS - 1)).toBe(getVisitWindow(now));
    expect(getVisitWindow(now + VISIT_WINDOW_MS)).toBe(getVisitWindow(now) + 1);
  });

  it('creates a deterministic, non-reversible-looking window key for the same inputs', () => {
    const first = createVisitWindowKey('browser-token', 'fingerprint', 'secret', 1_800_000_000_000);
    const second = createVisitWindowKey('browser-token', 'fingerprint', 'secret', 1_800_000_000_000);
    const different = createVisitWindowKey('other-token', 'fingerprint', 'secret', 1_800_000_000_000);

    expect(first).toHaveLength(64);
    expect(first).toBe(second);
    expect(first).not.toBe(different);
  });

  it('formats visit counts without fabricating a value', () => {
    expect(formatVisitCount(0)).toBe('0');
    expect(formatVisitCount(12458)).toBe('12,458');
    expect(formatVisitCount('9876543')).toBe('9,876,543');
    expect(formatVisitCount(null)).toBe('—');
    expect(formatVisitCount('not-a-count')).toBe('—');
  });
});
