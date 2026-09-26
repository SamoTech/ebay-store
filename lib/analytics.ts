export type AnalyticsEventName =
  | 'product_impression'
  | 'product_card_click'
  | 'product_view'
  | 'affiliate_outbound_click'
  | 'compare_toggle'
  | 'price_alert_toggle'
  | 'chatbot_opened'
  | 'chatbot_message_sent'
  | 'product_shared'
  | 'social_share'
  | 'link_copied';

export interface AnalyticsEventPayload {
  event: AnalyticsEventName;
  productId?: number;
  source?: string;
  category?: string;
  pageType?: string;
  placement?: string;
  email_domain?: string;
  platform?: string;
  url?: string;
  title?: string;
  error?: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}

function getPageType(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/product/')) return 'product';
  if (pathname.startsWith('/category/')) return 'category';
  if (pathname.startsWith('/blog/')) return 'blog';
  if (pathname.startsWith('/compare')) return 'compare';
  if (pathname.startsWith('/search')) return 'search';
  if (pathname.startsWith('/tools/')) return 'tool';
  if (pathname.startsWith('/research/')) return 'research';
  return 'other';
}

function hasAnalyticsConsent(): boolean {
  try {
    const raw = window.localStorage.getItem('saleh_cookie_consent_v1');
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { analytics?: unknown };
    return parsed.analytics === true;
  } catch {
    return false;
  }
}

export async function trackEvent(payload: AnalyticsEventPayload): Promise<void> {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return;

  const pathname = window.location.pathname;
  const normalizedPayload = {
    ...payload,
    pageType: payload.pageType || getPageType(pathname),
    pathname,
    timestamp: new Date().toISOString(),
  };

  const body = JSON.stringify(normalizedPayload);

  try {
    const gtag = (window as Window & {
      gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    }).gtag;

    if (typeof gtag === 'function') {
      gtag('event', normalizedPayload.event, {
        product_id: normalizedPayload.productId,
        source: normalizedPayload.source,
        category: normalizedPayload.category,
        page_type: normalizedPayload.pageType,
        placement: normalizedPayload.placement,
      });
    }
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon('/api/track', blob);
      return;
    }

    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
  } catch {
    // Ignore tracking failures
  }
}
