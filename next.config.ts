import type { NextConfig } from 'next'

/**
 * Security Headers Configuration
 * 
 * Implements security best practices:
 * - Content Security Policy (CSP)
 * - HTTP Strict Transport Security (HSTS)
 * - X-Frame-Options (Clickjacking protection)
 * - X-Content-Type-Options (MIME sniffing protection)
 * - Referrer-Policy
 */
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

/**
 * Bundle Analyzer Configuration
 * Enable with: ANALYZE=true npm run build
 */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
})

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ebayimg.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'ir.ebaystatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },

  // Redirects (if needed)
  async redirects() {
    return []
  },

  // Rewrites (if needed)
  async rewrites() {
    return []
  },

  // TypeScript configuration
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },

  // 🚀 Next.js 16 Turbopack Configuration
  // Turbopack is now default - no webpack config needed
  // Turbopack automatically handles Node.js module exclusions from client bundles
  turbopack: {
    // Resolve aliases for browser compatibility
    resolveAlias: {
      // These modules are automatically excluded by Turbopack for client bundles
      // No need for explicit fallbacks like webpack required
    },
  },
}

export default withBundleAnalyzer(nextConfig)
