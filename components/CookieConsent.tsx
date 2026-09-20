'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'saleh_cookie_consent_v1';

type Consent = {
  analytics: boolean;
  affiliate: boolean;
};

const DEFAULT_CONSENT: Consent = { analytics: false, affiliate: false };

function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Consent>;
    if (typeof parsed.analytics !== 'boolean' || typeof parsed.affiliate !== 'boolean') {
      return null;
    }
    return { analytics: parsed.analytics, affiliate: parsed.affiliate };
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(DEFAULT_CONSENT);

  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    setDraft(stored ?? DEFAULT_CONSENT);
  }, []);

  function save(next: Consent) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Consent remains session-only if storage is unavailable.
    }
    setConsent(next);
    setDraft(next);
    setOpen(false);
    window.dispatchEvent(new CustomEvent('saleh-cookie-consent', { detail: next }));
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
          See our <a href="/cookies" className="text-blue-600 underline dark:text-blue-400">Cookie Policy</a>.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => save({ analytics: true, affiliate: true })} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Accept All
          </button>
          <button type="button" onClick={() => save(DEFAULT_CONSENT)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700">
            Reject Non-Essential
          </button>
          <button type="button" onClick={() => { setDraft(DEFAULT_CONSENT); setOpen(true); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700">
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
