import { TokenManager } from '@/src/lib/token-manager';

/**
 * jsdom does not ship a global `fetch`, so it is installed manually here
 * (jest.spyOn cannot patch a property that does not exist).
 */
const originalFetch = global.fetch;

function installFetchMock(response: unknown) {
  const fetchMock = jest.fn().mockResolvedValue(response);
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

describe('TokenManager', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    if (originalFetch) {
      global.fetch = originalFetch;
    } else {
      delete (global as { fetch?: unknown }).fetch;
    }
  });

  it('returns manual token when provided', async () => {
    const manager = new TokenManager({
      manualToken: 'manual-token',
      scope: 'scope',
      tokenUrl: 'https://example.com/token',
    });

    await expect(manager.getToken()).resolves.toBe('manual-token');
  });

  it('caches fetched token', async () => {
    const fetchMock = installFetchMock({
      ok: true,
      json: async () => ({ access_token: 'abc', expires_in: 3600, token_type: 'Bearer' }),
    });

    const manager = new TokenManager({
      clientId: 'id',
      clientSecret: 'secret',
      scope: 'scope',
      tokenUrl: 'https://example.com/token',
    });

    const token1 = await manager.getToken();
    const token2 = await manager.getToken();

    expect(token1).toBe('abc');
    expect(token2).toBe('abc');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('returns null when the token endpoint fails', async () => {
    installFetchMock({ ok: false, status: 401, json: async () => ({}) });

    const manager = new TokenManager({
      clientId: 'id',
      clientSecret: 'secret',
      scope: 'scope',
      tokenUrl: 'https://example.com/token',
    });

    await expect(manager.getToken()).resolves.toBeNull();
  });

  it('returns null when credentials are missing', async () => {
    const fetchMock = installFetchMock({ ok: true, json: async () => ({}) });

    const manager = new TokenManager({
      scope: 'scope',
      tokenUrl: 'https://example.com/token',
    });

    await expect(manager.getToken()).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
