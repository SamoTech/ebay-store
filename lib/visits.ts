import { createHmac, randomBytes } from 'node:crypto';

export const VISIT_WINDOW_MS = 30 * 60 * 1000;
const VISIT_COUNT_TIMEOUT_MS = 2500;

interface SupabaseRpcResponse {
  data?: unknown;
  error?: { message?: string };
}

function getSupabaseConfig(): { url: string; secretKey: string } | null {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) return null;
  return { url, secretKey };
}

function parseCount(value: unknown): number | null {
  const candidate = Array.isArray(value) && value.length > 0
    ? (value[0] as Record<string, unknown>)?.total_visits ?? value[0]
    : value;

  if (typeof candidate === 'number' && Number.isSafeInteger(candidate) && candidate >= 0) return candidate;
  if (typeof candidate === 'string' && /^\d+$/.test(candidate)) {
    const parsed = Number(candidate);
    return Number.isSafeInteger(parsed) ? parsed : null;
  }
  return null;
}

async function callRpc(
  functionName: 'record_site_visit' | 'get_site_visit_count',
  body: Record<string, unknown>,
): Promise<number | null> {
  const config = getSupabaseConfig();
  if (!config) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), VISIT_COUNT_TIMEOUT_MS);

  try {
    const response = await fetch(`${config.url}/rest/v1/rpc/${functionName}`, {
      method: 'POST',
      headers: {
        apikey: config.secretKey,
        Authorization: `Bearer ${config.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) return null;
    const payload = (await response.json()) as SupabaseRpcResponse;
    if (payload.error) return null;
    return parseCount(payload.data);
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function getVisitWindow(now = Date.now()): number {
  return Math.floor(now / VISIT_WINDOW_MS);
}

export function createVisitWindowKey(
  anonymousToken: string,
  requestFingerprint: string,
  secret: string,
  now = Date.now(),
): string {
  const window = getVisitWindow(now);
  return createHmac('sha256', secret)
    .update(`v1|${window}|${anonymousToken}|${requestFingerprint}`)
    .digest('hex');
}

export function createAnonymousToken(): string {
  return randomBytes(24).toString('base64url');
}

export function formatVisitCount(count: number | string | null): string {
  if (count === null) return '—';
  const normalized = typeof count === 'number' ? count.toString() : count;
  if (!/^\d+$/.test(normalized)) return '—';
  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export async function recordSiteVisit(windowKey: string): Promise<number | null> {
  return callRpc('record_site_visit', { p_window_key: windowKey });
}

export async function getSiteVisitCount(): Promise<number | null> {
  return callRpc('get_site_visit_count', {});
}
