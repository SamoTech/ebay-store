# DealsHub - eBay Affiliate Store

An affiliate marketing website that features trending products from eBay, targeting customers in the USA, Canada, and Europe.

## 🌐 Live Website

**[DealsHub](https://ebay-store.vercel.app)** – Best Deals & Discounts

## 📋 Overview

DealsHub is a Next.js-based affiliate store that showcases trending products from eBay across multiple categories. The website is designed for English-speaking audiences in North America and Europe.

The site supports both **static product listings** and **live eBay API integration** for real-time product fetching with automatic affiliate tracking.

## ✨ Features

- **62+ Curated Products** across 13 categories
- **eBay API Integration** - Ready for live product fetching
- **Automatic Affiliate Tracking** - Campaign ID 5338903178
- **Custom ID Tracking** - Granular analytics by category and source
- **13 Categories**: Electronics, Gaming, Sneakers, Smart Home, Beauty, Collectibles, Home, Fitness, Pet Supplies, Baby, Auto, Office
- **Category Filtering** - Easy product discovery
- **Search Function** - Live eBay search capability
- **Blog Section** - Shopping guides and tips
- **Responsive Design** - Mobile-first approach
- **SEO Optimized** - Better search rankings
- **Vercel Speed Insights** - Performance monitoring

## 🔗 Affiliate Program

This project uses the eBay Partner Network (EPN) with comprehensive tracking:

- **Campaign ID**: 5338903178
- **Tracking Parameters**: `mkcid`, `mkrid`, `siteid`, `campid`, `customid`
- **Custom ID Strategy**: 
  - API products: `api-{category}`
  - Static products: `static-{category}`
  - Fallback links: `fallback-{category}`

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **API**: eBay Browse API v1
- **Authentication**: OAuth 2.0 (Client Credentials)
- **Hosting**: Vercel
- **Analytics**: Vercel Analytics & Speed Insights

## 🚀 Getting Started

### Basic Setup (Static Products)

```bash
git clone https://github.com/SamoTech/ebay-store.git
cd ebay-store
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the site.

### Full API Integration (Live Products)

For real-time product fetching from eBay:

1. **Get eBay API Credentials**:
   - Sign up at [developer.ebay.com](https://developer.ebay.com/)
   - Create a Production keyset
   - Save your Client ID and Client Secret

2. **Configure Environment Variables**:
   ```bash
   # Create .env.local file
   EBAY_CLIENT_ID=your-production-app-id
   EBAY_CLIENT_SECRET=your-production-cert-id
   EBAY_MARKETPLACE_ID=EBAY_US
   ```

3. **Update Your Pages** to fetch from API:
   ```typescript
   import { searchEbayProducts, mapEbayItemToProduct } from '@/lib/ebay-api';
   
   const products = await searchEbayProducts('electronics', 20);
   ```

4. **Deploy to Vercel**:
   - Add environment variables in Vercel dashboard
   - Deploy and monitor EPN dashboard for clicks

📖 **Full Integration Guide**: See [docs/API_INTEGRATION_GUIDE.md](./docs/API_INTEGRATION_GUIDE.md) for comprehensive instructions.

## 📂 Project Structure

```
ebay-store/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/
│   ├── ebay-api.ts        # eBay API integration
│   ├── products.ts        # Static products & categories
│   └── ebay.ts            # Legacy eBay helpers
├── docs/
│   └── API_INTEGRATION_GUIDE.md  # Full API setup guide
├── public/                 # Static assets
└── scripts/                # Utility scripts
```

## 🔑 Key Files

- **`lib/ebay-api.ts`**: Complete eBay API implementation with OAuth, search, and affiliate tracking
- **`lib/products.ts`**: Static product catalog with 62 curated items
- **`env.example`**: Template for required environment variables

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EBAY_CLIENT_ID` | Yes* | - | eBay Production App ID |
| `EBAY_CLIENT_SECRET` | Yes* | - | eBay Production Cert ID |
| `EBAY_MARKETPLACE_ID` | No | `EBAY_US` | Target marketplace |
| `EBAY_OAUTH_SCOPE` | No | Standard scope | API permissions |

*Required only for live API integration

### Affiliate Tracking Constants

Defined in `lib/ebay-api.ts` and `lib/products.ts`:

```typescript
const CAMPID = '5338903178';  // Your Campaign ID
const SITEID = '0';           // eBay US
const MKRID = '711-53200-19255-0';
const MKCID = '1';            // eBay Partner Network
```

## 📊 Monitoring & Analytics

### Vercel Analytics
- Traffic and user behavior
- Page performance metrics
- Core Web Vitals

### eBay Partner Network Dashboard
- Campaign performance (ID: 5338903178)
- Click-through rates
- Conversion tracking
- Earnings per click (EPC)
- Custom ID breakdown by category

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Verify API integration
node scripts/verify-apis.mjs
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SamoTech/ebay-store)

1. Connect your GitHub repository
2. Add environment variables in project settings
3. Deploy automatically on every push

### Manual Deployment

```bash
npm run build
npm start
```

## 🔐 Security Notes

- Never commit `.env.local` or `.env` files
- Use Vercel dashboard for production environment variables
- Rotate API credentials if accidentally exposed
- Monitor API usage to prevent quota exhaustion

## 📈 Performance Optimization

- **Caching**: API responses cached for 1 hour
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic with Next.js App Router
- **Fallback System**: Static products when API unavailable

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Links

- **Live Site**: [ebay-store.vercel.app](https://ebay-store.vercel.app)
- **Repository**: [github.com/SamoTech/ebay-store](https://github.com/SamoTech/ebay-store)
- **eBay Developer Program**: [developer.ebay.com](https://developer.ebay.com/)
- **eBay Partner Network**: [partnernetwork.ebay.com](https://partnernetwork.ebay.com)

## 📞 Support

For questions or issues:
- Open an issue in this repository
- Check the [API Integration Guide](./docs/API_INTEGRATION_GUIDE.md)
- Review [eBay API documentation](https://developer.ebay.com/api-docs)

---

**Built with ❤️ using Next.js and eBay API**
