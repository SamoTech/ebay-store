/**
 * Schema.org Structured Data for SEO
 * 
 * Provides JSON-LD schema markup for:
 * - Products (rich snippets)
 * - Organization (brand identity)
 * - Breadcrumbs (navigation)
 * - Articles (blog posts)
 */

import React from 'react';
import { Product } from './products';

// Product Schema for rich snippets in Google Search
export interface ProductSchema {
  '@context': string;
  '@type': string;
  name: string;
  image: string;
  description: string;
  offers: {
    '@type': string;
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
    seller: {
      '@type': string;
      name: string;
    };
  };
}

export function generateProductSchema(product: Product): ProductSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.image,
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: product.affiliateLink,
      seller: {
        '@type': 'Organization',
        name: 'eBay'
      }
    }
  };
}

// Organization Schema for brand identity
export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
}

export function generateOrganizationSchema(siteUrl: string): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DealsHub',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Your trusted source for the best deals from eBay. Find electronics, gaming, sneakers, smart home devices, and more at unbeatable prices.',
    sameAs: [
      'https://twitter.com/dealshub',
      'https://facebook.com/dealshub',
      'https://instagram.com/dealshub'
    ]
  };
}

// Breadcrumb Schema for navigation
export interface BreadcrumbSchema {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item?: string;
  }>;
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url?: string }>): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url })
    }))
  };
}

// Article Schema for blog posts
export interface ArticleSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': string;
    name: string;
  };
  publisher: {
    '@type': string;
    name: string;
    logo: {
      '@type': string;
      url: string;
    };
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  modifiedAt?: string;
  author: string;
  siteUrl: string;
}): ArticleSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'DealsHub',
      logo: {
        '@type': 'ImageObject',
        url: `${article.siteUrl}/logo.png`
      }
    }
  };
}

/**
 * Helper to inject schema into page
 * Uses React.createElement to avoid JSX parsing issues with Turbopack
 */
export function SchemaScript({ schema }: { schema: any }) {
  return React.createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(schema) }
  });
}
