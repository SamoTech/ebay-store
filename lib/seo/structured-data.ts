import { SITE_URL, absoluteUrl } from '../site'

/**
 * Schema.org Structured Data (JSON-LD) Configuration.
 */

export const siteStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Saleh Store',
      description:
        'Product discovery and eBay deal guides across electronics, gaming, sneakers, smart home, beauty, collectibles, home, fitness, auto, and more.',
      inLanguage: 'en-US',
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Saleh Store',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/icon-512x512.png'),
        width: 512,
        height: 512,
        caption: 'Saleh Store logo',
      },
      image: {
        '@type': 'ImageObject',
        url: absoluteUrl('/og-image.svg'),
        width: 1200,
        height: 630,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        availableLanguage: ['English'],
      },
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: 'Saleh Store - eBay Deals & Product Discovery',
      isPartOf: {
        '@id': `${SITE_URL}/#website`,
      },
      about: {
        '@id': `${SITE_URL}/#organization`,
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: absoluteUrl('/og-image.svg'),
        width: 1200,
        height: 630,
      },
      breadcrumb: {
        '@id': `${SITE_URL}/#breadcrumb`,
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Products',
          item: `${SITE_URL}/#products`,
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
          item: `${SITE_URL}/category/electronics`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Gaming',
          item: `${SITE_URL}/category/gaming`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Sneakers',
          item: `${SITE_URL}/category/sneakers`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Smart Home',
          item: `${SITE_URL}/category/smart-home`,
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'Beauty',
          item: `${SITE_URL}/category/beauty`,
        },
        {
          '@type': 'ListItem',
          position: 6,
          name: 'Collectibles',
          item: `${SITE_URL}/category/collectibles`,
        },
      ],
    },
    {
      '@type': 'Blog',
      '@id': `${SITE_URL}/blog`,
      url: `${SITE_URL}/blog`,
      name: 'Saleh Store Blog',
      description: 'Shopping guides, product reviews, and deal education.',
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
  ],
}

/**
 * Generate product structured data.
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
 * Generate blog post structured data.
 */
export function generateBlogPostStructuredData(post: {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified?: string
  image: string
  url?: string
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
      name: 'Saleh Store',
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/icon-512x512.png'),
      },
    },
    ...(post.url
      ? {
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': post.url,
          },
        }
      : {}),
  }
}
