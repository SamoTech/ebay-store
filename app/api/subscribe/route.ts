import { NextRequest, NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '../../../lib/server/jsonStore';

interface Subscriber {
  email: string;
  source: string;
  createdAt: string;
}

interface SubscriberStore {
  subscribers: Subscriber[];
}

export async function POST(request: NextRequest) {
  const { email, source } = (await request.json()) as { email?: string; source?: string };

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const store = await readJsonFile<SubscriberStore>('subscribers.json', { subscribers: [] });

  const alreadyExists = store.subscribers.some((subscriber) => subscriber.email === normalizedEmail);
  if (!alreadyExists) {
    store.subscribers.push({
      email: normalizedEmail,
      source: source || 'unknown',
      createdAt: new Date().toISOString(),
    });
    await writeJsonFile('subscribers.json', store);
  }

  return NextResponse.json({ ok: true, alreadyExists });
}
