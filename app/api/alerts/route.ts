import { NextRequest, NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '../../../lib/server/jsonStore';

interface AlertRecord {
  email: string;
  productIds: number[];
  updatedAt: string;
}

interface AlertStore {
  alerts: AlertRecord[];
}

export async function POST(request: NextRequest) {
  const { email, productId, enabled } = (await request.json()) as {
    email?: string;
    productId?: number;
    enabled?: boolean;
  };

  if (!email || !email.includes('@') || !productId) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const store = await readJsonFile<AlertStore>('price-alerts.json', { alerts: [] });

  const existing = store.alerts.find((alert) => alert.email === normalizedEmail);

  if (!existing) {
    store.alerts.push({
      email: normalizedEmail,
      productIds: enabled ? [productId] : [],
      updatedAt: new Date().toISOString(),
    });
  } else {
    const set = new Set(existing.productIds);
    if (enabled) {
      set.add(productId);
    } else {
      set.delete(productId);
    }
    existing.productIds = [...set];
    existing.updatedAt = new Date().toISOString();
  }

  await writeJsonFile('price-alerts.json', store);
  return NextResponse.json({ ok: true });
}
