/**
 * Site Metadata Configuration
 *
 * Centralized SEO metadata for the entire application.
 */

import { Metadata, Viewport } from 'next'
import { SITE_URL, absoluteUrl } from '../site'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1e40af',
}

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Saleh Store - eBay Deals & Product Discovery',
    template: '%s | Saleh Store',
  },
  description:
    'Discover products and deals from eBay across electronics, gaming, sneakers, smart home, beauty, collectibles, home, fitness, auto, and more.',
  keywords: [
    'eBay deals',
    'online shopping deals',
    'electronics deals',
    'gaming deals',
    'sneaker deals',
    'smart home deals',
    'shopping guides',
    'eBay shopping',
    'affiliate store',
  ],
  authors: [{ name: 'Saleh Store' }],
  creator: 'Saleh Store',
  publisher: 'Saleh Store',
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
    siteName: 'Saleh Store',
    title: 'Saleh Store - eBay Deals & Product Discovery',
    description:
      'Discover products and deals from eBay across electronics, gaming, sneakers, smart home, beauty, collectibles, home, fitness, auto, and more.',
    images: [
      {
        url: absoluteUrl('/og-image.svg'),
        width: 1200,
        height: 630,
        alt: 'Saleh Store - eBay deals and product discovery',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saleh Store - eBay Deals & Product Discovery',
    description:
      'Discover products and deals from eBay across electronics, gaming, sneakers, smart home, beauty, collectibles, home, fitness, auto, and more.',
    images: [absoluteUrl('/og-image.svg')],
  },
  verification: {
    google: 'X1nxK0xQYEDawvMKfYbIV2WzUE-1vajOWhLT_SnAtGg',
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': absoluteUrl('/rss.xml'),
    },
  },
  category: 'shopping',
  classification: 'e-commerce, affiliate marketing, deals, online shopping',
  referrer: 'strict-origin-when-cross-origin',
  other: {
    'pinterest-rich-pin': 'true',
    'reddit-og': 'true',
    'ai-content': 'shopping deals affiliate',
  },
  appleWebApp: {
    capable: true,
    title: 'Saleh Store',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png', sizes: '512x512' }],
    apple: [{ url: '/icon.png', type: 'image/png', sizes: '512x512' }],
    shortcut: '/icon.png',
  },
  manifest: '/manifest.json',
}
