import type { NextConfig } from 'next'

/**
 * Security Headers Configuration.
 */
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
})

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

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

  async headers() {
    const frameHeaders =
      process.env.NODE_ENV === 'production'
        ? [{ key: 'X-Frame-Options', value: 'DENY' }]
        : []

    return [
      {
        source: '/:path*',
        headers: [...securityHeaders, ...frameHeaders],
      },
    ]
  },

  async redirects() {
    return []
  },

  async rewrites() {
    return []
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  turbopack: {
    resolveAlias: {},
  },
}

export default withBundleAnalyzer(nextConfig)
