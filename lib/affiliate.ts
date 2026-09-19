/**
 * eBay Partner Network (EPN) affiliate link configuration.
 *
 * All outbound eBay links are built here so the tracking parameters live in
 * exactly one place. The campaign ID can be overridden per environment:
 *
 * - `NEXT_PUBLIC_EBAY_CAMPAIGN_ID` — recommended, works in server and client
 *   bundles (Next.js inlines NEXT_PUBLIC_* at build time).
 * - `EBAY_CAMPAIGN_ID` — server-side alias, used where no `window` exists
 *   (API routes, server components, cron jobs).
 *
 * NOTE: only literal `process.env.NEXT_PUBLIC_X` references are inlined by
 * Next.js into client bundles, so never read these with a computed key.
 */

/** Fallback campaign ID shipped with the project. */
export const DEFAULT_CAMPAIGN_ID = '5338903178';

/** eBay site ID (0 = eBay US). */
export const SITEID = '0';

/** eBay marketplace rotation ID for the default EPN rotation. */
export const MKRID = '711-53200-19255-0';

/** `mkcid=1` = affiliate / partner network link. */
export const MKCID = '1';

function clean(value: string | undefined): string | undefined {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed.length > 0 ? trimmed : undefined;
}

function readPublicCampaignId(): string | undefined {
  return typeof process !== 'undefined' && process.env
    ? clean(process.env.NEXT_PUBLIC_EBAY_CAMPAIGN_ID)
    : undefined;
}

function readServerCampaignId(): string | undefined {
  // Never read server-only variables in the browser bundle.
  if (typeof window !== 'undefined') return undefined;
  return typeof process !== 'undefined' && process.env
    ? clean(process.env.EBAY_CAMPAIGN_ID)
    : undefined;
}

/** Resolve the campaign ID (public value first, then the server-side alias). */
export function getCampaignId(): string {
  return readPublicCampaignId() ?? readServerCampaignId() ?? DEFAULT_CAMPAIGN_ID;
}

/** True when no campaign ID was configured and the built-in default is used. */
export function isUsingDefaultCampaignId(): boolean {
  return getCampaignId() === DEFAULT_CAMPAIGN_ID;
}

/**
 * `URLSearchParams` encodes spaces as `+`, while eBay (and the rest of the
 * web) expects percent-encoding. A literal `+` can only come from a space,
 * because real plus signs are encoded as `%2B`.
 */
function encodeQuery(params: URLSearchParams): string {
  return params.toString().replace(/\+/g, '%20');
}

/** Build an affiliate-tracked eBay search URL. */
export function createSearchLink(keyword: string, customId?: string): string {
  const params = new URLSearchParams();
  params.set('_nkw', keyword);
  params.set('mkcid', MKCID);
  params.set('mkrid', MKRID);
  params.set('siteid', SITEID);
  params.set('campid', getCampaignId());

  if (customId) {
    params.set('customid', customId);
  }

  return `https://www.ebay.com/sch/i.html?${encodeQuery(params)}`;
}

/** Add affiliate tracking parameters to an existing eBay item URL. */
export function createAffiliateUrl(ebayUrl: string, customId?: string): string {
  try {
    const url = new URL(ebayUrl);
    url.searchParams.set('mkcid', MKCID);
    url.searchParams.set('mkrid', MKRID);
    url.searchParams.set('siteid', SITEID);
    url.searchParams.set('campid', getCampaignId());

    if (customId) {
      url.searchParams.set('customid', customId);
    }

    url.search = encodeQuery(url.searchParams);
    return url.toString();
  } catch {
    return ebayUrl;
  }
}
