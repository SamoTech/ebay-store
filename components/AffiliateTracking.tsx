'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

type Consent = { analytics: boolean; affiliate: boolean };

const STORAGE_KEY = 'saleh_cookie_consent_v1';

function getConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Consent>;
    if (typeof parsed.analytics !== 'boolean' || typeof parsed.affiliate !== 'boolean') return null;
    return { analytics: parsed.analytics, affiliate: parsed.affiliate };
  } catch {
    return null;
  }
}

export default function AffiliateTracking() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(Boolean(getConsent()?.affiliate));

    const onConsent = (event: Event) => {
      const detail = (event as CustomEvent<Consent>).detail;
      setEnabled(Boolean(detail?.affiliate));
    };

    window.addEventListener('saleh-cookie-consent', onConsent);
    return () => window.removeEventListener('saleh-cookie-consent', onConsent);
  }, []);

  if (!enabled) return null;

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
