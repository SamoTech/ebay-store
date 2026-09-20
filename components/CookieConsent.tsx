'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  DEFAULT_COOKIE_CONSENT,
  type CookieConsent as CookieConsentValue,
  COOKIE_CONSENT_STORAGE_KEY,
  useCookieConsent,
} from '@/lib/cookie-consent';

export default function CookieConsent() {
  const consent = useCookieConsent();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CookieConsentValue>(DEFAULT_COOKIE_CONSENT);

  function save(next: CookieConsentValue) {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Consent remains session-only if storage is unavailable.
    }

    const previous = consent;
    setDraft(next);
    setOpen(false);
    window.dispatchEvent(new CustomEvent('saleh-cookie-consent', { detail: next }));

    // Reload when changing an already-decided category so third-party scripts
    // are removed from the current document instead of merely being disabled.
    if (previous && (previous.analytics !== next.analytics || previous.affiliate !== next.affiliate)) {
      window.location.reload();
    }
  }

  if (consent === null && !open) {
    return (
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="cookie-consent-title"
        className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
      >
        <h2 id="cookie-consent-title" className="text-lg font-semibold text-gray-900 dark:text-white">
          Cookies & privacy choices
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          We use cookies and similar technologies to improve your experience, analyze site traffic,
          and support affiliate attribution. Non-essential technologies are optional.
          See our <Link href="/cookies" className="text-blue-600 underline dark:text-blue-400">Cookie Policy</Link>.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => save({ analytics: true, affiliate: true })} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Accept All
          </button>
          <button type="button" onClick={() => save(DEFAULT_COOKIE_CONSENT)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700">
            Reject Non-Essential
          </button>
          <button type="button" onClick={() => { setDraft(DEFAULT_COOKIE_CONSENT); setOpen(true); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700">
            Manage Preferences
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {consent && !open && (
        <button
          type="button"
          onClick={() => { setDraft(consent); setOpen(true); }}
          className="fixed bottom-4 left-4 z-[99] rounded-full border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-lg hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          aria-label="Open cookie preferences"
        >
          Cookie settings
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[101] flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="cookie-preferences-title">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
            <h2 id="cookie-preferences-title" className="text-xl font-semibold text-gray-900 dark:text-white">
              Cookie preferences
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Choose which non-essential technologies you allow. Essential site functionality remains available.
            </p>

            <label className="mt-5 flex items-start gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <input type="checkbox" checked disabled className="mt-1" />
              <span>
                <span className="block font-medium text-gray-900 dark:text-white">Essential</span>
                <span className="block text-sm text-gray-600 dark:text-gray-300">Required for basic site operation and cannot be disabled here.</span>
              </span>
            </label>

            <label className="mt-3 flex items-start gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <input type="checkbox" checked={draft.analytics} onChange={(e) => setDraft({ ...draft, analytics: e.target.checked })} className="mt-1" />
              <span>
                <span className="block font-medium text-gray-900 dark:text-white">Analytics</span>
                <span className="block text-sm text-gray-600 dark:text-gray-300">Google Analytics measurement.</span>
              </span>
            </label>

            <label className="mt-3 flex items-start gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <input type="checkbox" checked={draft.affiliate} onChange={(e) => setDraft({ ...draft, affiliate: e.target.checked })} className="mt-1" />
              <span>
                <span className="block font-medium text-gray-900 dark:text-white">Affiliate attribution</span>
                <span className="block text-sm text-gray-600 dark:text-gray-300">eBay Partner Network tracking technologies used for qualifying referral attribution.</span>
              </span>
            </label>

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 dark:border-gray-600 dark:text-gray-100">
                Cancel
              </button>
              <button type="button" onClick={() => save(draft)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
