import { NextResponse } from 'next/server';
import { asValidationErrorResponse, validatePriceAlertBody } from '@/src/lib/validation';
import { readJsonFile, writeJsonFile } from '../../../lib/server/jsonStore';

export const dynamic = 'force-dynamic';

interface StoredAlert {
  id: number;
  email: string;
  productId: number;
  targetPrice: number;
  createdAt: string;
  status: 'active';
}

interface AlertStore {
  alerts: StoredAlert[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validatePriceAlertBody(body);

    if (!validation.success) {
      return NextResponse.json(asValidationErrorResponse(validation), { status: 400 });
    }

    const store = await readJsonFile<AlertStore>('price-alerts.json', { alerts: [] });

    const alert: StoredAlert = {
      id: Date.now(),
      email: validation.data.email,
      productId: validation.data.productId,
      targetPrice: validation.data.targetPrice,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    store.alerts.push(alert);
    if (store.alerts.length > 5_000) {
      store.alerts = store.alerts.slice(-5_000);
    }

    const persisted = await writeJsonFile('price-alerts.json', store);

    return NextResponse.json({
      success: true,
      message: 'Price alert created successfully',
      alertId: alert.id,
      persisted,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create price alert' }, { status: 500 });
  }
}
