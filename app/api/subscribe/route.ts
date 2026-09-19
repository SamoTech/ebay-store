import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '../../../lib/server/jsonStore';
import { getIdentifier, rateLimit } from '../../../lib/rate-limit';

export const dynamic = 'force-dynamic';

interface Subscriber {
  email: string;
  source: string;
  subscribedAt: string;
}

interface SubscriberStore {
  subscribers: Subscriber[];
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/subscribe — newsletter signup.
 *
 * Stores the address locally (best effort) and forwards it to Web3Forms when
 * `WEB3FORMS_ACCESS_KEY` is configured, so the signup still works if either
 * storage path is unavailable.
 */
export async function POST(request: Request) {
  const identifier = `subscribe:${getIdentifier(request as never)}`;
  const limit = rateLimit(identifier, 5, 60 * 1000);

  if (!limit.success) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  let body: { email?: unknown; source?: unknown };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const source = typeof body.source === 'string' && body.source.trim() ? body.source.trim() : 'website';

  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ ok: false, error: 'A valid email is required' }, { status: 400 });
  }

  const store = await readJsonFile<SubscriberStore>('subscribers.json', { subscribers: [] });
  const alreadySubscribed = store.subscribers.some((s) => s.email === email);

  if (!alreadySubscribed) {
    store.subscribers.push({ email, source, subscribedAt: new Date().toISOString() });
    if (store.subscribers.length > 10_000) {
      store.subscribers = store.subscribers.slice(-10_000);
    }
  }

  const persisted = alreadySubscribed
    ? true
    : await writeJsonFile('subscribers.json', store);

  const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (web3formsKey) {
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3formsKey,
          subject: 'New DealsHub subscriber',
          email,
          source,
        }),
      });
    } catch {
      // The local record is the source of truth; email delivery is best effort.
    }
  }

  return NextResponse.json({ ok: true, persisted, alreadySubscribed });
}
