export type AnalyticsEventName =
  | 'product_impression'
  | 'product_card_click'
  | 'product_view'
  | 'affiliate_outbound_click'
  | 'compare_toggle'
  | 'newsletter_submit'
  | 'newsletter_popup_shown'
  | 'newsletter_popup_closed'
  | 'newsletter_popup_dismissed'
  | 'newsletter_signup_attempt'
  | 'newsletter_signup_success'
  | 'newsletter_signup_error'
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
  email_domain?: string;
  platform?: string;
  url?: string;
  title?: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}

export async function trackEvent(payload: AnalyticsEventPayload): Promise<void> {
  if (typeof window === 'undefined') return;

  const body = JSON.stringify({
    ...payload,
    pathname: window.location.pathname,
    timestamp: new Date().toISOString(),
  });

  try {
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
