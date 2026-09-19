import { NextRequest, NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '../../../lib/server/jsonStore';

export const dynamic = 'force-dynamic';

interface StoredEvent {
  event: string;
  productId?: number;
  source?: string;
  category?: string;
  pathname?: string;
  timestamp: string;
}

interface AnalyticsStore {
  events: StoredEvent[];
}

const MAX_EVENTS = 5000;

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as StoredEvent;

    if (!payload?.event || typeof payload.event !== 'string') {
      return NextResponse.json({ ok: false, error: 'Missing event name' }, { status: 400 });
    }

    const store = await readJsonFile<AnalyticsStore>('analytics-events.json', { events: [] });
    store.events.push({
      ...payload,
      timestamp: payload.timestamp || new Date().toISOString(),
    });

    if (store.events.length > MAX_EVENTS) {
      store.events = store.events.slice(store.events.length - MAX_EVENTS);
    }

    // Persistence is best-effort: analytics must never fail the user request
    // (and the filesystem is read-only on some deployments).
    const persisted = await writeJsonFile('analytics-events.json', store);

    return NextResponse.json({ ok: true, persisted });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

/**
 * Read aggregated analytics.
 *
 * Analytics payloads are not public data, so this endpoint requires
 * `ANALYTICS_READ_TOKEN` (via `Authorization: Bearer …` or `?token=`) whenever
 * it is configured. In development the data is returned without a token to
 * keep local tooling simple.
 */
export async function GET(request: NextRequest) {
  const readToken = process.env.ANALYTICS_READ_TOKEN;
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && !readToken) {
    return NextResponse.json(
      { error: 'Analytics read access is not configured' },
      { status: 403 },
    );
  }

  if (readToken) {
    const header = request.headers.get('authorization') ?? '';
    const bearer = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : '';
    // `new URL(request.url)` works for both NextRequest and plain Request
    // objects (unit tests and edge runtimes may hand us the latter).
    const provided = bearer || new URL(request.url).searchParams.get('token') || '';

    if (provided !== readToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const store = await readJsonFile<AnalyticsStore>('analytics-events.json', { events: [] });

  const totals = store.events.reduce<Record<string, number>>((acc, event) => {
    acc[event.event] = (acc[event.event] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    totalEvents: store.events.length,
    totals,
    latest: store.events.slice(-50).reverse(),
  });
}
