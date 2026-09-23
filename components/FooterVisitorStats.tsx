'use client';

import { useEffect, useState } from 'react';

type VisitorStats = {
  configured: boolean;
  visitors?: number;
  activeNow?: number;
};

const REFRESH_INTERVAL_MS = 30_000;

export default function FooterVisitorStats() {
  const [stats, setStats] = useState<VisitorStats | null>(null);

  useEffect(() => {
    if (typeof window.fetch !== 'function') return;

    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const loadStats = async () => {
      try {
        const response = await fetch('/api/analytics/visitors', {
          cache: 'no-store',
        });

        if (!response.ok) return;

        const data = (await response.json()) as VisitorStats;

        if (!cancelled && data.configured) {
          setStats((previous) => ({
            configured: true,
            visitors: data.visitors ?? previous?.visitors,
            activeNow: data.activeNow ?? previous?.activeNow,
          }));
        }
      } catch {
        // Keep the last valid value during temporary API failures.
      }
    };

    void loadStats();
    intervalId = setInterval(() => {
      void loadStats();
    }, REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  if (!stats?.configured) return null;

  return (
    <div
      className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-gray-500"
      aria-label="Site visitor statistics"
    >
      <span>Visitors (30 days): {stats.visitors?.toLocaleString() ?? '—'}</span>
      <span>Online now: {stats.activeNow?.toLocaleString() ?? '—'}</span>
    </div>
  );
}
