# eBay API Integration Guide

This guide explains how to convert your ebay-store from static products to a fully API-driven affiliate system using the eBay Browse API.

## Overview

Your repository now includes all the necessary infrastructure for eBay API integration with proper affiliate tracking using Campaign ID: **5338903178**.

## What's Already Implemented

✅ **OAuth Token Management** - Automatic token generation and refresh
✅ **eBay Browse API Integration** - Search and fetch products
✅ **Affiliate URL Creation** - Automatic tracking parameter injection
✅ **Custom ID Support** - Granular tracking by category/source
✅ **Error Handling** - Fallback to search links if API fails
✅ **Caching** - 1-hour revalidation to reduce API calls

## Step 1: Get eBay API Credentials

### eBay Developer Program (Required)

1. Visit [developer.ebay.com](https://developer.ebay.com/)
2. Sign up or log in to your account
3. Navigate to [My Keys](https://developer.ebay.com/my/keys)
4. Create a **Production** keyset (not Sandbox)
5. Save your credentials:
   - **Client ID** (App ID)
   - **Client Secret** (Cert ID)

### eBay Partner Network (Required for Commissions)

You already have Campaign ID `5338903178` which is configured throughout the codebase.

1. Verify your account at [partnernetwork.ebay.com](https://partnernetwork.ebay.com)
2. Ensure Campaign ID `5338903178` is active
3. Monitor your dashboard for traffic and earnings

## Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# eBay API Credentials (Production)
EBAY_CLIENT_ID=YourAppId-YourApp-PRD-xxxxxxxxx-xxxxxxxx
EBAY_CLIENT_SECRET=PRD-xxxxxxxxxxxxxxxxx-xxxxxxxx

# Optional: Marketplace (defaults to EBAY_US)
EBAY_MARKETPLACE_ID=EBAY_US

# Optional: OAuth Scope (defaults to standard scope)
EBAY_OAUTH_SCOPE=https://api.ebay.com/oauth/api_scope
```

### Alternative: Manual Token (Advanced)

If you prefer to manage tokens yourself:

```bash
EBAY_OAUTH_TOKEN=v^1.1#i^1#r^0#p^3#f^0#t^H4sIAAA...
```

## Step 3: Update Your Pages to Use API

### Example: Fetch Products by Category

Replace hardcoded product arrays with API calls:

```typescript
import { searchEbayProducts, mapEbayItemToProduct } from '@/lib/ebay-api';
import { allProducts } from '@/lib/products'; // Fallback

export default async function ProductsPage() {
  let products = [];
  
  try {
    // Fetch live products from eBay API
    const electronicsData = await searchEbayProducts('electronics trending', 20);
    
    products = electronicsData.itemSummaries
      ?.map((item, index) => mapEbayItemToProduct(item, index, 'Electronics'))
      .filter(Boolean) || [];
    
  } catch (error) {
    console.error('eBay API error, using static products:', error);
    // Fallback to static products if API fails
    products = allProducts.filter(p => p.category === 'Electronics');
  }
  
  return <ProductGrid products={products} />;
}
```

### Example: Category-Based Product Fetching

```typescript
const categoryKeywords = {
  'Electronics': 'smartphone laptop tablet electronics',
  'Gaming': 'playstation xbox nintendo gaming console',
  'Sneakers': 'nike jordan adidas sneakers shoes',
  'Smart Home': 'echo alexa smart home devices',
  'Beauty': 'beauty cosmetics skincare makeup',
  'Fitness': 'fitness equipment exercise gym',
  // ... add more categories
};

async function fetchCategoryProducts(category: string, limit = 20) {
  const keyword = categoryKeywords[category] || category;
  const response = await searchEbayProducts(keyword, limit);
  
  return response.itemSummaries
    ?.map((item, index) => mapEbayItemToProduct(item, index, category))
    .filter(Boolean) || [];
}
```

## Step 4: Affiliate Tracking Details

### Built-in Tracking Parameters

All API-fetched products automatically include:

- **mkcid**: `1` (eBay Partner Network)
- **mkrid**: `711-53200-19255-0` (Routing ID)
- **siteid**: `0` (eBay US)
- **campid**: `5338903178` (Your Campaign ID)
- **customid**: `api-{category}` (e.g., `api-electronics`, `api-gaming`)

### Custom ID Tracking Strategy

The implementation uses custom IDs to differentiate:

- **API Products**: `api-electronics`, `api-gaming`, etc.
- **Static Products**: `static-electronics`, `static-gaming`, etc.
- **Search Results**: `fallback-{category}` (when API URL is unavailable)

This allows you to analyze in your EPN dashboard:
- Which categories perform best
- API vs static product conversion rates
- User behavior patterns

## Step 5: API Integration Status Check

Add an API status endpoint to monitor your integration:

```typescript
// app/api/ebay-status/route.ts
import { getEbayIntegrationStatus } from '@/lib/ebay-api';
import { NextResponse } from 'next/server';

export async function GET() {
  const status = getEbayIntegrationStatus();
  return NextResponse.json(status);
}
```

Access at: `https://your-site.vercel.app/api/ebay-status`

Expected response:
```json
{
  "mode": "client_credentials",
  "marketplaceId": "EBAY_US",
  "missing": []
}
```

## Step 6: Testing Your Integration

### 1. Local Testing

```bash
npm run dev
```

Check console for:
- ✅ Successful API token generation
- ✅ Product fetch without errors
- ✅ Affiliate links with correct parameters

### 2. Verify Affiliate Links

Click a product link and check the URL includes:
```
https://www.ebay.com/itm/123456789?mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=5338903178&customid=api-electronics
```

### 3. Test with Link Redirect Tracer

Install [Link Redirect Trace](https://chrome.google.com/webstore) browser extension:
1. Click a product on your site
2. Verify redirect chain includes `campid=5338903178`
3. Confirm final destination is eBay product page

### 4. Monitor EPN Dashboard

After going live:
1. Log in to [partnernetwork.ebay.com](https://partnernetwork.ebay.com)
2. Navigate to Reports > Campaign Reports
3. Filter by Campaign ID `5338903178`
4. Check for incoming clicks and conversions
5. Review Custom ID breakdown for category performance

## Step 7: Deploy to Production

### Vercel Deployment

1. Push your changes to GitHub
2. Go to [vercel.com](https://vercel.com) dashboard
3. Navigate to your project settings
4. Add Environment Variables:
   - `EBAY_CLIENT_ID`
   - `EBAY_CLIENT_SECRET`
   - `EBAY_MARKETPLACE_ID` (optional)
5. Redeploy your application

### Environment Variable Security

⚠️ **Never commit `.env.local` to GitHub**
- Your `.gitignore` should include `.env*.local`
- Only add variables through Vercel dashboard
- Rotate credentials if accidentally exposed

## API Rate Limits & Best Practices

### eBay API Limits

- **Production accounts**: 5,000 calls/day (standard)
- **Premium accounts**: Higher limits available

### Optimization Strategies

1. **Caching** (Already Implemented):
   ```typescript
   next: { revalidate: 3600 } // 1-hour cache
   ```

2. **Strategic Product Selection**:
   - Fetch trending/popular items only
   - Use static products for lesser categories
   - Rotate API categories daily

3. **Fallback System**:
   - Keep static products as backup
   - Gracefully handle API failures
   - Monitor error rates

## Advanced: Hybrid Approach (Recommended)

For optimal performance and reliability:

```typescript
// Featured products: Live API (high traffic)
const featuredProducts = await searchEbayProducts('trending electronics', 8);

// Category pages: Mix API + static
const apiProducts = await searchEbayProducts(category, 12);
const staticProducts = allProducts.filter(p => p.category === category).slice(0, 8);
const mixedProducts = [...apiProducts, ...staticProducts];

// Less popular categories: Static only
const staticOnly = allProducts.filter(p => p.category === 'Collectibles');
```

## Monitoring & Analytics

### Track API Performance

```typescript
import { track } from '@vercel/analytics';

try {
  const data = await searchEbayProducts(keyword, limit);
  track('ebay_api_success', { category, count: data.total });
} catch (error) {
  track('ebay_api_error', { category, error: error.message });
}
```

### EPN Dashboard Metrics

Monitor weekly:
- **Click-through Rate**: Clicks / Impressions
- **Conversion Rate**: Sales / Clicks
- **EPC** (Earnings Per Click): Revenue / Clicks
- **Category Performance**: Via Custom ID breakdown

## Troubleshooting

### No Products Returned

```typescript
const status = getEbayIntegrationStatus();
console.log('Integration Status:', status);

if (status.mode === 'disabled') {
  console.log('Missing credentials:', status.missing);
}
```

### 401 Unauthorized

- Verify credentials are correct
- Check if Production (not Sandbox) keys are used
- Ensure no extra spaces in environment variables

### 403 Forbidden

- Check API permissions in developer account
- Verify marketplace ID matches your account region

### No Clicks in EPN Dashboard

- Wait 24-48 hours for data to appear
- Verify `campid=5338903178` in actual click URLs
- Check that Campaign is active in EPN

## Support & Resources

- **eBay API Docs**: [developer.ebay.com/api-docs](https://developer.ebay.com/api-docs)
- **EPN Help**: [partnerhelp.ebay.com](https://partnerhelp.ebay.com)
- **API Status**: [developer.ebay.com/status](https://developer.ebay.com/support/api-status)
- **Community**: [eBay Developer Forums](https://community.ebay.com/)

## Next Steps

1. ✅ Get eBay API credentials
2. ✅ Configure environment variables
3. ✅ Update pages to fetch from API
4. ✅ Test affiliate links locally
5. ✅ Deploy to Vercel with production variables
6. ✅ Monitor EPN dashboard for clicks
7. ✅ Optimize based on performance data

---

**Questions?** Open an issue in this repository or check the eBay Developer documentation.
