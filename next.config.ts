import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for better SEO
  output: 'standalone',
  
  // Image optimization
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'ebay-store.vercel.app'],
  },
  
  // Trailing slash for cleaner URLs
  trailingSlash: true,
  
  // Allow all crawlers
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
      {
        source: '/rss.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/rss+xml',
          },
        ],
      },
    ];
  },
  
  // Redirects for clean URLs
  async redirects() {
    return [
      {
        source: '/sitemap',
        destination: '/sitemap.xml',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
