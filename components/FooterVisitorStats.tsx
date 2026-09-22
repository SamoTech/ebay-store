'use client';

import { useEffect, useState } from 'react';

type VisitorStats = {
  configured: boolean;
  visitors?: number;
  activeNow?: number;
};

export default function FooterVisitorStats() {
  const [stats, setStats] = useState<VisitorStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/analytics/visitors', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : { configured: false }))
      .then((data: VisitorStats) => {
        if (!cancelled && data.configured) setStats(data);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  if (!stats?.configured) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-gray-500 text-sm" aria-label="Site visitor statistics">
      <span>Visitors (30 days): {stats.visitors?.toLocaleString() ?? '—'}</span>
      <span>Online now: {stats.activeNow?.toLocaleString() ?? '—'}</span>
    </div>
  );
}
