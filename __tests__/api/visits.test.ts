/** @jest-environment node */
import { NextRequest } from 'next/server';

jest.mock('@/lib/visits', () => ({
  createAnonymousToken: jest.fn(() => 'anonymous-token'),
  createVisitWindowKey: jest.fn(() => 'a'.repeat(64)),
  getSiteVisitCount: jest.fn(),
  recordSiteVisit: jest.fn(),
}));

describe('/api/visits', () => {
  let GET: () => Promise<Response>;
  let POST: (request: NextRequest) => Promise<Response>;
  let getSiteVisitCount: jest.MockedFunction<() => Promise<number | null>>;
  let recordSiteVisit: jest.MockedFunction<(windowKey: string) => Promise<number | null>>;

  beforeAll(async () => {
    process.env.VISIT_HASH_SECRET = 'a'.repeat(32);
    ({ GET, POST } = await import('@/app/api/visits/route'));

    const visits = await import('@/lib/visits');
    getSiteVisitCount = jest.mocked(visits.getSiteVisitCount);
    recordSiteVisit = jest.mocked(visits.recordSiteVisit);
  });

  afterAll(() => {
    delete process.env.VISIT_HASH_SECRET;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    getSiteVisitCount.mockResolvedValue(42);
    recordSiteVisit.mockResolvedValue(43);
  });

  const setNodeEnv = (value: string | undefined) => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value,
      configurable: true,
      enumerable: true,
      writable: true,
    });
  };

  it('returns only the aggregate count from GET', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, count: 42 });
    expect(getSiteVisitCount).toHaveBeenCalledTimes(1);
  });

  it('rejects cross-origin POST requests in production', async () => {
    const original = process.env.NODE_ENV;
    setNodeEnv('production');

    const request = new NextRequest('https://www.saleh-store.com/api/visits', {
      method: 'POST',
      headers: {
        origin: 'https://attacker.example',
        'content-type': 'application/json',
      },
      body: '{}',
    });

    const response = await POST(request);
    expect(response.status).toBe(403);
    expect(recordSiteVisit).not.toHaveBeenCalled();

    setNodeEnv(original);
  });

  it('records a qualifying visit and sets a short-lived anonymous cookie', async () => {
    const original = process.env.NODE_ENV;
    setNodeEnv('production');

    const request = new NextRequest('https://www.saleh-store.com/api/visits', {
      method: 'POST',
      headers: {
        origin: 'https://www.saleh-store.com',
        'x-forwarded-for': '203.0.113.10',
        'user-agent': 'test-browser',
        'accept-language': 'en-US',
        'content-type': 'application/json',
      },
      body: '{}',
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, count: 43 });
    expect(recordSiteVisit).toHaveBeenCalledWith('a'.repeat(64));
    expect(response.headers.get('set-cookie')).toContain('saleh_visit=anonymous-token');
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
    expect(response.headers.get('set-cookie')).toContain('Max-Age=1800');

    setNodeEnv(original);
  });

  it('does not overwrite an existing anonymous cookie', async () => {
    const request = new NextRequest('http://localhost:3000/api/visits', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}',
    });
    request.cookies.set('saleh_visit', 'existing-token');

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it('rejects invalid content types and non-empty payloads', async () => {
    const contentTypeResponse = await POST(
      new NextRequest('http://localhost:3000/api/visits', {
        method: 'POST',
        headers: { 'content-type': 'text/plain' },
        body: '{}',
      }),
    );
    expect(contentTypeResponse.status).toBe(415);

    const payloadResponse = await POST(
      new NextRequest('http://localhost:3000/api/visits', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ unexpected: true }),
      }),
    );
    expect(payloadResponse.status).toBe(400);
    expect(recordSiteVisit).not.toHaveBeenCalled();
  });

  it('fails closed when the counter backend is unavailable', async () => {
    recordSiteVisit.mockResolvedValueOnce(null);

    const response = await POST(
      new NextRequest('http://localhost:3000/api/visits', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{}',
      }),
    );

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ ok: false, count: null });
  });

  it('fails closed when the hash secret is missing', async () => {
    const original = process.env.VISIT_HASH_SECRET;
    delete process.env.VISIT_HASH_SECRET;

    const response = await POST(
      new NextRequest('http://localhost:3000/api/visits', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{}',
      }),
    );

    expect(response.status).toBe(503);
    process.env.VISIT_HASH_SECRET = original;
  });
});
