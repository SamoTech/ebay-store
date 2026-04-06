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

## 🏥 Repo Health

<!-- DEVLENS:START -->
![DevLens Health](https://img.shields.io/badge/DevLens%20Health-76%2F100-green?style=flat&logo=github) **Overall health: 76/100** — *Last updated: 2026-04-06*

| Dimension | Progress | Score | Weight |
|---|---|---|---|
| 📝 **README Quality** | `█████████░` | ![88](https://img.shields.io/badge/88-brightgreen?style=flat-square) | 20% |
| 🔥 **Commit Activity** | `██████████` | ![100](https://img.shields.io/badge/100-brightgreen?style=flat-square) | 20% |
| 🌿 **Repo Freshness** | `██████████` | ![100](https://img.shields.io/badge/100-brightgreen?style=flat-square) | 15% |
| 📚 **Documentation** | `███░░░░░░░` | ![32](https://img.shields.io/badge/32-red?style=flat-square) | 15% |
| ⚙️ **CI/CD Setup** | `██████░░░░` | ![60](https://img.shields.io/badge/60-green?style=flat-square) | 15% |
| 🎯 **Issue Response** | `██████████` | ![95](https://img.shields.io/badge/95-brightgreen?style=flat-square) | 10% |
| ⭐ **Community Signal** | `█░░░░░░░░░` | ![10](https://img.shields.io/badge/10-red?style=flat-square) | 5% |
<!-- DEVLENS:END -->

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
EBAY_CLIENT_ID=your_production_client_id
EBAY_CLIENT_SECRET=your_production_client_secret

# ═══════════════════════════════════════════════════════════
# eBay Partner Network - REQUIRED for Affiliate Tracking
# ═══════════════════════════════════════════════════════════
EBAY_CAMPAIGN_ID=your_campaign_id

# eBay API Configuration (Advanced - Optional)
EBAY_MARKETPLACE_ID=EBAY_US
EBAY_OAUTH_SCOPE=https://api.ebay.com/oauth/api_scope

# Other Services (Optional but Recommended)
GROQ_API_KEY=gsk_your_groq_api_key_here
WEB3FORMS_ACCESS_KEY=your_web3forms_access_key_here
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Important Notes:**
- ❌ **Do NOT use** the old Finding API credentials (`EBAY_APP_ID`, `EBAY_CERT_ID`, `EBAY_DEV_ID`)
- ✅ **Use** OAuth 2.0 credentials (`EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`) for Browse API
- 🔒 Never commit `.env.local` to version control

### Verify eBay API Setup

```bash
npm run dev
# Visit http://localhost:3000/api/health
```

See [SETUP_GUIDE.md](docs/SETUP_GUIDE.md) for detailed configuration and troubleshooting.

---

## 📁 Project Structure

```
ebay-store/
├── app/                      # Next.js 16 App Router
├── components/              # React components (19 total)
├── contexts/                # React contexts (5 total)
├── lib/                     # Utilities & business logic
├── __tests__/              # Test suites (65%+ coverage)
├── agents/                 # AI Agent system documentation
├── docs/                   # Documentation (15+ files)
└── public/                 # Static assets
```

See full structure in [docs/](docs/).

---

## 🔧 Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router & ISR
- **[React 19](https://react.dev/)** - UI library with Server Components
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling

### Backend & APIs
- **Next.js API Routes** - Serverless API endpoints
- **eBay Browse API (OAuth 2.0)** - Live product data & search
- **eBay Partner Network** - Affiliate link generation
- **Groq AI** - Chatbot intelligence

### Testing & Quality
- **[Jest 29](https://jestjs.io/)** + **[React Testing Library](https://testing-library.com/)**
- **Coverage**: 65%+ (Unit + Integration tests)

### DevOps
- **[Vercel](https://vercel.com/)** - Hosting & deployment
- **GitHub Actions** - CI pipeline

---

## 📚 Documentation

- **[Setup Guide](docs/SETUP_GUIDE.md)** - Detailed installation instructions
- **[API Documentation](docs/API_DOCUMENTATION.md)** - All API endpoints
- **[Component Library](docs/COMPONENTS.md)** - Component props & usage
- **[Testing Guide](docs/TESTING_GUIDE.md)** - How to write & run tests
- **[Performance Guide](docs/PERFORMANCE.md)** - ISR, caching, optimization
- **[Accessibility Checklist](docs/ACCESSIBILITY_CHECKLIST.md)** - WCAG 2.1 compliance

---

## 🧪 Testing

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

**Current Coverage**: **65%+** ✅

---

## ⚡ Performance

| Metric | Score |
|--------|-------|
| Performance | 100/100 |
| Accessibility | 95/100 |
| Best Practices | 100/100 |
| SEO | 100/100 |

---

## 🚀 Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SamoTech/ebay-store)

See [DEPLOYMENT_COMPLETE.md](docs/DEPLOYMENT_COMPLETE.md) for detailed instructions.

---

## 🛡️ Security

- ✅ No exposed secrets — all API keys server-side only
- ✅ Rate limiting on all product APIs
- ✅ Input sanitization & validation
- ✅ Security headers via middleware
- ✅ OAuth 2.0 for eBay API access

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Write tests, ensure they pass: `npm test`
4. Commit: `git commit -m 'Add amazing feature'`
5. Push & open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---

## 📄 License

**MIT License** — see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ossama Hashim** (SamoTech)
- 🌐 GitHub: [@SamoTech](https://github.com/SamoTech)
- 📧 Email: samo.hossam@gmail.com
- 📍 Location: Cairo, Egypt

---

<div align="center">

**Made with ❤️ using Next.js 16, React 19, and AI Agent System**

[Live Demo](https://ebay-store.vercel.app) • [Documentation](docs/) • [GitHub](https://github.com/SamoTech/ebay-store)

</div>
