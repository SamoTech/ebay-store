import type { MetadataRoute } from 'next';
import { allProducts, categories } from '../lib/products';

const SITE_URL = 'https://ebay-store.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages with high priority
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/favorites`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // Category pages - important for SEO
  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter((category) => category.slug !== 'all')
    .map((category) => ({
      url: `${SITE_URL}/category/${category.slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

  // Product pages - core content
  const productRoutes: MetadataRoute.Sitemap = allProducts.map((product) => ({
    url: `${SITE_URL}/product/${product.id}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Combine all routes
  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
  ];
}
