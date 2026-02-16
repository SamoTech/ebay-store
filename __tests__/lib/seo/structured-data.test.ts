import {
  siteStructuredData,
  generateProductStructuredData,
  generateBlogPostStructuredData
} from '@/lib/seo/structured-data'

/**
 * Test Suite: Structured Data (JSON-LD)
 * 
 * Tests Schema.org markup for SEO
 */

describe('Structured Data', () => {
  describe('Site Structured Data', () => {
    it('should have @context', () => {
      expect(siteStructuredData['@context']).toBe('https://schema.org')
    })

    it('should have @graph array', () => {
      expect(siteStructuredData['@graph']).toBeDefined()
      expect(Array.isArray(siteStructuredData['@graph'])).toBe(true)
      expect(siteStructuredData['@graph'].length).toBeGreaterThan(0)
    })

    it('should include WebSite schema', () => {
      const website = siteStructuredData['@graph'].find(
        (item: any) => item['@type'] === 'WebSite'
      )
      
      expect(website).toBeDefined()
      expect(website.name).toBe('DealsHub')
      expect(website.url).toContain('ebay-store.vercel.app')
    })

    it('should include Organization schema', () => {
      const org = siteStructuredData['@graph'].find(
        (item: any) => item['@type'] === 'Organization'
      )
      
      expect(org).toBeDefined()
      expect(org.name).toBe('DealsHub')
      expect(org.logo).toBeDefined()
    })

    it('should include SearchAction', () => {
      const website = siteStructuredData['@graph'].find(
        (item: any) => item['@type'] === 'WebSite'
      )
      
      expect(website.potentialAction).toBeDefined()
      expect(website.potentialAction['@type']).toBe('SearchAction')
      expect(website.potentialAction.target).toBeDefined()
    })

    it('should include BreadcrumbList', () => {
      const breadcrumb = siteStructuredData['@graph'].find(
        (item: any) => item['@type'] === 'BreadcrumbList'
      )
      
      expect(breadcrumb).toBeDefined()
      expect(breadcrumb.itemListElement).toBeDefined()
      expect(Array.isArray(breadcrumb.itemListElement)).toBe(true)
    })

    it('should include ItemList for categories', () => {
      const itemList = siteStructuredData['@graph'].find(
        (item: any) => item['@type'] === 'ItemList'
      )
      
      expect(itemList).toBeDefined()
      expect(itemList.name).toBe('Product Categories')
      expect(itemList.itemListElement).toBeDefined()
      expect(itemList.itemListElement.length).toBeGreaterThan(0)
    })

    it('should include Blog schema', () => {
      const blog = siteStructuredData['@graph'].find(
        (item: any) => item['@type'] === 'Blog'
      )
      
      expect(blog).toBeDefined()
      expect(blog.name).toBe('DealsHub Blog')
    })

    it('should have social media links', () => {
      const org = siteStructuredData['@graph'].find(
        (item: any) => item['@type'] === 'Organization'
      )
      
      expect(org.sameAs).toBeDefined()
      expect(Array.isArray(org.sameAs)).toBe(true)
      expect(org.sameAs.length).toBeGreaterThan(0)
      expect(org.sameAs.some((url: string) => url.includes('twitter'))).toBe(true)
    })
  })

  describe('generateProductStructuredData', () => {
    const mockProduct = {
      name: 'Test Product',
      description: 'Test description',
      image: 'https://example.com/image.jpg',
      price: 99.99,
      currency: 'USD',
      url: 'https://example.com/product/1',
      brand: 'TestBrand',
      availability: 'InStock' as const
    }

    it('should generate valid product schema', () => {
      const schema = generateProductStructuredData(mockProduct)
      
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('Product')
    })

    it('should include product name and description', () => {
      const schema = generateProductStructuredData(mockProduct)
      
      expect(schema.name).toBe('Test Product')
      expect(schema.description).toBe('Test description')
    })

    it('should include product image', () => {
      const schema = generateProductStructuredData(mockProduct)
      
      expect(schema.image).toBe('https://example.com/image.jpg')
    })

    it('should include brand information', () => {
      const schema = generateProductStructuredData(mockProduct)
      
      expect(schema.brand).toBeDefined()
      expect(schema.brand['@type']).toBe('Brand')
      expect(schema.brand.name).toBe('TestBrand')
    })

    it('should include offer information', () => {
      const schema = generateProductStructuredData(mockProduct)
      
      expect(schema.offers).toBeDefined()
      expect(schema.offers['@type']).toBe('Offer')
      expect(schema.offers.price).toBe(99.99)
      expect(schema.offers.priceCurrency).toBe('USD')
    })

    it('should include availability', () => {
      const schema = generateProductStructuredData(mockProduct)
      
      expect(schema.offers.availability).toContain('InStock')
    })

    it('should handle missing brand', () => {
      const productNoBrand = { ...mockProduct, brand: undefined }
      const schema = generateProductStructuredData(productNoBrand)
      
      expect(schema.brand.name).toBe('Various')
    })

    it('should include seller information', () => {
      const schema = generateProductStructuredData(mockProduct)
      
      expect(schema.offers.seller).toBeDefined()
      expect(schema.offers.seller['@type']).toBe('Organization')
      expect(schema.offers.seller.name).toBe('eBay')
    })
  })

  describe('generateBlogPostStructuredData', () => {
    const mockPost = {
      title: 'Test Blog Post',
      description: 'Test blog description',
      author: 'John Doe',
      datePublished: '2026-01-01',
      dateModified: '2026-01-15',
      image: 'https://example.com/blog-image.jpg',
      url: 'https://example.com/blog/test-post'
    }

    it('should generate valid blog post schema', () => {
      const schema = generateBlogPostStructuredData(mockPost)
      
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('BlogPosting')
    })

    it('should include title and description', () => {
      const schema = generateBlogPostStructuredData(mockPost)
      
      expect(schema.headline).toBe('Test Blog Post')
      expect(schema.description).toBe('Test blog description')
    })

    it('should include publication dates', () => {
      const schema = generateBlogPostStructuredData(mockPost)
      
      expect(schema.datePublished).toBe('2026-01-01')
      expect(schema.dateModified).toBe('2026-01-15')
    })

    it('should use datePublished as dateModified if not provided', () => {
      const postNoModified = { ...mockPost, dateModified: undefined }
      const schema = generateBlogPostStructuredData(postNoModified)
      
      expect(schema.dateModified).toBe('2026-01-01')
    })

    it('should include author information', () => {
      const schema = generateBlogPostStructuredData(mockPost)
      
      expect(schema.author).toBeDefined()
      expect(schema.author['@type']).toBe('Person')
      expect(schema.author.name).toBe('John Doe')
    })

    it('should include publisher information', () => {
      const schema = generateBlogPostStructuredData(mockPost)
      
      expect(schema.publisher).toBeDefined()
      expect(schema.publisher['@type']).toBe('Organization')
      expect(schema.publisher.name).toBe('DealsHub')
    })

    it('should include publisher logo', () => {
      const schema = generateBlogPostStructuredData(mockPost)
      
      expect(schema.publisher.logo).toBeDefined()
      expect(schema.publisher.logo['@type']).toBe('ImageObject')
      expect(schema.publisher.logo.url).toContain('icon-512x512.png')
    })

    it('should include featured image', () => {
      const schema = generateBlogPostStructuredData(mockPost)
      
      expect(schema.image).toBe('https://example.com/blog-image.jpg')
    })

    it('should include mainEntityOfPage', () => {
      const schema = generateBlogPostStructuredData(mockPost)
      
      expect(schema.mainEntityOfPage).toBeDefined()
      expect(schema.mainEntityOfPage['@type']).toBe('WebPage')
      expect(schema.mainEntityOfPage['@id']).toBe(mockPost.url)
    })
  })

  describe('Schema Validation', () => {
    it('should have valid @id references in site data', () => {
      const ids = siteStructuredData['@graph']
        .filter((item: any) => item['@id'])
        .map((item: any) => item['@id'])
      
      expect(ids.length).toBeGreaterThan(0)
      ids.forEach((id: string) => {
        expect(id).toMatch(/^https:\/\/ebay-store\.vercel\.app/)
      })
    })

    it('should have consistent base URL', () => {
      const baseUrl = 'https://ebay-store.vercel.app'
      
      const urls = siteStructuredData['@graph']
        .filter((item: any) => item.url)
        .map((item: any) => item.url)
      
      urls.forEach((url: string) => {
        expect(url).toContain(baseUrl)
      })
    })
  })
})
