'use client';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useCookieConsent } from '@/lib/cookie-consent';

export default function VercelAnalytics() {
  const consent = useCookieConsent();

  if (consent?.analytics !== true) return null;

  return (
    <>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
