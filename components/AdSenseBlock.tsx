'use client';

import { useEffect, useRef } from 'react';

const ADSENSE_CLIENT = 'ca-pub-3703596518277340';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSenseBlockProps = {
  placement: string;
  className?: string;
};

export default function AdSenseBlock({ placement, className = '' }: AdSenseBlockProps) {
  const adRef = useRef<HTMLModElement>(null);
  const slot = process.env.NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT;

  useEffect(() => {
    if (!slot || !adRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense can reject a request while the page is changing or during local development.
      // Advertising must never break the page itself.
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <aside
      className={`mx-auto w-full max-w-6xl px-4 py-6 ${className}`}
      aria-label="Advertisement"
      data-adsense-placement={placement}
    >
      <div className="min-h-[120px] overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minHeight: 120 }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
