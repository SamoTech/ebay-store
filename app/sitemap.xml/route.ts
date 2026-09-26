import { NextResponse } from 'next/server';
import { allProducts, categories } from '../../lib/products';
import { blogArticles } from '../../lib/blog-data';
import { SITE_URL } from '../../lib/site';

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

const BASE_URL = SITE_URL;

interface SitemapEntry {
  loc: string;
  changefreq: string;
  priority: string;
}

function buildEntries(): SitemapEntry[] {
  const staticPages: SitemapEntry[] = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/blog', changefreq: 'weekly', priority: '0.8' },
    { loc: '/categories', changefreq: 'weekly', priority: '0.8' },
    { loc: '/about', changefreq: 'monthly', priority: '0.6' },
    { loc: '/about/editorial-team', changefreq: 'monthly', priority: '0.6' },
    { loc: '/tools/deal-comparison', changefreq: 'monthly', priority: '0.7' },
    { loc: '/research/ebay-deal-comparison-methodology', changefreq: 'monthly', priority: '0.7' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.6' },
    { loc: '/faq', changefreq: 'monthly', priority: '0.6' },
    { loc: '/privacy', changefreq: 'yearly', priority: '0.3' },
    { loc: '/cookies', changefreq: 'yearly', priority: '0.3' },
    { loc: '/terms', changefreq: 'yearly', priority: '0.3' },
    { loc: '/disclaimer', changefreq: 'yearly', priority: '0.3' },
  ];

  // `all` maps to the homepage, which is already listed above.
  const categoryPages: SitemapEntry[] = categories
    .filter((category) => category.slug !== 'all')
    .map((category) => ({
      loc: `/category/${category.slug}`,
      changefreq: 'daily',
      priority: '0.9',
    }));

  const productPages: SitemapEntry[] = allProducts
    .filter((product) => product.id < 1000)
    .map((product) => ({
      loc: `/product/${product.id}`,
      changefreq: 'weekly',
      priority: '0.7',
    }));

  const blogPages: SitemapEntry[] = blogArticles.map((article) => ({
    loc: `/blog/${article.slug}`,
    changefreq: 'monthly',
    priority: '0.6',
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}

export async function GET() {
  const entries = buildEntries();

  const body = entries
    .map(
      (entry) => `  <url>
    <loc>${BASE_URL}${entry.loc}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
