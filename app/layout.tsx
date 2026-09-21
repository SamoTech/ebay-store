/**
 * Root Layout
 * 
 * Provides global layout structure, SEO metadata, and context providers.
 * Metadata and structured data extracted to separate modules for maintainability.
 */

import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import Script from 'next/script'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Header from '../components/Header'
import { ToastProvider } from '../contexts/ToastContext'
import { FavoritesProvider } from '../contexts/FavoritesContext'
import { RecentlyViewedProvider } from '../contexts/RecentlyViewedContext'
import { DarkModeProvider } from '../contexts/DarkModeContext'
import { CurrencyProvider } from '../contexts/CurrencyContext'
import Chatbot from '../components/Chatbot'
import GoogleAnalytics from '../components/GoogleAnalytics'
import AffiliateTracking from '../components/AffiliateTracking'
import CookieConsent from '../components/CookieConsent'
import { ErrorBoundary } from '../components/ErrorBoundary'

// SEO Configuration (imported from separate modules)
import { siteMetadata, viewport } from '../lib/seo/metadata'
import { siteStructuredData } from '../lib/seo/structured-data'

// Export SEO configuration
export { viewport }
export const metadata = siteMetadata

/**
 * Root Layout Component
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA & Mobile */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="DealsHub" />
        
        {/* Search Engine Verification */}
        <meta name="google-site-verification" content="X1nxK0xQYEDawvMKfYbIV2WzUE-1vajOWhLT_SnAtGg" />
        
        {/* Structured Data (JSON-LD) */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteStructuredData) }}
        />
        
        {/* RSS Feed */}
        <link rel="alternate" type="application/rss+xml" title="DealsHub Blog RSS" href="/rss.xml" />
        
        {/* Social Media Meta Tags */}
        <meta name="pinterest-rich-pin" content="true" />
        <meta name="reddit-og" content="true" />
        <meta name="ai-content" content="shopping deals affiliate products" />
        <meta name="x-pinterest" content="nopin" />
      </head>
      
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        {/* Google Analytics */}
        <GoogleAnalytics />
        <AffiliateTracking />
        
        {/* Global Error Boundary */}
        <ErrorBoundary>
          {/* Context Providers */}
          <DarkModeProvider>
            <CurrencyProvider>
              <ToastProvider>
                <FavoritesProvider>
                  <RecentlyViewedProvider>
                    {/* Header Navigation */}
                    <Header />
                    
                    {/* Main Content */}
                    <main>
                      {children}
                    </main>
                    
                    {/* AI Chatbot - Available on all pages */}
                    <Chatbot />
                    
                    {/* Vercel Analytics */}
                    <SpeedInsights />
                    <Analytics />
                  </RecentlyViewedProvider>
                </FavoritesProvider>
              </ToastProvider>
            </CurrencyProvider>
          </DarkModeProvider>
        </ErrorBoundary>
        
        {/* Cookie preferences */}
        <CookieConsent />
      </body>
    </html>
  )
}
