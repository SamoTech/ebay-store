/**
 * Schema.org Structured Data for SEO
 *
 * Provides JSON-LD schema markup for products, organization,
 * breadcrumbs, and blog posts.
 */

import React from 'react';
import { Product } from './products';
import {
  generateBlogPostStructuredData,
  generateProductStructuredData,
} from './seo/structured-data';

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
  const schema = generateProductStructuredData({
    name: product.title,
    description: product.description,
    image: product.image,
    price: product.price,
    currency: product.currency || 'USD',
    url: product.affiliateLink,
    availability: 'InStock',
  });

  return {
    '@context': schema['@context'],
    '@type': schema['@type'],
    name: schema.name,
    image: schema.image,
    description: schema.description,
    offers: {
      '@type': schema.offers['@type'],
      price: String(schema.offers.price),
      priceCurrency: schema.offers.priceCurrency,
      availability: schema.offers.availability,
      url: schema.offers.url,
      seller: schema.offers.seller,
    },
  };
}

export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  description: string;
}

export function generateOrganizationSchema(siteUrl: string): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Saleh Store',
    url: siteUrl,
    logo: `${siteUrl}/icon-512x512.png`,
    description:
      'Product discovery and practical shopping guides focused on eBay listings, price comparison, and buyer research.',
  };
}

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

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

/**
 * Backward-compatible article schema wrapper.
 * New blog pages should provide their canonical URL to the centralized
 * generator directly through the optional url property.
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  modifiedAt?: string;
  author: string;
  siteUrl: string;
  url?: string;
}) {
  return generateBlogPostStructuredData({
    title: article.title,
    description: article.description,
    author: article.author,
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt,
    image: article.image,
    url: article.url,
  });
}

/**
 * Helper to inject schema into page.
 */
export function SchemaScript({ schema }: { schema: object }) {
  return React.createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(schema) },
  });
}
