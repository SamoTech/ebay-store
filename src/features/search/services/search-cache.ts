interface CacheRecord<T> {
  value: T;
  expiresAt: number;
}

export class LruRequestCache<T> {
  private data = new Map<string, CacheRecord<T>>();
  private inFlight = new Map<string, Promise<T>>();

  constructor(private readonly maxSize: number) {}

  private evictIfNeeded(): void {
    while (this.data.size > this.maxSize) {
      const first = this.data.keys().next().value;
      if (!first) return;
      this.data.delete(first);
    }
  }

  get(key: string): T | null {
    const item = this.data.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.data.delete(key);
      return null;
    }
    this.data.delete(key);
    this.data.set(key, item);
    return item.value;
  }

  set(key: string, value: T, ttlSeconds: number): void {
    this.data.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
    this.evictIfNeeded();
  }

  async getOrCompute(key: string, ttlSeconds: number, compute: () => Promise<T>): Promise<T> {
    const cached = this.get(key);
    if (cached !== null) return cached;

    const existingPromise = this.inFlight.get(key);
    if (existingPromise) return existingPromise;

    const promise = compute()
      .then((result) => {
        this.set(key, result, ttlSeconds);
        return result;
      })
      .finally(() => {
        this.inFlight.delete(key);
      });

    this.inFlight.set(key, promise);
    return promise;
  }
}
