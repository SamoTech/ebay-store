'use client';

import { useSyncExternalStore } from 'react';

export const COOKIE_CONSENT_STORAGE_KEY = 'saleh_cookie_consent_v1';

export type CookieConsent = {
  analytics: boolean;
  affiliate: boolean;
};

export const DEFAULT_COOKIE_CONSENT: CookieConsent = {
  analytics: false,
  affiliate: false,
};

let cachedRaw: string | null = null;
let cachedConsent: CookieConsent | null = null;

function parse(raw: string | null): CookieConsent | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    if (typeof parsed.analytics !== 'boolean' || typeof parsed.affiliate !== 'boolean') {
      return null;
    }
    return { analytics: parsed.analytics, affiliate: parsed.affiliate };
  } catch {
    return null;
  }
}

export function getCookieConsentSnapshot(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  if (raw === cachedRaw) return cachedConsent;
  cachedRaw = raw;
  cachedConsent = parse(raw);
  return cachedConsent;
}

export function subscribeToCookieConsent(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const onConsent = () => callback();
  const onStorage = (event: StorageEvent) => {
    if (event.key === COOKIE_CONSENT_STORAGE_KEY) callback();
  };
  window.addEventListener('saleh-cookie-consent', onConsent);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener('saleh-cookie-consent', onConsent);
    window.removeEventListener('storage', onStorage);
  };
}

export function useCookieConsent(): CookieConsent | null {
  return useSyncExternalStore(
    subscribeToCookieConsent,
    getCookieConsentSnapshot,
    () => null,
  );
}
