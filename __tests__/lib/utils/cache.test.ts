import { cache, withCache, generateCacheKey } from '@/lib/utils/cache'

/**
 * Test Suite: Cache Utilities
 * 
 * Tests caching functionality, TTL, and cache decorators
 */

describe('Cache Utilities', () => {
  beforeEach(() => {
    // Clear cache before each test
    cache.clear()
  })

  describe('Basic Cache Operations', () => {
    it('should store and retrieve values', () => {
      cache.set('test-key', 'test-value')
      const value = cache.get<string>('test-key')
      
      expect(value).toBe('test-value')
    })

    it('should return null for non-existent keys', () => {
      const value = cache.get('non-existent')
      expect(value).toBeNull()
    })

    it('should overwrite existing values', () => {
      cache.set('test-key', 'value1')
      cache.set('test-key', 'value2')
      
      const value = cache.get<string>('test-key')
      expect(value).toBe('value2')
    })

    it('should delete values', () => {
      cache.set('test-key', 'test-value')
      const deleted = cache.delete('test-key')
      
      expect(deleted).toBe(true)
      expect(cache.get('test-key')).toBeNull()
    })

    it('should return false when deleting non-existent key', () => {
      const deleted = cache.delete('non-existent')
      expect(deleted).toBe(false)
    })

    it('should clear all values', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.set('key3', 'value3')
      
      cache.clear()
      
      expect(cache.size()).toBe(0)
      expect(cache.get('key1')).toBeNull()
      expect(cache.get('key2')).toBeNull()
      expect(cache.get('key3')).toBeNull()
    })

    it('should return correct cache size', () => {
      expect(cache.size()).toBe(0)
      
      cache.set('key1', 'value1')
      expect(cache.size()).toBe(1)
      
      cache.set('key2', 'value2')
      expect(cache.size()).toBe(2)
      
      cache.delete('key1')
      expect(cache.size()).toBe(1)
    })
  })

  describe('TTL (Time To Live)', () => {
    it('should expire values after TTL', async () => {
      cache.set('test-key', 'test-value', 1) // 1 second TTL
      
      // Should exist immediately
      expect(cache.get('test-key')).toBe('test-value')
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100))
      
      // Should be expired
      expect(cache.get('test-key')).toBeNull()
    })

    it('should not expire values before TTL', async () => {
      cache.set('test-key', 'test-value', 2) // 2 seconds TTL
      
      // Wait less than TTL
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Should still exist
      expect(cache.get('test-key')).toBe('test-value')
    })

    it('should use default TTL when not specified', () => {
      cache.set('test-key', 'test-value') // Default TTL (3600s)
      expect(cache.get('test-key')).toBe('test-value')
    })
  })

  describe('Data Types', () => {
    it('should cache strings', () => {
      cache.set('string', 'hello')
      expect(cache.get<string>('string')).toBe('hello')
    })

    it('should cache numbers', () => {
      cache.set('number', 42)
      expect(cache.get<number>('number')).toBe(42)
    })

    it('should cache objects', () => {
      const obj = { name: 'Test', value: 123 }
      cache.set('object', obj)
      expect(cache.get<typeof obj>('object')).toEqual(obj)
    })

    it('should cache arrays', () => {
      const arr = [1, 2, 3, 4, 5]
      cache.set('array', arr)
      expect(cache.get<number[]>('array')).toEqual(arr)
    })

    it('should cache boolean values', () => {
      cache.set('bool-true', true)
      cache.set('bool-false', false)
      
      expect(cache.get<boolean>('bool-true')).toBe(true)
      expect(cache.get<boolean>('bool-false')).toBe(false)
    })
  })

  describe('withCache Decorator', () => {
    it('should cache function results', async () => {
      let callCount = 0
      const expensiveFunction = async (id: string) => {
        callCount++
        return `result-${id}`
      }
      
      const cachedFunction = withCache(
        expensiveFunction,
        (id) => `func:${id}`,
        10
      )
      
      // First call - should execute
      const result1 = await cachedFunction('test')
      expect(result1).toBe('result-test')
      expect(callCount).toBe(1)
      
      // Second call - should use cache
      const result2 = await cachedFunction('test')
      expect(result2).toBe('result-test')
      expect(callCount).toBe(1) // Not incremented
    })

    it('should use different cache keys for different arguments', async () => {
      let callCount = 0
      const fn = async (id: string) => {
        callCount++
        return `result-${id}`
      }
      
      const cachedFn = withCache(fn, (id) => `func:${id}`, 10)
      
      await cachedFn('id1')
      await cachedFn('id2')
      
      expect(callCount).toBe(2) // Both should execute (different keys)
      
      await cachedFn('id1')
      expect(callCount).toBe(2) // Should use cache for id1
    })
  })

  describe('generateCacheKey', () => {
    it('should generate consistent keys for same inputs', () => {
      const key1 = generateCacheKey('prefix', { a: 1, b: 2 })
      const key2 = generateCacheKey('prefix', { a: 1, b: 2 })
      
      expect(key1).toBe(key2)
    })

    it('should generate different keys for different inputs', () => {
      const key1 = generateCacheKey('prefix', { a: 1, b: 2 })
      const key2 = generateCacheKey('prefix', { a: 1, b: 3 })
      
      expect(key1).not.toBe(key2)
    })

    it('should handle parameter order independently', () => {
      const key1 = generateCacheKey('prefix', { a: 1, b: 2 })
      const key2 = generateCacheKey('prefix', { b: 2, a: 1 })
      
      expect(key1).toBe(key2) // Should be same (sorted)
    })

    it('should include prefix in key', () => {
      const key = generateCacheKey('test-prefix', { id: 1 })
      expect(key).toContain('test-prefix')
    })
  })

  describe('Cleanup', () => {
    it('should remove expired entries on cleanup', async () => {
      cache.set('key1', 'value1', 1) // 1 second TTL
      cache.set('key2', 'value2', 10) // 10 seconds TTL
      
      expect(cache.size()).toBe(2)
      
      // Wait for first entry to expire
      await new Promise(resolve => setTimeout(resolve, 1100))
      
      // Trigger cleanup
      cache.cleanup()
      
      // Only expired entry should be removed
      expect(cache.size()).toBe(1)
      expect(cache.get('key1')).toBeNull()
      expect(cache.get('key2')).toBe('value2')
    })
  })
})
