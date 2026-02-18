import { NextResponse } from 'next/server';
import { asValidationErrorResponse, validatePriceAlertBody } from '@/src/lib/validation';

interface StoredAlert {
  id: number;
  email: string;
  productId: number;
  targetPrice: number;
  createdAt: string;
  status: 'active';
}

const alerts: StoredAlert[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validatePriceAlertBody(body);

    if (!validation.success) {
      return NextResponse.json(asValidationErrorResponse(validation), { status: 400 });
    }

    const alert: StoredAlert = {
      id: Date.now(),
      email: validation.data.email,
      productId: validation.data.productId,
      targetPrice: validation.data.targetPrice,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    alerts.push(alert);

    return NextResponse.json({ success: true, message: 'Price alert created successfully', alertId: alert.id });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create price alert' }, { status: 500 });
  }
}
