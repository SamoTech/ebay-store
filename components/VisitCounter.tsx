'use client';

import { useEffect, useState } from 'react';
import { formatVisitCount } from '@/lib/visit-format';

type VisitResponse = { ok?: boolean; count?: number | null };

export default function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    let active = true;

    async function recordVisit(): Promise<void> {
      try {
        const response = await fetch('/api/visits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
          cache: 'no-store',
          keepalive: true,
        });

        if (!response.ok) {
          if (active) setAvailable(false);
          return;
        }

        const data = (await response.json()) as VisitResponse;
        if (!active) return;

        if (typeof data.count === 'number' && Number.isSafeInteger(data.count) && data.count >= 0) {
          setCount(data.count);
        } else {
          setAvailable(false);
        }
      } catch {
        if (active) setAvailable(false);
      }
    }

    void recordVisit();
    return () => { active = false; };
  }, []);

  if (!available) {
    return <p className="text-center text-gray-500 dark:text-gray-500 text-xs min-h-4" aria-live="polite">Site visits unavailable</p>;
  }

  return (
    <p
      className="text-center text-gray-500 dark:text-gray-500 text-xs min-h-4 tabular-nums"
      aria-label={count === null ? 'Site visits loading' : `Site visits: ${formatVisitCount(count)}`}
      aria-live="polite"
      aria-atomic="true"
    >
      Site visits: {formatVisitCount(count)}
    </p>
  );
}
