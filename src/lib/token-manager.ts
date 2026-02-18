import { logger } from '@/src/lib/logger';

export interface TokenManagerConfig {
  clientId?: string;
  clientSecret?: string;
  scope: string;
  tokenUrl: string;
  manualToken?: string;
}

interface OAuthTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface CachedToken {
  token: string;
  expiresAt: number;
}

export class TokenManager {
  private cachedToken: CachedToken | null = null;
  private inFlightRefresh: Promise<string | null> | null = null;

  constructor(private readonly config: TokenManagerConfig) {}

  private isTokenValid(): boolean {
    return Boolean(this.cachedToken && this.cachedToken.expiresAt > Date.now());
  }

  async getToken(): Promise<string | null> {
    if (this.config.manualToken) {
      return this.config.manualToken;
    }

    if (this.isTokenValid()) {
      return this.cachedToken?.token ?? null;
    }

    if (this.inFlightRefresh) {
      return this.inFlightRefresh;
    }

    this.inFlightRefresh = this.refreshToken();
    const token = await this.inFlightRefresh;
    this.inFlightRefresh = null;
    return token;
  }

  private async refreshToken(): Promise<string | null> {
    const { clientId, clientSecret, scope, tokenUrl } = this.config;

    if (!clientId || !clientSecret) {
      logger.warn('Missing OAuth credentials for token refresh');
      return null;
    }

    try {
      const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      const body = new URLSearchParams({
        grant_type: 'client_credentials',
        scope,
      });

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
        cache: 'no-store',
      });

      if (!response.ok) {
        logger.error('Token refresh failed', { status: response.status });
        return null;
      }

      const tokenData = (await response.json()) as OAuthTokenResponse;
      const expiresIn = Math.max(0, tokenData.expires_in - 60);
      this.cachedToken = {
        token: tokenData.access_token,
        expiresAt: Date.now() + expiresIn * 1000,
      };

      return this.cachedToken.token;
    } catch (error) {
      logger.error('Token refresh exception', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  clear(): void {
    this.cachedToken = null;
    this.inFlightRefresh = null;
  }
}
