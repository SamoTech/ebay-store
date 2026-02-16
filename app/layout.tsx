import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import NewsletterPopup from "@/components/NewsletterPopup";
import { ToastProvider } from "@/contexts/ToastContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://ebay-store.vercel.app'),
  title: {
    default: 'DealsHub - Find the Best eBay Deals & Offers',
    template: '%s | DealsHub'
  },
  description: 'Discover amazing deals on eBay with AI-powered search. Find electronics, fashion, home goods, and more at unbeatable prices. Shop smarter with DealsHub.',
  keywords: [
    'eBay deals',
    'online shopping',
    'best offers',
    'discount products',
    'eBay search',
    'shopping deals',
    'cheap products',
    'online marketplace',
    'deal finder',
    'price comparison',
    'electronics deals',
    'fashion deals',
    'home goods',
    'bargain shopping'
  ],
  authors: [{ name: 'Ossama Hashim', url: 'https://github.com/SamoTech' }],
  creator: 'SamoTech',
  publisher: 'DealsHub',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ebay-store.vercel.app',
    title: 'DealsHub - Find the Best eBay Deals & Offers',
    description: 'Discover amazing deals on eBay with AI-powered search. Shop smarter with DealsHub.',
    siteName: 'DealsHub',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DealsHub - Best eBay Deals Finder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DealsHub - Find the Best eBay Deals & Offers',
    description: 'Discover amazing deals on eBay with AI-powered search. Shop smarter with DealsHub.',
    creator: '@SamoTech',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://ebay-store.vercel.app',
  },
  verification: {
    google: 'google-site-verification-code-here',
  },
  category: 'e-commerce',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <NewsletterPopup delay={5000} />
        </ToastProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
