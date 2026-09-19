/**
 * @jest-environment node
 */
import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';

const testDir = path.join(os.tmpdir(), `dealshub-subscribe-${process.pid}`);

function post(body: unknown): Request {
  return new Request('http://localhost:3000/api/subscribe', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.0.0.${Math.floor(Math.random() * 200)}` },
    body: JSON.stringify(body),
  });
}

describe('POST /api/subscribe', () => {
  let POST: (request: Request) => Promise<Response>;

  beforeAll(async () => {
    process.env.DEALSHUB_DATA_DIR = testDir;
    ({ POST } = await import('@/app/api/subscribe/route'));
  });

  afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
    delete process.env.DEALSHUB_DATA_DIR;
  });

  it('accepts a valid email', async () => {
    const response = await POST(post({ email: 'shopper@example.com', source: 'test' }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ ok: true });
  });

  it('normalises and deduplicates addresses', async () => {
    await POST(post({ email: '  Duplicate@Example.com ' }));
    const response = await POST(post({ email: 'duplicate@example.com' }));

    await expect(response.json()).resolves.toMatchObject({ ok: true, alreadySubscribed: true });
  });

  it('rejects an invalid email', async () => {
    const response = await POST(post({ email: 'not-an-email' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ ok: false });
  });

  it('rejects a missing email', async () => {
    const response = await POST(post({}));

    expect(response.status).toBe(400);
  });

  it('rate limits repeated signups from the same client', async () => {
    const fixedIp = '203.0.113.7';
    const makeRequest = () =>
      new Request('http://localhost:3000/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-forwarded-for': fixedIp },
        body: JSON.stringify({ email: `burst-${Date.now()}@example.com` }),
      });

    const statuses: number[] = [];
    for (let i = 0; i < 7; i += 1) {
      const response = await POST(makeRequest());
      statuses.push(response.status);
    }

    expect(statuses).toContain(429);
  });
});
