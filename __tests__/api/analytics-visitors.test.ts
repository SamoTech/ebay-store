/**
 * @jest-environment node
 */

jest.mock('node:crypto', () => ({
  createSign: () => ({
    update: jest.fn(),
    end: jest.fn(),
    sign: jest.fn(() => 'signature'),
  }),
}));

describe('/api/analytics/visitors', () => {
  let GET: () => Promise<Response>;
  const originalFetch = global.fetch;
  const originalProperty = process.env.GA4_PROPERTY_ID;
  const originalCredentials = process.env.GA4_SERVICE_ACCOUNT_JSON;

  beforeAll(async () => {
    process.env.GA4_PROPERTY_ID = '123456789';
    process.env.GA4_SERVICE_ACCOUNT_JSON = JSON.stringify({
      client_email: 'analytics@example.iam.gserviceaccount.com',
      private_key: 'fake-private-key',
      token_uri: 'https://oauth2.googleapis.com/token',
    });
    ({ GET } = await import('@/app/api/analytics/visitors/route'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
    if (originalProperty === undefined) delete process.env.GA4_PROPERTY_ID;
    else process.env.GA4_PROPERTY_ID = originalProperty;
    if (originalCredentials === undefined) delete process.env.GA4_SERVICE_ACCOUNT_JSON;
    else process.env.GA4_SERVICE_ACCOUNT_JSON = originalCredentials;
  });

  it('returns visitors and realtime users without exposing diagnostics', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: 'token' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        rows: [{ metricValues: [{ value: '12' }] }],
      }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        rows: [{ metricValues: [{ value: '1' }] }],
      }), { status: 200 }));

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      configured: true,
      visitors: 12,
      activeNow: 1,
    });
    expect(response.headers.get('cache-control')).toBe('no-store, max-age=0');
  });

  it('keeps a valid visitor count when realtime reporting fails', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: 'token' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        rows: [{ metricValues: [{ value: '12' }] }],
      }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: { status: 'UNAVAILABLE' } }), { status: 503 }));

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      configured: true,
      visitors: 12,
    });
  });

  it('returns 503 when GA4 is not configured', async () => {
    const saved = process.env.GA4_PROPERTY_ID;
    delete process.env.GA4_PROPERTY_ID;

    const response = await GET();

    expect(response.status).toBe(503);

    if (saved !== undefined) process.env.GA4_PROPERTY_ID = saved;
  });
});
