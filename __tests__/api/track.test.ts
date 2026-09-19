/**
 * @jest-environment node
 */
import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';
import { NextRequest } from 'next/server';

const testDir = path.join(os.tmpdir(), `dealshub-track-${process.pid}`);

function post(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/track', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/track', () => {
  let POST: (request: NextRequest) => Promise<Response>;
  let GET: (request: NextRequest) => Promise<Response>;

  beforeAll(async () => {
    process.env.DEALSHUB_DATA_DIR = testDir;
    ({ POST, GET } = await import('@/app/api/track/route'));
  });

  afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
    delete process.env.DEALSHUB_DATA_DIR;
    delete process.env.ANALYTICS_READ_TOKEN;
  });

  it('stores an event and reports whether it persisted', async () => {
    const response = await POST(post({ event: 'product_view', productId: 1 }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(typeof body.persisted).toBe('boolean');
  });

  it('rejects a payload without an event name', async () => {
    const response = await POST(post({ productId: 1 }));

    expect(response.status).toBe(400);
  });

  it('rejects malformed JSON without throwing', async () => {
    const response = await POST(
      new NextRequest('http://localhost:3000/api/track', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: 'not json',
      }),
    );

    expect(response.status).toBe(400);
  });

  it('aggregates stored events on GET', async () => {
    await POST(post({ event: 'affiliate_click', productId: 2 }));

    const response = await GET(new NextRequest('http://localhost:3000/api/track'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.totalEvents).toBeGreaterThanOrEqual(2);
    expect(body.totals.product_view).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(body.latest)).toBe(true);
  });

  it('rejects GET without the token when ANALYTICS_READ_TOKEN is set', async () => {
    process.env.ANALYTICS_READ_TOKEN = 'secret-token';

    const unauthorized = await GET(new NextRequest('http://localhost:3000/api/track'));
    expect(unauthorized.status).toBe(401);

    const viaQuery = await GET(new NextRequest('http://localhost:3000/api/track?token=secret-token'));
    expect(viaQuery.status).toBe(200);

    const viaHeader = await GET(
      new NextRequest('http://localhost:3000/api/track', {
        headers: { authorization: 'Bearer secret-token' },
      }),
    );
    expect(viaHeader.status).toBe(200);
  });
});
