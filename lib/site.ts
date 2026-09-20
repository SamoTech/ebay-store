/** Central site URL helpers for SEO and absolute URLs. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saleh-store.com').replace(/\/$/, '');

export function absoluteUrl(path = ''): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}