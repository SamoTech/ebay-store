import { TokenManager } from '@/src/lib/token-manager';

describe('TokenManager', () => {
  afterEach(() => {
    jest.restoreAllMocks();
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
    const fetchMock = jest.spyOn(global, 'fetch' as never).mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: 'abc', expires_in: 3600, token_type: 'Bearer' }),
    } as Response);

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
});
