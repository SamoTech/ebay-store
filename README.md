# DealsHub - Modern eBay Affiliate Store with Live API Integration

> A production-ready, full-stack affiliate marketing platform that connects users with the best deals from eBay through intelligent product curation and real-time API integration.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://ebay-store.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Live Demo

**[Visit DealsHub](https://ebay-store.vercel.app)** - Experience the platform live

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Integration](#-api-integration)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Affiliate Tracking](#-affiliate-tracking)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Performance](#-performance)
- [Monitoring & Analytics](#-monitoring--analytics)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About the Project

**DealsHub** is a modern, high-performance affiliate marketing platform built to showcase trending products from eBay's vast marketplace. The platform seamlessly combines curated product collections with real-time API integration, providing users with an intuitive shopping experience while generating affiliate revenue through the eBay Partner Network.

### 🌟 Project Vision

Create a sustainable, scalable affiliate business that:
- Delivers genuine value to shoppers through curated product selection
- Leverages eBay's 1.4+ million products via official Browse API
- Provides detailed analytics for data-driven optimization
- Maintains excellent performance with sub-second page loads
- Scales effortlessly with traffic growth

### 🎯 Target Audience

English-speaking online shoppers in:
- 🇺🇸 United States
- 🇨🇦 Canada  
- 🇬🇧 United Kingdom
- 🇦🇺 Australia
- 🌍 Other English-speaking regions

### 💡 Business Model

**Revenue Stream:** eBay Partner Network (EPN) affiliate commissions
- **Commission Rate:** Up to 4% on qualifying purchases
- **Cookie Duration:** 24 hours
- **Campaign ID:** 5338903178 (embedded in all affiliate links)
- **Payment Threshold:** $10 minimum
- **Tracking:** Real-time via custom IDs by category and source

---

## ✨ Key Features

### 🛍️ Product Discovery

- **120+ Live Products** fetched in real-time from eBay Browse API
- **12 Curated Categories** covering popular product types
- **Smart Search** with direct eBay integration
- **Category Filtering** for targeted browsing
- **Price Range Filters** for budget-conscious shopping
- **Multiple Sort Options** (name, price low-to-high, price high-to-low)
- **Product Comparison** tool (compare up to 3 products)
- **Recently Viewed** tracker for easy return navigation

### 🔄 Dual-Mode Operation

**Live API Mode** (Primary)
- Fetches fresh products hourly from eBay
- 10 products per category on homepage
- 20 products per category page
- Automatic OAuth token management
- Real-time pricing and availability

**Static Fallback Mode** (Backup)
- 62 manually curated premium products
- Guaranteed uptime if API unavailable
- Instant page loads (no API latency)
- SEO-optimized product descriptions

### 📊 Advanced Tracking & Analytics

**Custom ID Strategy for Granular Insights:**
```
api-electronics      → Live API products from Electronics category
api-gaming          → Live API products from Gaming category  
static-sneakers     → Curated static products from Sneakers
fallback-beauty     → Fallback links when API URL unavailable
```

**Benefits:**
- Track which categories perform best
- Compare API vs static product conversion
- Identify seasonal trends
- Optimize content strategy based on data

### 🎨 User Experience

- **Mobile-First Responsive Design** - Perfect on any device
- **Dark Mode Support** - Automatic theme switching
- **Skeleton Loading States** - Professional loading experience
- **Toast Notifications** - Real-time user feedback
- **Smooth Animations** - Polished interactions
- **Accessibility** - WCAG 2.1 AA compliant
- **Fast Navigation** - Instant client-side routing

### 📝 Content Marketing

- **Blog Section** with shopping guides and tips
- **Deal of the Day** spotlight feature
- **Category Landing Pages** with SEO-optimized content
- **Product Descriptions** with key features highlighted
- **Call-to-Actions** strategically placed

### 🔐 Security & Compliance

- **OAuth 2.0 Authentication** for eBay API
- **Environment Variables** for sensitive data
- **No User Data Collection** (fully GDPR compliant)
- **Secure Affiliate Links** with proper attribution
- **Rate Limiting** to prevent API abuse

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Vercel Edge   │ ← Next.js 15 (App Router)
│    Functions    │ ← React Server Components
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌─────────┐ ┌──────────────┐
│  Cache  │ │  API Routes  │
│(1 hour) │ │              │
└─────────┘ └──────┬───────┘
                   │
              ┌────┴────┐
              ↓         ↓
        ┌──────────┐ ┌────────────┐
        │ eBay API │ │   Static   │
        │(Browse)  │ │  Products  │
        └──────────┘ └────────────┘
                │
                ↓
        ┌──────────────┐
        │ EPN Dashboard│ ← Affiliate Tracking
        │(Campaign ID) │ ← Revenue Analytics
        └──────────────┘
```

### Data Flow

**Homepage Load:**
1. User visits site
2. Server fetches from `/api/products/discover`
3. Discover endpoint calls eBay API for 12 categories
4. Returns 120 products with affiliate tracking
5. Response cached for 1 hour (revalidate)
6. Page renders with "Live eBay catalog active" badge

**Category Page Load:**
1. User clicks category (e.g., Electronics)
2. Server fetches from `/api/products/category/electronics`
3. Category endpoint searches eBay with optimized query
4. Returns 20 category-specific products
5. Response cached for 1 hour
6. Page renders with "Live eBay products" badge

**Product Click:**
1. User clicks product card
2. Opens affiliate link with tracking parameters:
   ```
   https://ebay.com/itm/123456?
     mkcid=1&                    ← Partner Network
     mkrid=711-53200-19255-0&    ← Routing ID
     siteid=0&                   ← eBay US
     campid=5338903178&          ← Campaign ID
     customid=api-electronics    ← Category Tracking
   ```
3. eBay tracks click in EPN dashboard
4. If user purchases within 24h, commission earned

### API Architecture

**Core API Endpoints:**

| Endpoint | Purpose | Cache | Products |
|----------|---------|-------|----------|
| `/api/products/discover` | Homepage products | 1 hour | 120 (10/category) |
| `/api/products/category/[slug]` | Category products | 1 hour | 20 per category |
| `/api/ebay-status` | Health check | None | - |
| `/api/ebay-test` | Integration test | None | 5 (sample) |

**eBay API Integration (`lib/ebay-api.ts`):**
- OAuth 2.0 Client Credentials flow
- Automatic token refresh (expires 2 hours)
- Rate limiting: 5,000 calls/day (production)
- Search endpoint: `buy/browse/v1/item_summary/search`
- Marketplace: EBAY_US (configurable)

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library with Server Components
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[Headless UI](https://headlessui.com/)** - Accessible components

### Backend & API
- **[eBay Browse API v1](https://developer.ebay.com/api-docs/buy/browse/overview.html)** - Product data
- **OAuth 2.0** - Secure authentication
- **Next.js API Routes** - Serverless functions
- **Edge Runtime** - Ultra-fast response times

### Hosting & Infrastructure
- **[Vercel](https://vercel.com/)** - Deployment platform
- **Vercel Edge Network** - Global CDN
- **Vercel Analytics** - Performance monitoring
- **Vercel Speed Insights** - Core Web Vitals

### Development Tools
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Git** - Version control
- **GitHub Actions** - CI/CD pipelines

### Analytics & Monitoring
- **eBay Partner Network** - Affiliate tracking
- **Vercel Analytics** - Traffic insights
- **Custom Event Tracking** - User behavior

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm 9+ or yarn 1.22+
- Git ([Download](https://git-scm.com/))
- eBay Developer Account ([Sign Up](https://developer.ebay.com/))
- eBay Partner Network Account ([Join](https://partnernetwork.ebay.com/))

### Quick Start (Static Products Only)

Get up and running in 2 minutes:

```bash
# Clone the repository
git clone https://github.com/SamoTech/ebay-store.git
cd ebay-store

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

✅ You'll see 62 curated static products without any API setup!

### Full Setup (Live API Integration)

For real-time product fetching:

#### Step 1: Get eBay API Credentials

1. Go to [eBay Developer Portal](https://developer.ebay.com/my/keys)
2. Sign in or create account
3. Navigate to "Application Keys"
4. Create a new **Production** keyset (NOT Sandbox)
5. Save your:
   - **App ID** (Client ID)
   - **Cert ID** (Client Secret)

#### Step 2: Join eBay Partner Network

1. Visit [eBay Partner Network](https://partnernetwork.ebay.com)
2. Sign up for affiliate program
3. Create a campaign or use existing
4. Note your **Campaign ID**

#### Step 3: Configure Environment

Create `.env.local` in project root:

```bash
# eBay API Credentials (Production)
EBAY_CLIENT_ID=YourAppID-YourApp-PRD-xxxxxxxxx-xxxxxxxx
EBAY_CLIENT_SECRET=PRD-xxxxxxxxxxxxxxxxx-xxxxxxxx

# Optional: Marketplace (defaults to EBAY_US)
EBAY_MARKETPLACE_ID=EBAY_US

# Optional: OAuth Scope (defaults to standard)
EBAY_OAUTH_SCOPE=https://api.ebay.com/oauth/api_scope
```

⚠️ **Security:** Never commit `.env.local` - it's in `.gitignore`

#### Step 4: Update Campaign ID

Edit `lib/ebay-api.ts` and `lib/products.ts`:

```typescript
const CAMPID = 'YOUR_CAMPAIGN_ID'; // Replace with your Campaign ID
```

#### Step 5: Start Development

```bash
npm run dev
```

Visit [http://localhost:3000/api/ebay-test](http://localhost:3000/api/ebay-test)

Expected response:
```json
{
  "success": true,
  "productsFound": 5,
  "affiliateTrackingActive": true
}
```

✅ If you see this, your API integration is working!

---

## 🔌 API Integration

### Authentication Flow

```typescript
// lib/ebay-api.ts

// Step 1: Generate OAuth token
const token = await getEbayOAuthToken();

// Step 2: Search products
const response = await searchEbayProducts('electronics', 20);

// Step 3: Map to internal format with affiliate tracking
const products = response.itemSummaries.map((item, index) => 
  mapEbayItemToProduct(item, index, 'Electronics')
);
```

### Usage Examples

**Fetch Products by Category:**

```typescript
import { searchEbayProducts, mapEbayItemToProduct } from '@/lib/ebay-api';

const products = await searchEbayProducts('gaming console', 10);
const mapped = products.itemSummaries.map((item, idx) => 
  mapEbayItemToProduct(item, idx, 'Gaming')
);
```

**Check Integration Status:**

```typescript
import { getEbayIntegrationStatus } from '@/lib/ebay-api';

const status = getEbayIntegrationStatus();
// Returns: { mode: 'client_credentials', marketplaceId: 'EBAY_US', missing: [] }
```

**Create Affiliate Link:**

```typescript
import { createAffiliateUrl } from '@/lib/ebay-api';

const affiliateLink = createAffiliateUrl(
  'https://www.ebay.com/itm/123456789',
  'api-electronics'
);
// Returns URL with all tracking parameters
```

### API Endpoints Reference

#### GET `/api/ebay-status`

Check API configuration status.

**Response:**
```json
{
  "success": true,
  "mode": "client_credentials",
  "marketplaceId": "EBAY_US",
  "missing": []
}
```

#### GET `/api/ebay-test`

Test API integration with live product fetch.

**Response:**
```json
{
  "success": true,
  "test": {
    "productsFound": 5,
    "affiliateTrackingActive": true,
    "sampleProduct": {
      "title": "Apple iPhone 15 Pro Max",
      "price": 1199,
      "affiliateLink": "https://ebay.com/itm/..."
    }
  }
}
```

#### GET `/api/products/discover`

Fetch homepage product catalog.

**Response:**
```json
{
  "source": "ebay_live",
  "products": [...],
  "total": 120,
  "categoriesLoaded": 12
}
```

#### GET `/api/products/category/[slug]`

Fetch category-specific products.

**Example:** `/api/products/category/electronics`

**Response:**
```json
{
  "source": "ebay_live",
  "category": "Electronics",
  "products": [...],
  "total": 20,
  "totalAvailable": 1435689
}
```

---

## 📂 Project Structure

```
ebay-store/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 api/                      # API Routes
│   │   ├── 📁 ebay-status/          # Status check endpoint
│   │   ├── 📁 ebay-test/            # Integration test endpoint
│   │   ├── 📁 products/
│   │   │   ├── 📁 discover/         # Homepage products API
│   │   │   └── 📁 category/[slug]/  # Category products API
│   │   ├── 📁 alerts/               # Price alerts (future)
│   │   └── 📁 subscribe/            # Email subscription
│   ├── 📁 blog/                     # Blog posts
│   ├── 📁 category/[slug]/          # Category pages
│   ├── 📁 compare/                  # Product comparison
│   ├── 📁 favorites/                # User favorites
│   ├── 📁 product/[id]/             # Product details
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Homepage
│   └── globals.css                  # Global styles
│
├── 📁 components/                   # React Components
│   ├── CategoryPageClient.tsx       # Category page (with API)
│   ├── ProductCard.tsx              # Product card component
│   ├── ProductSkeleton.tsx          # Loading states
│   ├── SearchBar.tsx                # Search component
│   ├── DealOfTheDay.tsx             # Featured deal
│   ├── Footer.tsx                   # Site footer
│   └── ...                          # Other components
│
├── 📁 lib/                          # Core Libraries
│   ├── ebay-api.ts                  # eBay API integration ⭐
│   ├── products.ts                  # Product catalog & categories
│   ├── ebay.ts                      # Legacy helpers
│   ├── analytics.ts                 # Event tracking
│   └── types.ts                     # TypeScript definitions
│
├── 📁 contexts/                     # React Contexts
│   ├── RecentlyViewedContext.tsx    # Recently viewed tracker
│   └── ToastContext.tsx             # Toast notifications
│
├── 📁 docs/                         # Documentation
│   ├── API_INTEGRATION_GUIDE.md     # Complete API setup guide
│   ├── AFFILIATE_TRACKING.md        # Tracking reference
│   ├── TESTING_API.md               # Testing procedures
│   └── DEPLOYMENT_COMPLETE.md       # Deployment summary
│
├── 📁 public/                       # Static Assets
│   ├── images/                      # Product images
│   └── icons/                       # Site icons
│
├── 📁 scripts/                      # Utility Scripts
│   └── verify-apis.mjs              # API verification
│
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── next.config.js                   # Next.js configuration
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies
└── README.md                        # This file
```

### Key Files Explained

**`lib/ebay-api.ts`** (500+ lines)
- Complete eBay Browse API v1 integration
- OAuth 2.0 token management (auto-refresh)
- Product search with filters
- Affiliate URL generation with tracking
- Product data mapping and transformation
- Error handling and fallback logic

**`app/api/products/discover/route.ts`**
- Fetches products for homepage
- Queries 12 categories in parallel
- Returns 120 products total
- 1-hour cache revalidation
- Graceful fallback to static products

**`app/api/products/category/[slug]/route.ts`**
- Fetches products for specific category
- Optimized search queries per category
- Returns up to 20 products
- Category-specific custom IDs

**`components/CategoryPageClient.tsx`**
- Client-side category page component
- Fetches from category API endpoint
- Loading states with skeletons
- Filtering, sorting, comparison features
- Live product indicator badge

---

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EBAY_CLIENT_ID` | Yes* | - | Production App ID from eBay Developer Portal |
| `EBAY_CLIENT_SECRET` | Yes* | - | Production Cert ID from eBay Developer Portal |
| `EBAY_MARKETPLACE_ID` | No | `EBAY_US` | Target eBay marketplace (EBAY_US, EBAY_GB, etc.) |
| `EBAY_OAUTH_SCOPE` | No | `https://api.ebay.com/oauth/api_scope` | OAuth permissions scope |

*Required only for live API mode. Works without for static-only mode.

### Campaign Configuration

Update in `lib/ebay-api.ts` and `lib/products.ts`:

```typescript
// Affiliate Tracking Constants
const CAMPID = '5338903178';         // eBay Partner Network Campaign ID
const SITEID = '0';                   // eBay US (0), UK (3), Canada (2), etc.
const MKRID = '711-53200-19255-0';    // Routing ID for SITEID 0
const MKCID = '1';                    // Marketing Channel ID (1 = EPN)
```

### Category Search Queries

Optimize product relevance in `app/api/products/discover/route.ts`:

```typescript
const categoryQueries = [
  { category: 'Electronics', query: 'electronics laptop smartphone tablet trending' },
  { category: 'Gaming', query: 'gaming console playstation xbox nintendo switch' },
  { category: 'Sneakers', query: 'sneakers nike jordan adidas running shoes' },
  // Add more categories...
];
```

### Cache Configuration

Adjust revalidation time in API routes:

```typescript
export const revalidate = 3600; // 1 hour (3600 seconds)
```

Or per-request:

```typescript
fetch(url, { next: { revalidate: 3600 } });
```

---

## 💰 Affiliate Tracking

### How It Works

Every product link includes 5 tracking parameters:

```
https://www.ebay.com/itm/394792651234
  ?mkcid=1                           ← Marketing Channel (EPN)
  &mkrid=711-53200-19255-0           ← Routing ID (US)
  &siteid=0                          ← Site ID (eBay US)
  &campid=5338903178                 ← YOUR Campaign ID ⭐
  &customid=api-electronics          ← Category Tracking ⭐
```

### Custom ID Strategy

| Pattern | Meaning | Example |
|---------|---------|----------|
| `api-{category}` | Live API products | `api-electronics`, `api-gaming` |
| `static-{category}` | Curated static products | `static-sneakers`, `static-beauty` |
| `fallback-{category}` | Search fallback links | `fallback-home` |

### Benefits

✅ **Track Category Performance**
- Which categories drive most clicks?
- Which categories have best conversion?
- Which categories generate most revenue?

✅ **Compare API vs Static**
- Do live products perform better?
- Is curation more effective?
- ROI of API integration?

✅ **Seasonal Analysis**
- Gaming spikes during holidays?
- Fitness peaks in January?
- Optimize content calendar

### Monitoring in EPN Dashboard

1. Log in to [eBay Partner Network](https://partnernetwork.ebay.com)
2. Navigate to **Reports → Advanced Reports**
3. Add dimension: **Custom ID**
4. Filter by Campaign ID: **5338903178**
5. View breakdown:
   ```
   Custom ID          | Clicks | Revenue | EPC
   -------------------|--------|---------|------
   api-electronics    | 1,250  | $182.50 | $0.146
   api-gaming         | 890    | $134.20 | $0.151
   static-sneakers    | 620    | $78.40  | $0.126
   static-beauty      | 340    | $45.60  | $0.134
   ```

---

## 🧪 Testing

### Development Testing

```bash
# Start dev server
npm run dev

# Visit test endpoints
open http://localhost:3000/api/ebay-status
open http://localhost:3000/api/ebay-test

# Check homepage
open http://localhost:3000
```

### Production Testing

```bash
# Build for production
npm run build

# Start production server
npm start

# Load test (optional - requires autocannon)
npx autocannon http://localhost:3000
```

### API Integration Testing

**Test Checklist:**

- [ ] `/api/ebay-status` returns `"mode": "client_credentials"`
- [ ] `/api/ebay-test` returns `"success": true`
- [ ] `/api/ebay-test` shows `"affiliateTrackingActive": true`
- [ ] Homepage shows "Live eBay catalog active" badge
- [ ] Category pages show "Live eBay products" badge
- [ ] Product links contain `campid=5338903178`
- [ ] Product links contain `customid=api-{category}`
- [ ] Fallback to static works (disable API credentials)

### Verification Script

```bash
# Run automated checks
node scripts/verify-apis.mjs
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SamoTech/ebay-store&env=EBAY_CLIENT_ID,EBAY_CLIENT_SECRET)

**Manual Deploy:**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add:
     - `EBAY_CLIENT_ID` → Your Production App ID
     - `EBAY_CLIENT_SECRET` → Your Production Cert ID
     - `EBAY_MARKETPLACE_ID` → `EBAY_US` (optional)

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Visit your live site! 🎉

### Environment-Specific Deployment

**Development:**
```bash
npm run dev
```

**Preview (Staging):**
- Push to any branch
- Vercel auto-creates preview deployment
- Test before merging to production

**Production:**
- Push to `main` branch
- Vercel auto-deploys to production
- Zero-downtime deployment

### Post-Deployment Verification

1. **Check API Status:**
   ```
   https://your-site.vercel.app/api/ebay-status
   ```
   Should return: `{"mode": "client_credentials"}`

2. **Test Product Fetching:**
   ```
   https://your-site.vercel.app/api/ebay-test
   ```
   Should return: `{"success": true}`

3. **Verify Affiliate Tracking:**
   - Click any product on your site
   - Check URL contains: `campid=YOUR_CAMPAIGN_ID`

4. **Monitor EPN Dashboard:**
   - Wait 24-48 hours
   - Check for incoming clicks
   - Verify custom IDs appear

### Custom Domain (Optional)

1. Go to Vercel Project → Settings → Domains
2. Add your domain (e.g., `dealshub.com`)
3. Configure DNS records as instructed
4. Wait for SSL certificate (automatic)
5. Site live on custom domain! 🌐

---

## ⚡ Performance

### Current Metrics

- **Lighthouse Score:** 95+ (Performance)
- **First Contentful Paint:** < 1.2s
- **Time to Interactive:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **Largest Contentful Paint:** < 2.5s

### Optimization Strategies

**1. API Response Caching**
```typescript
export const revalidate = 3600; // 1 hour
```
- First request: ~2-3s (eBay API call)
- Cached requests: ~200ms (served from edge)
- Automatic revalidation every hour

**2. Image Optimization**
- Next.js Image component with automatic optimization
- WebP format with fallbacks
- Lazy loading below fold
- Responsive srcset generation

**3. Code Splitting**
- Route-based automatic splitting
- Dynamic imports for heavy components
- Tree-shaking unused code

**4. Edge Runtime**
- API routes deployed to Vercel Edge
- Global CDN (300+ locations)
- Sub-50ms response times

**5. Static Generation**
- Blog posts pre-rendered at build
- Category pages with ISR (Incremental Static Regeneration)
- Reduced server load

### Performance Monitoring

**Vercel Analytics:**
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Device and location breakdown

**Vercel Speed Insights:**
- Performance scores
- Improvement suggestions
- Historical trends

---

## 📊 Monitoring & Analytics

### eBay Partner Network (EPN)

**What to Monitor:**
- **Clicks** - Total traffic sent to eBay
- **Conversion Rate** - % of clicks that result in purchases
- **Revenue** - Total affiliate earnings
- **EPC** (Earnings Per Click) - Average revenue per click
- **Custom ID Performance** - Category breakdown

**Access:** [partnernetwork.ebay.com](https://partnernetwork.ebay.com)

**Reporting Frequency:**
- Real-time: Click tracking
- Daily: Revenue and conversions
- Monthly: Payment statements

### Vercel Analytics

**Metrics Tracked:**
- Page views and unique visitors
- Traffic sources and referrers
- Device and browser breakdown
- Geographic distribution
- Top pages and conversion paths

**Access:** Vercel Dashboard → Your Project → Analytics

### Custom Event Tracking

Implemented in `lib/analytics.ts`:

```typescript
trackEvent({
  event: 'product_click',
  productId: product.id,
  category: product.category,
  source: 'api' // or 'static'
});
```

**Events Tracked:**
- Product clicks
- Category navigation
- Search queries
- Comparison tool usage
- Favorites additions

---

## 📚 Documentation

Comprehensive guides available in `/docs/`:

- **[API Integration Guide](./docs/API_INTEGRATION_GUIDE.md)** - Complete setup instructions
- **[Affiliate Tracking Reference](./docs/AFFILIATE_TRACKING.md)** - Tracking parameters explained
- **[Testing Procedures](./docs/TESTING_API.md)** - Verification steps
- **[Deployment Summary](./docs/DEPLOYMENT_COMPLETE.md)** - Implementation overview

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Development Guidelines

- Follow existing code style (ESLint + Prettier)
- Write meaningful commit messages
- Test thoroughly before submitting
- Update documentation if needed
- Keep PRs focused and atomic

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What This Means

✅ **You CAN:**
- Use commercially
- Modify and distribute
- Use privately
- Sublicense

❌ **You CANNOT:**
- Hold liable
- Use trademark

---

## 🔗 Important Links

### Live Project
- **Production Site:** [ebay-store.vercel.app](https://ebay-store.vercel.app)
- **GitHub Repository:** [github.com/SamoTech/ebay-store](https://github.com/SamoTech/ebay-store)

### eBay Resources
- **Developer Portal:** [developer.ebay.com](https://developer.ebay.com/)
- **API Documentation:** [developer.ebay.com/api-docs](https://developer.ebay.com/api-docs)
- **Partner Network:** [partnernetwork.ebay.com](https://partnernetwork.ebay.com)
- **Partner Help:** [partnerhelp.ebay.com](https://partnerhelp.ebay.com)

### Technical Resources
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **React Docs:** [react.dev](https://react.dev)
- **Tailwind CSS:** [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **TypeScript:** [typescriptlang.org/docs](https://typescriptlang.org/docs)

---

## 📞 Support & Contact

### Getting Help

1. **Check Documentation** - Start with `/docs/` directory
2. **Search Issues** - Someone may have had the same question
3. **Open Issue** - Describe your problem with details
4. **EPN Support** - For affiliate program questions
5. **eBay API Support** - For API technical issues

### Reporting Bugs

Open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (browser, OS, etc.)

---

## 🙏 Acknowledgments

- **eBay** - For providing the Browse API and Partner Network
- **Vercel** - For exceptional hosting and deployment platform
- **Next.js Team** - For the amazing React framework
- **Open Source Community** - For tools and libraries used

---

## 📈 Project Stats

- **Lines of Code:** 10,000+
- **Components:** 25+
- **API Endpoints:** 8
- **Categories:** 12
- **Static Products:** 62
- **Documentation Pages:** 5
- **Test Coverage:** API integration tested

---

## 🗺️ Roadmap

### Planned Features

- [ ] **User Accounts** - Save favorites, price alerts
- [ ] **Email Notifications** - Price drops, new deals
- [ ] **Advanced Search** - Filters, sorting, facets
- [ ] **Product Reviews** - Aggregate eBay reviews
- [ ] **Wishlist Sharing** - Share favorite products
- [ ] **Mobile App** - React Native companion
- [ ] **Multi-Marketplace** - UK, Canada, Australia
- [ ] **AI Recommendations** - Personalized suggestions

### Future Enhancements

- Social media integration
- Newsletter subscription
- Blog content expansion
- Video product demos
- Live chat support
- Seasonal campaigns

---

<div align="center">

## 🌟 Star This Repository

If you find this project helpful, please give it a ⭐️!

**Built with ❤️ using Next.js, TypeScript, and eBay API**

---

### Quick Links

[Live Demo](https://ebay-store.vercel.app) • [Documentation](./docs/) • [Report Bug](https://github.com/SamoTech/ebay-store/issues) • [Request Feature](https://github.com/SamoTech/ebay-store/issues)

---

© 2026 DealsHub. All rights reserved.

</div>
