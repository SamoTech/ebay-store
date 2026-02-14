import { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "../components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ebay-store.vercel.app"),
  title: {
    default: "DealsHub - Best Deals & Discounts on eBay | Affiliate Store 2025",
    template: "%s | DealsHub",
  },
  description: "Discover the best deals on electronics, gaming, sneakers, smart home, beauty, and collectibles from eBay. Find trending products at discounted prices with our affiliate store. Updated daily with 62+ products.",
  keywords: [
    "eBay deals",
    "best prices 2025",
    "electronics deals",
    "gaming consoles",
    "sneakers investment",
    "smart home devices",
    "beauty products deals",
    "collectibles investment",
    "online shopping deals",
    "affiliate marketing",
    "discount codes",
    "trending products 2025",
    "MacBook deals",
    "iPhone deals",
    "PlayStation 5 deals",
    "Nintendo Switch deals",
    "Air Jordan sneakers",
    "Dyson products deals",
    "eBay shopping guide",
    "best affiliate store",
  ],
  authors: [{ name: "DealsHub Team" }],
  creator: "DealsHub",
  publisher: "DealsHub",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ebay-store.vercel.app",
    siteName: "DealsHub",
    title: "DealsHub - Best Deals & Discounts on eBay | 62+ Trending Products",
    description: "Discover the best deals on electronics, gaming, sneakers, smart home, beauty, and collectibles from eBay. 62+ trending products updated daily.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DealsHub - Best Deals on eBay Electronics, Gaming, Sneakers",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dealshub",
    creator: "@dealshub",
    title: "DealsHub - Best Deals & Discounts on eBay | 62+ Products",
    description: "Discover the best deals on electronics, gaming, sneakers, smart home, beauty, and collectibles from eBay.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "X1nxK0xQYEDawvMKfYbIV2WzUE-1vajOWhLT_SnAtGg",
    yandex: "your-yandex-verification-code",
    other: {
      "msvalidate.01": "your-bing-verification-code",
      "p:domain_verify": "your-pinterest-code",
    },
  },
  alternates: {
    canonical: "https://ebay-store.vercel.app",
    types: {
      "application/rss+xml": "https://ebay-store.vercel.app/rss.xml",
      "application/atom+xml": "https://ebay-store.vercel.app/rss.xml",
    },
    languages: {
      "en-US": "https://ebay-store.vercel.app",
      "en-GB": "https://ebay-store.vercel.app",
      "en-CA": "https://ebay-store.vercel.app",
    },
  },
  category: "shopping",
  classification: "e-commerce, affiliate marketing, deals, online shopping",
  referrer: "origin-when-cross-origin",
  other: {
    "pinterest-rich-pin": "true",
    "reddit-og": "true",
    "ai-content": "shopping deals affiliate",
  },
  appleWebApp: {
    capable: true,
    title: "DealsHub",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

// JSON-LD Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://ebay-store.vercel.app/#website",
      url: "https://ebay-store.vercel.app",
      name: "DealsHub",
      description: "Best deals and discounts on eBay products - 62+ trending products in electronics, gaming, sneakers, smart home, beauty, and collectibles",
      inLanguage: "en-US",
      publisher: {
        "@id": "https://ebay-store.vercel.app/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://ebay-store.vercel.app/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://ebay-store.vercel.app/#organization",
      name: "DealsHub",
      url: "https://ebay-store.vercel.app",
      logo: {
        "@type": "ImageObject",
        url: "https://ebay-store.vercel.app/icon-512x512.png",
        width: 512,
        height: 512,
        caption: "DealsHub Logo",
      },
      image: {
        "@type": "ImageObject",
        url: "https://ebay-store.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
      },
      sameAs: [
        "https://twitter.com/dealshub",
        "https://www.facebook.com/dealshub",
        "https://www.instagram.com/dealshub",
        "https://www.pinterest.com/dealshub",
        "https://www.reddit.com/r/dealshub",
        "https://www.linkedin.com/company/dealshub",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://ebay-store.vercel.app/#webpage",
      url: "https://ebay-store.vercel.app",
      name: "DealsHub - Best Deals & Discounts on eBay",
      isPartOf: {
        "@id": "https://ebay-store.vercel.app/#website",
      },
      about: {
        "@id": "https://ebay-store.vercel.app/#organization",
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://ebay-store.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
      },
      breadcrumb: {
        "@id": "https://ebay-store.vercel.app/#breadcrumb",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://ebay-store.vercel.app/#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://ebay-store.vercel.app",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Products",
          item: "https://ebay-store.vercel.app/#products",
        },
      ],
    },
    {
      "@type": "ItemList",
      name: "Product Categories",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Electronics",
          item: "https://ebay-store.vercel.app/category/electronics",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Gaming",
          item: "https://ebay-store.vercel.app/category/gaming",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Sneakers",
          item: "https://ebay-store.vercel.app/category/sneakers",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Smart Home",
          item: "https://ebay-store.vercel.app/category/smart-home",
        },
        {
          "@type": "ListItem",
          position: 5,
          name: "Beauty",
          item: "https://ebay-store.vercel.app/category/beauty",
        },
        {
          "@type": "ListItem",
          position: 6,
          name: "Collectibles",
          item: "https://ebay-store.vercel.app/category/collectibles",
        },
      ],
    },
    {
      "@type": "Blog",
      "@id": "https://ebay-store.vercel.app/blog",
      url: "https://ebay-store.vercel.app/blog",
      name: "DealsHub Blog",
      description: "Shopping guides, product reviews, and affiliate marketing tips",
      publisher: {
        "@id": "https://ebay-store.vercel.app/#organization",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="X1nxK0xQYEDawvMKfYbIV2WzUE-1vajOWhLT_SnAtGg" />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="alternate" type="application/rss+xml" title="DealsHub Blog RSS" href="/rss.xml" />
        <meta name="pinterest-rich-pin" content="true" />
        <meta name="reddit-og" content="true" />
        <meta name="ai-content" content="shopping deals affiliate products" />
        <meta name="x-pinterest" content="nopin" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        {children}
        <SpeedInsights />
        <Analytics />
        
        {/* eBay Partner Network Tracking Script */}
        <Script id="epn-config" strategy="afterInteractive">
          {`window._epn = {campaign: 5338903178};`}
        </Script>
        <Script 
          src="https://epnt.ebay.com/static/epn-smart-tools.js" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
