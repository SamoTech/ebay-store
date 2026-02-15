import { MetadataRoute } from 'next';
import { allProducts } from '../lib/products';
import { blogArticles } from '../lib/blog-data';

const baseUrl = 'https://ebay-store.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Homepage
  const homepage = {
    url: baseUrl,
    lastModified: now,
    changeFrequency: 'hourly' as const,
    priority: 1.0,
  };

  // Blog pages
  const blogIndex = {
    url: `${baseUrl}/blog`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  };

  const blogPages = blogArticles.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Category pages
  const categories = [
    'electronics',
    'gaming',
    'sneakers',
    'smart-home',
    'beauty',
    'collectibles',
    'home',
    'fitness',
    'pet-supplies',
    'baby',
    'auto',
    'office',
  ];

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Product pages (ALL products, including API-generated ones)
  const productPages = allProducts.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // User pages
  const userPages = [
    {
      url: `${baseUrl}/favorites`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/comparison`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
  ];

  return [
    homepage,
    blogIndex,
    ...blogPages,
    ...categoryPages,
    ...productPages,
    ...userPages,
  ];
}
