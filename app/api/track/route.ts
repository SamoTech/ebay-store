import { NextRequest, NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '../../../lib/server/jsonStore';

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
  const payload = (await request.json()) as StoredEvent;

  const store = await readJsonFile<AnalyticsStore>('analytics-events.json', { events: [] });
  store.events.push({
    ...payload,
    timestamp: payload.timestamp || new Date().toISOString(),
  });

  if (store.events.length > MAX_EVENTS) {
    store.events = store.events.slice(store.events.length - MAX_EVENTS);
  }

  await writeJsonFile('analytics-events.json', store);
  return NextResponse.json({ ok: true });
}

export async function GET() {
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
