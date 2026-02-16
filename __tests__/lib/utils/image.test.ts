import {
  generateBlurDataURL,
  generateSrcSet,
  optimizeEbayImage,
  getFallbackImage
} from '@/lib/utils/image'

/**
 * Test Suite: Image Utilities
 * 
 * Tests image optimization, blur placeholders, and responsive images
 */

describe('Image Utilities', () => {
  describe('generateBlurDataURL', () => {
    it('should generate a valid base64 data URL', () => {
      const dataUrl = generateBlurDataURL()
      
      expect(dataUrl).toMatch(/^data:image\/svg\+xml;base64,/)
    })

    it('should accept custom dimensions', () => {
      const dataUrl = generateBlurDataURL(800, 600)
      
      expect(dataUrl).toBeTruthy()
      expect(dataUrl).toMatch(/^data:image\/svg\+xml;base64,/)
    })

    it('should accept custom color', () => {
      const dataUrl = generateBlurDataURL(400, 300, '#FF0000')
      
      expect(dataUrl).toBeTruthy()
      expect(dataUrl).toContain('base64')
    })

    it('should use default dimensions when not provided', () => {
      const dataUrl = generateBlurDataURL()
      const decoded = Buffer.from(dataUrl.split(',')[1], 'base64').toString()
      
      expect(decoded).toContain('width="400"')
      expect(decoded).toContain('height="300"')
    })

    it('should contain SVG elements', () => {
      const dataUrl = generateBlurDataURL()
      const decoded = Buffer.from(dataUrl.split(',')[1], 'base64').toString()
      
      expect(decoded).toContain('<svg')
      expect(decoded).toContain('<rect')
    })
  })

  describe('generateSrcSet', () => {
    it('should generate srcset for standard sizes', () => {
      const baseUrl = 'https://example.com/image.jpg'
      const srcSet = generateSrcSet(baseUrl)
      
      expect(srcSet).toContain('640w')
      expect(srcSet).toContain('750w')
      expect(srcSet).toContain('1080w')
      expect(srcSet).toContain('1920w')
    })

    it('should handle eBay image URLs', () => {
      const ebayUrl = 'https://i.ebayimg.com/images/g/abc/s-l500.jpg'
      const srcSet = generateSrcSet(ebayUrl)
      
      expect(srcSet).toContain('ebayimg.com')
      expect(srcSet).toContain('w=640')
      expect(srcSet).toContain('w=1920')
    })

    it('should accept custom sizes', () => {
      const baseUrl = 'https://example.com/image.jpg'
      const srcSet = generateSrcSet(baseUrl, [320, 640, 1280])
      
      expect(srcSet).toContain('320w')
      expect(srcSet).toContain('640w')
      expect(srcSet).toContain('1280w')
      expect(srcSet).not.toContain('1920w')
    })

    it('should format srcset correctly', () => {
      const baseUrl = 'https://example.com/image.jpg'
      const srcSet = generateSrcSet(baseUrl, [640, 1280])
      
      expect(srcSet).toMatch(/640w, .* 1280w/)
    })
  })

  describe('optimizeEbayImage', () => {
    it('should add optimization parameters to eBay URLs', () => {
      const ebayUrl = 'https://i.ebayimg.com/images/g/abc/s-l500.jpg'
      const optimized = optimizeEbayImage(ebayUrl, 800, 85)
      
      expect(optimized).toContain('w=800')
      expect(optimized).toContain('q=85')
    })

    it('should handle URLs with existing query parameters', () => {
      const ebayUrl = 'https://i.ebayimg.com/images/g/abc/s-l500.jpg?ver=1'
      const optimized = optimizeEbayImage(ebayUrl, 800, 85)
      
      expect(optimized).toContain('w=800')
      expect(optimized).toContain('q=85')
      expect(optimized).toContain('&')
    })

    it('should use default dimensions when not provided', () => {
      const ebayUrl = 'https://i.ebayimg.com/images/g/abc/s-l500.jpg'
      const optimized = optimizeEbayImage(ebayUrl)
      
      expect(optimized).toContain('w=800')
      expect(optimized).toContain('q=85')
    })

    it('should handle non-eBay URLs gracefully', () => {
      const regularUrl = 'https://example.com/image.jpg'
      const optimized = optimizeEbayImage(regularUrl, 800, 85)
      
      expect(optimized).toBe(regularUrl)
    })

    it('should handle empty URLs', () => {
      const optimized = optimizeEbayImage('', 800, 85)
      expect(optimized).toBe('')
    })

    it('should handle ebaystatic URLs', () => {
      const staticUrl = 'https://ir.ebaystatic.com/image.jpg'
      const optimized = optimizeEbayImage(staticUrl, 800, 85)
      
      expect(optimized).toContain('w=800')
      expect(optimized).toContain('q=85')
    })
  })

  describe('getFallbackImage', () => {
    it('should generate placeholder URL', () => {
      const fallback = getFallbackImage(400, 300, 'Product')
      
      expect(fallback).toContain('placeholder.com')
      expect(fallback).toContain('400x300')
      expect(fallback).toContain('Product')
    })

    it('should use default dimensions', () => {
      const fallback = getFallbackImage()
      
      expect(fallback).toContain('400x300')
    })

    it('should URL encode text', () => {
      const fallback = getFallbackImage(400, 300, 'No Image Available')
      
      expect(fallback).toContain('No%20Image')
    })

    it('should accept custom dimensions', () => {
      const fallback = getFallbackImage(800, 600, 'Test')
      
      expect(fallback).toContain('800x600')
    })

    it('should handle special characters in text', () => {
      const fallback = getFallbackImage(400, 300, 'Test & Product')
      
      expect(fallback).toContain('Test')
      expect(fallback).toContain('Product')
    })
  })
})
