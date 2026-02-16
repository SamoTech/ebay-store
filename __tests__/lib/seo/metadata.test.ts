import { siteMetadata, viewport } from '@/lib/seo/metadata'

/**
 * Test Suite: SEO Metadata
 * 
 * Tests metadata configuration for SEO optimization
 */

describe('SEO Metadata', () => {
  describe('Site Metadata', () => {
    it('should have metadataBase URL', () => {
      expect(siteMetadata.metadataBase).toBeDefined()
      expect(siteMetadata.metadataBase?.toString()).toContain('ebay-store.vercel.app')
    })

    it('should have title configuration', () => {
      expect(siteMetadata.title).toBeDefined()
      expect(typeof siteMetadata.title).toBe('object')
      
      const title = siteMetadata.title as { default: string; template: string }
      expect(title.default).toContain('DealsHub')
      expect(title.template).toContain('%s')
    })

    it('should have description', () => {
      expect(siteMetadata.description).toBeDefined()
      expect(typeof siteMetadata.description).toBe('string')
      expect(siteMetadata.description).toContain('deals')
    })

    it('should have keywords array', () => {
      expect(siteMetadata.keywords).toBeDefined()
      expect(Array.isArray(siteMetadata.keywords)).toBe(true)
      expect(siteMetadata.keywords.length).toBeGreaterThan(0)
    })

    it('should include essential keywords', () => {
      const keywords = siteMetadata.keywords as string[]
      
      expect(keywords).toContain('eBay deals')
      expect(keywords.some(k => k.includes('electronics'))).toBe(true)
      expect(keywords.some(k => k.includes('gaming'))).toBe(true)
    })

    it('should have author information', () => {
      expect(siteMetadata.authors).toBeDefined()
      expect(Array.isArray(siteMetadata.authors)).toBe(true)
    })

    it('should have creator and publisher', () => {
      expect(siteMetadata.creator).toBe('DealsHub')
      expect(siteMetadata.publisher).toBe('DealsHub')
    })

    it('should have robots configuration', () => {
      expect(siteMetadata.robots).toBeDefined()
      
      const robots = siteMetadata.robots as any
      expect(robots.index).toBe(true)
      expect(robots.follow).toBe(true)
      expect(robots.googleBot).toBeDefined()
    })
  })

  describe('Open Graph Metadata', () => {
    it('should have OpenGraph configuration', () => {
      expect(siteMetadata.openGraph).toBeDefined()
    })

    it('should have correct OpenGraph type', () => {
      const og = siteMetadata.openGraph as any
      expect(og.type).toBe('website')
    })

    it('should have OpenGraph title and description', () => {
      const og = siteMetadata.openGraph as any
      
      expect(og.title).toBeDefined()
      expect(og.description).toBeDefined()
      expect(og.title).toContain('DealsHub')
    })

    it('should have OpenGraph images', () => {
      const og = siteMetadata.openGraph as any
      
      expect(og.images).toBeDefined()
      expect(Array.isArray(og.images)).toBe(true)
      expect(og.images.length).toBeGreaterThan(0)
      
      const firstImage = og.images[0]
      expect(firstImage.url).toBeDefined()
      expect(firstImage.width).toBe(1200)
      expect(firstImage.height).toBe(630)
    })

    it('should have site name and URL', () => {
      const og = siteMetadata.openGraph as any
      
      expect(og.siteName).toBe('DealsHub')
      expect(og.url).toContain('ebay-store.vercel.app')
    })
  })

  describe('Twitter Card Metadata', () => {
    it('should have Twitter card configuration', () => {
      expect(siteMetadata.twitter).toBeDefined()
    })

    it('should use summary_large_image card', () => {
      const twitter = siteMetadata.twitter as any
      expect(twitter.card).toBe('summary_large_image')
    })

    it('should have Twitter handle', () => {
      const twitter = siteMetadata.twitter as any
      
      expect(twitter.site).toBeDefined()
      expect(twitter.creator).toBeDefined()
      expect(twitter.site).toContain('@')
    })

    it('should have Twitter title and description', () => {
      const twitter = siteMetadata.twitter as any
      
      expect(twitter.title).toBeDefined()
      expect(twitter.description).toBeDefined()
    })

    it('should have Twitter images', () => {
      const twitter = siteMetadata.twitter as any
      
      expect(twitter.images).toBeDefined()
      expect(Array.isArray(twitter.images)).toBe(true)
    })
  })

  describe('Verification', () => {
    it('should have Google verification', () => {
      expect(siteMetadata.verification).toBeDefined()
      
      const verification = siteMetadata.verification as any
      expect(verification.google).toBeDefined()
      expect(typeof verification.google).toBe('string')
    })

    it('should have other verification codes', () => {
      const verification = siteMetadata.verification as any
      
      expect(verification.other).toBeDefined()
    })
  })

  describe('Alternate Links', () => {
    it('should have canonical URL', () => {
      expect(siteMetadata.alternates).toBeDefined()
      
      const alternates = siteMetadata.alternates as any
      expect(alternates.canonical).toBeDefined()
      expect(alternates.canonical).toContain('ebay-store.vercel.app')
    })

    it('should have RSS feed', () => {
      const alternates = siteMetadata.alternates as any
      
      expect(alternates.types).toBeDefined()
      expect(alternates.types['application/rss+xml']).toBeDefined()
    })

    it('should have language alternates', () => {
      const alternates = siteMetadata.alternates as any
      
      expect(alternates.languages).toBeDefined()
      expect(alternates.languages['en-US']).toBeDefined()
    })
  })

  describe('Icons', () => {
    it('should have icon configuration', () => {
      expect(siteMetadata.icons).toBeDefined()
    })

    it('should have multiple icon sizes', () => {
      const icons = siteMetadata.icons as any
      
      expect(icons.icon).toBeDefined()
      expect(Array.isArray(icons.icon)).toBe(true)
      expect(icons.icon.length).toBeGreaterThan(0)
    })

    it('should have Apple touch icons', () => {
      const icons = siteMetadata.icons as any
      
      expect(icons.apple).toBeDefined()
      expect(Array.isArray(icons.apple)).toBe(true)
    })

    it('should have favicon', () => {
      const icons = siteMetadata.icons as any
      
      expect(icons.shortcut).toBeDefined()
      expect(icons.shortcut).toContain('favicon.ico')
    })
  })

  describe('PWA Manifest', () => {
    it('should have manifest link', () => {
      expect(siteMetadata.manifest).toBeDefined()
      expect(siteMetadata.manifest).toBe('/manifest.json')
    })

    it('should have Apple Web App configuration', () => {
      expect(siteMetadata.appleWebApp).toBeDefined()
      
      const apple = siteMetadata.appleWebApp as any
      expect(apple.capable).toBe(true)
      expect(apple.title).toBe('DealsHub')
    })
  })

  describe('Viewport Configuration', () => {
    it('should have viewport settings', () => {
      expect(viewport).toBeDefined()
    })

    it('should have width device-width', () => {
      expect(viewport.width).toBe('device-width')
    })

    it('should have initial scale', () => {
      expect(viewport.initialScale).toBe(1)
    })

    it('should allow user scaling', () => {
      expect(viewport.maximumScale).toBeGreaterThan(1)
    })

    it('should have theme color', () => {
      expect(viewport.themeColor).toBeDefined()
      expect(viewport.themeColor).toMatch(/#[0-9a-f]{6}/i)
    })
  })

  describe('Metadata Completeness', () => {
    it('should have all essential metadata fields', () => {
      const essentialFields = [
        'metadataBase',
        'title',
        'description',
        'keywords',
        'openGraph',
        'twitter',
        'robots',
        'icons',
        'manifest'
      ]
      
      essentialFields.forEach(field => {
        expect(siteMetadata).toHaveProperty(field)
      })
    })

    it('should have category classification', () => {
      expect(siteMetadata.category).toBeDefined()
      expect(siteMetadata.category).toBe('shopping')
    })
  })
})
