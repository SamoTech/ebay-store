'use client';

import Script from 'next/script';
import { useCookieConsent } from '@/lib/cookie-consent';

const GA_MEASUREMENT_ID = 'G-S5PC9TJ65Z';

export default function GoogleAnalytics() {
  const consent = useCookieConsent();

  if (consent?.analytics !== true) return null;

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
