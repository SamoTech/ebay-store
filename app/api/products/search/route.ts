import { NextRequest, NextResponse } from 'next/server';
import { searchEbayProducts } from '../../../../lib/ebay-api';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');
  if (!query) {
    return NextResponse.json({ error: 'Missing q parameter' }, { status: 400 });
  }

  try {
    const data = await searchEbayProducts(query);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products', detail: String(error) }, { status: 500 });
  }
}
