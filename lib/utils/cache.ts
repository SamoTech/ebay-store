/**
 * Caching Utilities
 * 
 * Simple in-memory cache for API responses and expensive computations.
 * For production with multiple instances, consider Redis or Vercel KV.
 */

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>()

  /**
   * Get item from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data as T
  }

  /**
   * Set item in cache
   * 
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in seconds (default: 1 hour)
   */
  set<T>(key: string, data: T, ttl: number = 3600): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl * 1000,
    })
  }

  /**
   * Delete item from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now()
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }
}

// Global cache instance
export const cache = new MemoryCache()

// Cleanup expired entries every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    cache.cleanup()
  }, 5 * 60 * 1000)
}

/**
 * Cache decorator for functions
 * 
 * @example
 * const cachedFunction = withCache(
 *   async (id: string) => fetchData(id),
 *   (id) => `data:${id}`,
 *   3600
 * )
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl: number = 3600
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args)
    
    // Check cache first
    const cached = cache.get<Awaited<ReturnType<T>>>(key)
    if (cached !== null) {
      console.log(`✅ Cache hit: ${key}`)
      return cached
    }
    
    // Execute function and cache result
    console.log(`❌ Cache miss: ${key}`)
    const result = await fn(...args)
    cache.set(key, result, ttl)
    
    return result
  }) as T
}

/**
 * Generate cache key from object
 */
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${JSON.stringify(params[key])}`)
    .join('&')
  
  return `${prefix}:${sortedParams}`
}
