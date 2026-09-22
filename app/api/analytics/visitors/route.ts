import { createSign } from 'node:crypto';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type ServiceAccount = {
  client_email: string;
  private_key: string;
  token_uri?: string;
};

function base64Url(value: string) {
  return Buffer.from(value).toString('base64url');
}

async function getAccessToken(account: ServiceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64Url(JSON.stringify({
    iss: account.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: account.token_uri || 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${payload}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const assertion = `${unsigned}.${signer.sign(account.private_key, 'base64url')}`;

  const response = await fetch(account.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    cache: 'no-store',
  });

  if (!response.ok) throw new Error('Google OAuth token request failed');
  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('Google OAuth response did not include an access token');
  return data.access_token;
}

async function runReport(accessToken: string, propertyId: string, realtime = false) {
  const endpoint = realtime
    ? `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runRealtimeReport`
    : `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

  const body = realtime
    ? { metrics: [{ name: 'activeUsers' }] }
    : {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [{ name: 'totalUsers' }],
      };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`Google Analytics Data API failed: ${response.status}`);

  const data = (await response.json()) as {
    rows?: Array<{ metricValues?: Array<{ value?: string }> }>;
  };
  return Number(data.rows?.[0]?.metricValues?.[0]?.value || 0);
}

export async function GET() {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const credentials = process.env.GA4_SERVICE_ACCOUNT_JSON;
  const propertyIdPresent = Boolean(propertyId);
  const serviceAccountPresent = Boolean(credentials);

  if (!propertyIdPresent || !serviceAccountPresent) {
    return NextResponse.json(
      { configured: false, propertyIdPresent, serviceAccountPresent },
      { status: 503 },
    );
  }

  if (!/^\d+$/.test(propertyId!)) {
    return NextResponse.json(
      { configured: false, propertyIdPresent: true, serviceAccountPresent: true, error: 'Invalid GA4 property ID' },
      { status: 500 },
    );
  }

  try {
    const account = JSON.parse(credentials!) as ServiceAccount;
    if (!account.client_email || !account.private_key) throw new Error('Invalid service account');

    const accessToken = await getAccessToken(account);
    const [visitors, activeNow] = await Promise.all([
      runReport(accessToken, propertyId!),
      runReport(accessToken, propertyId!, true),
    ]);

    return NextResponse.json(
      { configured: true, visitors, activeNow },
      { headers: { 'cache-control': 'public, s-maxage=300, stale-while-revalidate=600' } },
    );
  } catch {
    return NextResponse.json(
      { configured: false, propertyIdPresent: true, serviceAccountPresent: true },
      { status: 502 },
    );
  }
}
