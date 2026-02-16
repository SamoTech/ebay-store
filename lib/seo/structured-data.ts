/**
 * Structured Data (JSON-LD) Configuration
 * 
 * Schema.org markup for enhanced search engine understanding.
 * Extracted from layout.tsx for better maintainability.
 */

/**
 * Site-wide structured data
 */
export const siteStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://ebay-store.vercel.app/#website',
      url: 'https://ebay-store.vercel.app',
      name: 'DealsHub',
      description:
        'Best deals and discounts on eBay products - 62+ trending products in electronics, gaming, sneakers, smart home, beauty, and collectibles',
      inLanguage: 'en-US',
      publisher: {
        '@id': 'https://ebay-store.vercel.app/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate:
            'https://ebay-store.vercel.app/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://ebay-store.vercel.app/#organization',
      name: 'DealsHub',
      url: 'https://ebay-store.vercel.app',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ebay-store.vercel.app/icon-512x512.png',
        width: 512,
        height: 512,
        caption: 'DealsHub Logo',
      },
      image: {
        '@type': 'ImageObject',
        url: 'https://ebay-store.vercel.app/og-image.svg',
        width: 1200,
        height: 630,
      },
      sameAs: [
        'https://twitter.com/dealshub',
        'https://www.facebook.com/dealshub',
        'https://www.instagram.com/dealshub',
        'https://www.pinterest.com/dealshub',
        'https://www.reddit.com/r/dealshub',
        'https://www.linkedin.com/company/dealshub',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        availableLanguage: ['English'],
      },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://ebay-store.vercel.app/#webpage',
      url: 'https://ebay-store.vercel.app',
      name: 'DealsHub - Best Deals & Discounts on eBay',
      isPartOf: {
        '@id': 'https://ebay-store.vercel.app/#website',
      },
      about: {
        '@id': 'https://ebay-store.vercel.app/#organization',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://ebay-store.vercel.app/og-image.svg',
        width: 1200,
        height: 630,
      },
      breadcrumb: {
        '@id': 'https://ebay-store.vercel.app/#breadcrumb',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://ebay-store.vercel.app/#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://ebay-store.vercel.app',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Products',
          item: 'https://ebay-store.vercel.app/#products',
        },
      ],
    },
    {
      '@type': 'ItemList',
      name: 'Product Categories',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Electronics',
          item: 'https://ebay-store.vercel.app/category/electronics',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Gaming',
          item: 'https://ebay-store.vercel.app/category/gaming',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Sneakers',
          item: 'https://ebay-store.vercel.app/category/sneakers',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Smart Home',
          item: 'https://ebay-store.vercel.app/category/smart-home',
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'Beauty',
          item: 'https://ebay-store.vercel.app/category/beauty',
        },
        {
          '@type': 'ListItem',
          position: 6,
          name: 'Collectibles',
          item: 'https://ebay-store.vercel.app/category/collectibles',
        },
      ],
    },
    {
      '@type': 'Blog',
      '@id': 'https://ebay-store.vercel.app/blog',
      url: 'https://ebay-store.vercel.app/blog',
      name: 'DealsHub Blog',
      description:
        'Shopping guides, product reviews, and affiliate marketing tips',
      publisher: {
        '@id': 'https://ebay-store.vercel.app/#organization',
      },
    },
  ],
}

/**
 * Generate product structured data
 */
export function generateProductStructuredData(product: {
  name: string
  description: string
  image: string
  price: number
  currency: string
  url: string
  brand?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Various',
    },
    offers: {
      '@type': 'Offer',
      url: product.url,
      priceCurrency: product.currency,
      price: product.price,
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      seller: {
        '@type': 'Organization',
        name: 'eBay',
      },
    },
  }
}

/**
 * Generate blog post structured data
 */
export function generateBlogPostStructuredData(post: {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified?: string
  image: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'DealsHub',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ebay-store.vercel.app/icon-512x512.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.url,
    },
  }
}
