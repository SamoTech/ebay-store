/**
 * Site Metadata Configuration
 * 
 * Centralized SEO metadata for the entire application.
 * Extracted from layout.tsx for better maintainability.
 */

import { Metadata, Viewport } from 'next'
import { SITE_URL, absoluteUrl } from '../site'

/**
 * Viewport configuration
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1e40af',
}

/**
 * Site metadata
 */
export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'DealsHub - Best Deals & Discounts on eBay | Affiliate Store 2026',
    template: '%s | DealsHub',
  },
  description:
    'Discover the best deals on electronics, gaming, sneakers, smart home, beauty, and collectibles from eBay. Find trending products at discounted prices with our affiliate store. Updated daily with 62+ products.',
  keywords: [
    'eBay deals',
    'best prices 2026',
    'electronics deals',
    'gaming consoles',
    'sneakers investment',
    'smart home devices',
    'beauty products deals',
    'collectibles investment',
    'online shopping deals',
    'affiliate marketing',
    'discount codes',
    'trending products 2026',
    'MacBook deals',
    'iPhone deals',
    'PlayStation 5 deals',
    'Nintendo Switch deals',
    'Air Jordan sneakers',
    'Dyson products deals',
    'eBay shopping guide',
    'best affiliate store',
  ],
  authors: [{ name: 'DealsHub Team' }],
  creator: 'DealsHub',
  publisher: 'DealsHub',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'DealsHub',
    title: 'DealsHub - Best Deals & Discounts on eBay | 62+ Trending Products',
    description:
      'Discover the best deals on electronics, gaming, sneakers, smart home, beauty, and collectibles from eBay. 62+ trending products updated daily.',
    images: [
      {
        url: absoluteUrl('/og-image.svg'),
        width: 1200,
        height: 630,
        alt: 'DealsHub - Best Deals on eBay Electronics, Gaming, Sneakers',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dealshub',
    creator: '@dealshub',
    title: 'DealsHub - Best Deals & Discounts on eBay | 62+ Products',
    description:
      'Discover the best deals on electronics, gaming, sneakers, smart home, beauty, and collectibles from eBay.',
    images: [absoluteUrl('/og-image.svg')],
  },
  verification: {
    google: 'X1nxK0xQYEDawvMKfYbIV2WzUE-1vajOWhLT_SnAtGg',
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': absoluteUrl('/rss.xml'),
      'application/atom+xml': absoluteUrl('/rss.xml'),
    },
    languages: {
      'en-US': SITE_URL,
      'en-GB': SITE_URL,
      'en-CA': SITE_URL,
    },
  },
  category: 'shopping',
  classification: 'e-commerce, affiliate marketing, deals, online shopping',
  referrer: 'origin-when-cross-origin',
  other: {
    'pinterest-rich-pin': 'true',
    'reddit-og': 'true',
    'ai-content': 'shopping deals affiliate',
  },
  appleWebApp: {
    capable: true,
    title: 'DealsHub',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180' },
      { url: '/icon-192x192.png', sizes: '192x192' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
}
