'use client';

import Script from 'next/script';
import { useCookieConsent } from '@/lib/cookie-consent';

export default function AffiliateTracking() {
  const consent = useCookieConsent();

  if (consent?.affiliate !== true) return null;

  return (
    <>
      <Script id="epn-config" strategy="afterInteractive">
        {`window._epn = {campaign: 5338903178};`}
      </Script>
      <Script
        src="https://epnt.ebay.com/static/epn-smart-tools.js"
        strategy="afterInteractive"
      />
    </>
  );
}
