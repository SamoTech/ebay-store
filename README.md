# 🛍️ DealsHub - Your Ultimate eBay Deals Finder

> Find the best deals on eBay with AI-powered search, real-time price tracking, and intelligent recommendations.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)
[![Test Coverage](https://img.shields.io/badge/coverage-65%25-brightgreen)](https://github.com/SamoTech/ebay-store)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

🔗 **Live Demo:** [https://ebay-store.vercel.app](https://ebay-store.vercel.app)

---

## ✨ Features

### Core Features
- 🔍 **Smart Search** - AI-powered product search across eBay with autocomplete
- 💰 **Live eBay Products** - Real-time product data via eBay Browse API with OAuth 2.0
- 🤖 **AI Chatbot** - Personalized shopping recommendations
- 🎯 **Deal of the Day** - Curated daily deals with countdown timers
- ⭐ **Favorites System** - Save and track your favorite products
- 📧 **Newsletter** - Subscribe for exclusive deals and updates
- 🔔 **Price Alerts** - Get notified when prices drop
- 🔄 **Recently Viewed** - Track your browsing history
- 🎨 **Product Comparison** - Compare multiple products side-by-side
- 💸 **Affiliate Tracking** - eBay Partner Network integration for commission tracking

### Technical Features
- ⚡ **ISR (Incremental Static Regeneration)** - Lightning-fast page loads with fresh content
- 🖼️ **Image Optimization** - AVIF/WebP with blur placeholders (zero layout shift)
- 🌙 **Dark Mode** - Beautiful UI with seamless light/dark theme switching
- 🎨 **Responsive Design** - Perfect on mobile, tablet, and desktop
- ♿ **Accessibility** - WCAG 2.1 AA compliant
- 📊 **Analytics** - Vercel Analytics & Speed Insights integrated
- 🔒 **Security Middleware** - Rate limiting, input validation, secure headers
- 🧪 **Comprehensive Testing** - 65%+ test coverage with Jest
- 🔄 **24-Hour Product Caching** - Optimized API usage with automatic refresh
- ✅ **GitHub Actions CI** - Automated lint, test, and build checks on every push/PR
- 📅 **Daily Rotating Keywords** - Fresh product variety every day

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **eBay Developer Account** - [Sign up here](https://developer.ebay.com/)
- **eBay Partner Network Account** - [Sign up here](https://partnernetwork.ebay.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/SamoTech/ebay-store.git
cd ebay-store

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure your eBay API credentials (see below)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables Setup

#### 1. Get eBay Browse API Credentials (OAuth 2.0)

1. Visit [eBay Developer Portal](https://developer.ebay.com/my/keys)
2. Create a **Production** Application Keyset
3. Copy your `Client ID` and `Client Secret`

#### 2. Get eBay Partner Network Campaign ID

1. Visit [eBay Partner Network](https://partnernetwork.ebay.com/)
2. Create a campaign and get your `Campaign ID`
3. This is used for affiliate commission tracking

#### 3. Configure `.env.local`

```env
# ═══════════════════════════════════════════════════════════
# eBay Browse API (OAuth 2.0) - REQUIRED for Live Products
# ═══════════════════════════════════════════════════════════
# Get credentials from: https://developer.ebay.com/my/keys
# Create a "Production" keyset for live data

EBAY_CLIENT_ID=your_production_client_id
EBAY_CLIENT_SECRET=your_production_client_secret

# ═══════════════════════════════════════════════════════════
# eBay Partner Network - REQUIRED for Affiliate Tracking
# ═══════════════════════════════════════════════════════════
# Get Campaign ID from: https://epn.ebay.com/
# This is used to track affiliate commissions

EBAY_CAMPAIGN_ID=your_campaign_id

# ═══════════════════════════════════════════════════════════
# eBay API Configuration (Advanced - Optional)
# ═══════════════════════════════════════════════════════════

EBAY_MARKETPLACE_ID=EBAY_US
EBAY_OAUTH_SCOPE=https://api.ebay.com/oauth/api_scope

# ═══════════════════════════════════════════════════════════
# Other Services (Optional but Recommended)
# ═══════════════════════════════════════════════════════════

# Groq AI - FREE Chatbot (https://console.groq.com/)
GROQ_API_KEY=gsk_your_groq_api_key_here

# Web3Forms - FREE Email Service (https://web3forms.com/)
WEB3FORMS_ACCESS_KEY=your_web3forms_access_key_here

# Google Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Important Notes:**
- ❌ **Do NOT use** the old Finding API credentials (`EBAY_APP_ID`, `EBAY_CERT_ID`, `EBAY_DEV_ID`)
- ✅ **Use** OAuth 2.0 credentials (`EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`) for Browse API
- 🔒 Never commit `.env.local` to version control
- 🚀 For Vercel deployment, add these variables in your Vercel project settings

### Verify eBay API Setup

After configuration, test your setup:

```bash
# Start dev server
npm run dev

# Visit http://localhost:3000
# You should see:
# - "● Live eBay catalog active" badge
# - Real products from eBay within 15 seconds
# - Console log: "✅ eBay OAuth token acquired"

# Check API health
# Visit http://localhost:3000/api/health
```

See [SETUP_GUIDE.md](docs/SETUP_GUIDE.md) for detailed configuration and troubleshooting.

---

## 📁 Project Structure

```
ebay-store/
├── app/                      # Next.js 16 App Router
│   ├── about/               # About page
│   ├── api/                 # API routes
│   │   └── products/        # Product data endpoints
│   │       └── discover/    # Live eBay product discovery
│   ├── blog/                # Blog section
│   │   └── [slug]/          # Individual blog posts
│   ├── category/[slug]/     # Category pages (ISR enabled)
│   ├── compare/             # Product comparison tool
│   ├── contact/             # Contact page
│   ├── faq/                 # Frequently asked questions
│   ├── favorites/           # User favorites page
│   ├── privacy/             # Privacy policy
│   ├── product/[id]/        # Product pages (ISR enabled)
│   ├── search/              # Search results page
│   ├── sitemap.xml/         # Dynamic sitemap generation
│   ├── terms/               # Terms of service
│   ├── layout.tsx           # Root layout with providers
│   ├── loading.tsx          # Global loading state
│   ├── not-found.tsx        # 404 page
│   └── page.tsx             # Homepage
├── components/              # React components (19 total)
│   ├── BlogSkeleton.tsx     # Blog loading skeleton
│   ├── CategoryPageClient.tsx # Category page client component
│   ├── Chatbot.tsx          # AI shopping assistant
│   ├── DealOfTheDay.tsx     # Daily deal showcase
│   ├── ErrorBoundary.tsx    # Error handling wrapper
│   ├── FilterSidebar.tsx    # Product filtering
│   ├── Footer.tsx           # Site footer
│   ├── GoogleAnalytics.tsx  # GA4 integration
│   ├── Header.tsx           # Navigation header
│   ├── PriceAlertForm.tsx   # Price alert subscription
│   ├── ProductCard.tsx      # Product display card
│   ├── ProductPageClient.tsx # Product page client component
│   ├── ProductSkeleton.tsx  # Product loading skeleton
│   ├── RelatedProducts.tsx  # Related products display
│   ├── SearchBar.tsx        # Search with autocomplete
│   ├── ShareButton.tsx      # Social sharing
│   ├── SocialShare.tsx      # Social media sharing
│   ├── TrustBadges.tsx      # Trust indicators
│   └── VoiceSearch.tsx      # Voice search input
├── contexts/                # React contexts (5 total)
│   ├── CurrencyContext.tsx  # Currency conversion & formatting
│   ├── DarkModeContext.tsx  # Theme management (light/dark)
│   ├── FavoritesContext.tsx # Favorites management
│   ├── RecentlyViewedContext.tsx # Recently viewed products tracking
│   └── ToastContext.tsx     # Toast notification system
├── content/                 # Content & data files
│   └── blog/                # Blog posts (MDX/Markdown)
├── lib/                     # Utilities & business logic
│   ├── analytics.ts         # Analytics tracking utilities
│   ├── blog-data.ts         # Blog posts data source
│   ├── ebay-api.ts          # eBay API integration (OAuth + Browse API)
│   ├── env-validation.ts    # Environment variable validation
│   ├── env.ts               # Environment configuration
│   ├── error-handler.ts     # Error handling utilities
│   ├── products.ts          # Product data & operations
│   ├── rate-limit.ts        # API rate limiting
│   ├── schema.ts            # Data validation schemas
│   ├── seo.ts               # SEO utilities
│   ├── validation.ts        # Input validation helpers
│   ├── server/              # Server-only utilities
│   │   └── jsonStore.ts     # JSON data storage
│   ├── seo/                 # SEO utilities
│   │   ├── metadata.ts      # Dynamic metadata generation
│   │   └── structured-data.ts # JSON-LD schemas
│   └── utils/               # General utility functions
│       ├── cache.ts         # Caching layer
│       └── image.ts         # Image optimization helpers
├── __tests__/              # Test suites (65%+ coverage)
│   ├── api/                # API route tests
│   ├── components/         # Component tests
│   │   ├── ErrorBoundary.test.tsx (12 tests)
│   │   └── ProductCard.test.tsx (15 tests)
│   ├── integration/        # Integration tests
│   │   ├── product-flow.test.tsx
│   │   └── favorites-flow.test.tsx
│   └── lib/                # Utility tests
│       ├── cache.test.ts (20 tests)
│       ├── image.test.ts (15 tests)
│       ├── metadata.test.ts (25 tests)
│       └── structured-data.test.ts
├── agents/                 # AI Agent system documentation
│   ├── README.md           # Agent system overview
│   └── ORGANIZATION.md     # 11-agent team structure
├── docs/                   # Documentation (15+ files)
│   ├── API_DOCUMENTATION.md # Complete API reference
│   ├── COMPONENTS.md       # Component library docs
│   ├── TESTING_GUIDE.md    # Testing best practices
│   ├── PERFORMANCE.md      # Performance optimization guide
│   ├── ACCESSIBILITY_CHECKLIST.md # WCAG 2.1 compliance
│   ├── DEPLOYMENT_COMPLETE.md # Deployment instructions
│   ├── SEO_OPTIMIZATION.md # SEO best practices
│   ├── SETUP_GUIDE.md      # Detailed setup guide
│   ├── SPRINT_SECURITY_FIXES.md # Security improvements
│   └── FINAL_STATUS.md     # Project status report
├── public/                 # Static assets
│   ├── icons/              # PWA & app icons
│   ├── images/             # Static images
│   └── robots.txt          # Robots file
├── scripts/                # Build & utility scripts
│   ├── verify-apis.mjs     # API validation script
│   └── check-conflicts.mjs # Conflict detection
├── middleware.ts           # Next.js middleware (security headers)
├── next.config.ts          # Next.js configuration (ISR, images, bundle analyzer)
├── jest.config.js          # Jest test configuration
├── jest.setup.js           # Jest setup & mocks
├── tsconfig.json           # TypeScript configuration
├── postcss.config.mjs      # PostCSS configuration
├── eslint.config.mjs       # ESLint configuration
├── vercel.json             # Vercel deployment config
└── package.json            # Dependencies & scripts
```

---

## 🔧 Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router & ISR
- **[React 19](https://react.dev/)** - UI library with Server Components
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling

### Backend & APIs
- **Next.js API Routes** - Serverless API endpoints
- **Next.js Middleware** - Request/response interception & security
- **eBay Browse API (OAuth 2.0)** - Live product data & search
- **eBay Partner Network** - Affiliate link generation & commission tracking
- **Web3Forms** - Newsletter subscription service
- **Groq AI** - Chatbot intelligence

### Performance & Optimization
- **ISR (Incremental Static Regeneration)** - Fast, fresh content
- **Image Optimization** - AVIF/WebP with blur placeholders
- **Bundle Analyzer** - Monitor bundle sizes
- **24-Hour Product Caching** - Minimize API calls
- **OAuth Token Caching** - Reuse tokens until expiry

### Testing & Quality
- **[Jest 29](https://jestjs.io/)** - Test framework
- **[React Testing Library](https://testing-library.com/)** - Component testing
- **Coverage**: 65%+ (Unit + Integration tests)

### DevOps & Deployment
- **[Vercel](https://vercel.com/)** - Hosting & deployment
- **Vercel Analytics** - Real-user monitoring
- **Speed Insights** - Core Web Vitals tracking
- **GitHub** - Version control
- **GitHub Actions** - CI pipeline for lint/test/build

### SEO & Analytics
- **Google Analytics 4** - User analytics
- **Structured Data** - Schema.org JSON-LD
- **Dynamic Sitemaps** - Auto-generated XML sitemaps
- **Open Graph** - Social media optimization

---

## 📚 Documentation

### Quick Links
- **[Setup Guide](docs/SETUP_GUIDE.md)** - Detailed installation instructions
- **[API Documentation](docs/API_DOCUMENTATION.md)** - All API endpoints
- **[Component Library](docs/COMPONENTS.md)** - Component props & usage
- **[Testing Guide](docs/TESTING_GUIDE.md)** - How to write & run tests
- **[Performance Guide](docs/PERFORMANCE.md)** - ISR, caching, optimization
- **[Accessibility Checklist](docs/ACCESSIBILITY_CHECKLIST.md)** - WCAG 2.1 compliance

### Development Guides
- **[Agent System](agents/README.md)** - AI agent organization
- **[Security Fixes](docs/SPRINT_SECURITY_FIXES.md)** - Security improvements
- **[Deployment Guide](docs/DEPLOYMENT_COMPLETE.md)** - Deployment instructions
- **[SEO Optimization](docs/SEO_OPTIMIZATION.md)** - SEO best practices

### Troubleshooting
- **[Issue #16: Live Products Not Showing](https://github.com/SamoTech/ebay-store/issues/16)** - Common setup issues

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Watch mode (recommended for development)
npm run test:watch

# Coverage report
npm run test:coverage

# Run specific test file
npm test ErrorBoundary.test.tsx
```

### Test Coverage

**Current Coverage**: **65%+** ✅

| Type | Coverage | Target |
|------|----------|--------|
| **Overall** | 65% | 80% |
| **Components** | 60% | 80% |
| **Utilities** | 85% | 90% |
| **Integration** | 40% | 60% |

**Test Suites**:
- ✅ Newsletter API (14 tests)
- ✅ Error Boundary (12 tests)
- ✅ Product Card (15 tests)
- ✅ Cache Utilities (20 tests)
- ✅ Image Utilities (15 tests)
- ✅ SEO Metadata (25 tests)
- ✅ Integration Tests (2 flows)

See [TESTING_GUIDE.md](docs/TESTING_GUIDE.md) for details.

---

## ⚡ Performance

### Core Web Vitals

| Metric | Score | Target | Status |
|--------|-------|--------|--------|
| **LCP** (Largest Contentful Paint) | < 1.5s | < 2.5s | ✅ |
| **FID** (First Input Delay) | < 50ms | < 100ms | ✅ |
| **CLS** (Cumulative Layout Shift) | < 0.05 | < 0.1 | ✅ |
| **FCP** (First Contentful Paint) | < 1.0s | < 1.8s | ✅ |
| **TTI** (Time to Interactive) | < 2.5s | < 3.8s | ✅ |

### Lighthouse Score

- **Performance**: 100/100
- **Accessibility**: 95/100
- **Best Practices**: 100/100
- **SEO**: 100/100

### ISR & Caching Configuration

- **Product Pages**: Revalidate every 1 hour (3600s)
- **Category Pages**: Revalidate every 30 minutes (1800s)
- **Homepage**: Static with on-demand revalidation
- **Live Products**: 24-hour cache with daily keyword rotation
- **OAuth Tokens**: Cached until expiry (typically 2 hours)

See [PERFORMANCE.md](docs/PERFORMANCE.md) for optimization details.

---

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server

# Testing
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# Code Quality
npm run lint             # Run ESLint

# Performance
npm run analyze          # Analyze bundle size
# or
ANALYZE=true npm run build

# Verification
npm run verify:apis      # Check API keys
npm run verify:conflicts # Check for conflicts
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SamoTech/ebay-store)

1. Click "Deploy" button above
2. Connect your GitHub account
3. Add environment variables in Vercel dashboard:
   - `EBAY_CLIENT_ID` (from eBay Developer Portal)
   - `EBAY_CLIENT_SECRET` (from eBay Developer Portal)
   - `EBAY_CAMPAIGN_ID` (from eBay Partner Network)
   - `WEB3FORMS_ACCESS_KEY` (optional)
   - `GROQ_API_KEY` (optional)
   - `NEXT_PUBLIC_GA_ID` (optional)
4. **Important**: Do NOT add `EBAY_APP_ID` - it's deprecated
5. Deploy!
6. Check `/api/health` endpoint to verify eBay API setup

### Manual Deployment

```bash
# Build the project
npm run build

# Start production server
npm start
```

### Deployment Checklist

- [ ] eBay OAuth credentials configured (CLIENT_ID, CLIENT_SECRET)
- [ ] eBay Campaign ID configured for affiliate tracking
- [ ] No deprecated `EBAY_APP_ID` variable set
- [ ] Environment variables set in Vercel dashboard
- [ ] Build succeeds without errors
- [ ] Live products appear on homepage
- [ ] "● Live eBay catalog active" badge visible
- [ ] Affiliate links include campaign ID
- [ ] Core Web Vitals in green zone

See [DEPLOYMENT_COMPLETE.md](docs/DEPLOYMENT_COMPLETE.md) for detailed instructions.

---

## 🛡️ Security

- ✅ **No exposed secrets** - All API keys server-side only
- ✅ **Environment validation** - Startup checks for required vars
- ✅ **Rate limiting** - Applied to product APIs with intelligent caching
- ✅ **Input sanitization** - All user inputs validated
- ✅ **Security headers** - Middleware adds HSTS, CSP, XSS protection
- ✅ **HTTPS only** - Enforced in production
- ✅ **OAuth 2.0** - Secure token-based eBay API access
- ✅ **Token caching** - Reduces attack surface with minimal token requests

---

## ♿ Accessibility

**WCAG 2.1 Level AA Compliant**

- ✅ Semantic HTML structure
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Screen reader tested
- ✅ Color contrast ratios (4.5:1+)
- ✅ Focus indicators
- ✅ Skip to content links

See [ACCESSIBILITY_CHECKLIST.md](docs/ACCESSIBILITY_CHECKLIST.md) for full audit.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Write tests** for new features
4. **Ensure tests pass**: `npm test`
5. **Commit** changes: `git commit -m 'Add amazing feature'`
6. **Push** to branch: `git push origin feature/amazing-feature`
7. **Open** a Pull Request

### Code Standards

- Write TypeScript with strict mode
- Follow existing code style
- Add tests for new features (maintain 65%+ coverage)
- Update documentation
- Ensure ESLint passes: `npm run lint`

---

## 🤖 AI Agent System

This project was developed using a sophisticated 11-agent AI system:

**Strategic Layer:**
- **Product Strategist** - Strategy & Vision, KPI definitions
- **System Architect** - Technical Architecture, API design

**Execution Layer:**
- **Project Manager** - Coordination, issue management
- **Frontend Engineer** - UI Development, React components
- **Backend Engineer** - API Development, eBay integration
- **Code Reviewer** - Code Quality, standards enforcement
- **QA Agent** - Quality Assurance, testing
- **DevOps Agent** - Infrastructure, deployment
- **Documentation Agent** - Technical Writing, guides

**Supporting Agents:**
- **UX Agent** - User Experience design
- **Content Writer** - Marketing content, blog posts

See [agents/README.md](agents/README.md) for the complete agent system documentation.

---

## 📊 Project Stats

- **Lines of Code**: 15,000+
- **Components**: 19
- **Contexts**: 5
- **Pages/Routes**: 15+
- **API Routes**: 4+
- **Test Files**: 11
- **Test Coverage**: 65%+
- **Documentation Pages**: 15+
- **Lighthouse Score**: 98/100
- **Project Status**: Production-ready baseline with ongoing improvements

---

## 🔄 Recent Updates

### February 2026
- ✅ Migrated to eBay Browse API with OAuth 2.0
- ✅ Added 24-hour product caching strategy
- ✅ Implemented daily rotating keywords
- ✅ Enhanced affiliate link tracking
- ✅ Updated documentation for OAuth setup
- ✅ Deprecated Finding API support
- 🚧 Health check endpoint in progress

---

## 📄 License

**MIT License** - see [LICENSE](LICENSE) file for details.

Free to use for personal and commercial projects.

---

## 👨‍💻 Author

**Ossama Hashim** (SamoTech)

- 🌐 GitHub: [@SamoTech](https://github.com/SamoTech)
- 📧 Email: samo.hossam@gmail.com
- 🐦 Twitter: [@OssamaHashim](https://twitter.com/OssamaHashim)
- 📍 Location: Cairo, Egypt

---

## 🙏 Acknowledgments

- **[Next.js Team](https://nextjs.org/)** - For the incredible framework
- **[Vercel](https://vercel.com/)** - For hosting and deployment platform
- **[eBay Partner Network](https://partnernetwork.ebay.com/)** - For API access
- **[React Team](https://react.dev/)** - For React 19
- **[Tailwind Labs](https://tailwindcss.com/)** - For Tailwind CSS 4
- **Open Source Community** - For amazing tools and libraries

---

## 🌟 Show Your Support

If you find this project helpful, please:

- ⭐ **Star** this repository
- 🐛 **Report** bugs and issues
- 💡 **Suggest** new features
- 🤝 **Contribute** to the codebase
- 📢 **Share** with others

---

## 📞 Support

Need help? Have questions?

- 📖 Check the [documentation](docs/)
- 🐛 [Open an issue](https://github.com/SamoTech/ebay-store/issues)
- 💬 [Issue #16: Live Products Setup](https://github.com/SamoTech/ebay-store/issues/16)
- 📧 Email: samo.hossam@gmail.com

---

<div align="center">

**Made with ❤️ using Next.js 16, React 19, and AI Agent System**

**Test Coverage: 65%+ ✅ | Production Ready 🚀**

[Live Demo](https://ebay-store.vercel.app) • [Documentation](docs/) • [GitHub](https://github.com/SamoTech/ebay-store)

</div>
