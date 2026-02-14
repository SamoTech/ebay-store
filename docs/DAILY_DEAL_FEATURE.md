# Daily Deal Feature Documentation

## Overview

The **Deal of the Day** feature automatically showcases a trending, high-discount product from eBay that changes every 24 hours. It fetches real products with genuine discounts (20%+ off) and displays them prominently on the homepage.

---

## How It Works

### Daily Rotation Logic

```
1. Calculate day of year (1-365)
2. Use modulo to select from rotating query list
3. Fetch products from eBay matching that query
4. Filter for items with 20%+ discount
5. Select one deal based on day (consistent all day)
6. Deal changes at midnight (00:00 local time)
7. Cache for 1 hour for performance
```

### Search Query Rotation

Deals rotate through 7 different trending categories:

| Day Mod 7 | Query | Expected Products |
|-----------|-------|-------------------|
| 0 | electronics trending deals discount | Laptops, phones, tablets |
| 1 | gaming console playstation xbox deals | Gaming consoles, accessories |
| 2 | nike jordan sneakers limited | Limited edition sneakers |
| 3 | apple macbook iphone deals | Apple products |
| 4 | smart home alexa echo discount | Smart speakers, devices |
| 5 | beauty dyson trending deals | Beauty tech, hair tools |
| 6 | collectibles pokemon cards rare | Trading cards, collectibles |

**Result:** Fresh variety every day, covering all major categories over a week.

---

## API Endpoint

### GET `/api/products/daily-deal`

**Purpose:** Fetch the current Deal of the Day

**Cache:** 1 hour (3600 seconds)

**Response:**

```json
{
  "source": "ebay_live",
  "deal": {
    "id": 1001,
    "title": "Apple MacBook Pro 14\" M3 Pro - Like New",
    "price": 1599.99,
    "originalPrice": 2499.00,
    "currency": "USD",
    "image": "https://i.ebayimg.com/images/...",
    "category": "Electronics",
    "affiliateLink": "https://www.ebay.com/itm/123456?mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=5338903178&customid=api-deal",
    "description": "Powerful M3 Pro chip with 12-core CPU",
    "rating": 5
  },
  "rotatesAt": "midnight",
  "totalDealsAvailable": 8,
  "query": "electronics trending deals discount"
}
```

**Response Fields:**

- `source` - Data source:
  - `ebay_live` - Live product from eBay API with real discount
  - `static` - Curated featured product (API disabled)
  - `fallback_static` - Static fallback (no good deals found or error)
- `deal` - Product object with all details
- `rotatesAt` - When deal changes (always "midnight")
- `totalDealsAvailable` - How many qualifying deals were found
- `query` - Search query used to find deals

---

## Filtering Criteria

### What Makes a "Deal of the Day"?

Products must meet ALL criteria:

1. **Has Original Price** - `marketingPrice.originalPrice` exists
2. **Has Current Price** - `price.value` exists
3. **Original > Current** - Genuine price reduction
4. **20%+ Discount** - Minimum discount threshold:
   ```typescript
   discount = ((originalPrice - currentPrice) / originalPrice) * 100
   discount >= 20  // Must be true
   ```
5. **Good Quality** - From eBay search relevance ranking

### Why 20% Minimum?

- Ensures genuinely good deals
- Filters out "fake" discounts (was $101, now $100)
- Creates excitement and urgency
- Industry standard for "hot deal"

### Example Calculations

**Qualifies (25% off):**
```
Original: $400
Current:  $300
Discount: ($400 - $300) / $400 = 0.25 = 25% ✅
```

**Doesn't Qualify (15% off):**
```
Original: $200
Current:  $170
Discount: ($200 - $170) / $200 = 0.15 = 15% ❌
```

---

## Component Implementation

### DealOfTheDay.tsx

Located at: `components/DealOfTheDay.tsx`

**Features:**

1. **Fetches from API** on component mount
2. **Loading state** - Shows pulsing placeholder
3. **Countdown timer** - Real-time countdown to midnight
4. **Live indicator** - "● LIVE DEAL" badge when from API
5. **Discount badge** - "🔥 -25% OFF" based on prices
6. **Favorite button** - Add to favorites
7. **View details** - Link to product page
8. **Affiliate tracking** - Tracks clicks by source:
   - `deal_of_the_day_live` - Live API deals
   - `deal_of_the_day_static` - Static fallback deals

**Graceful Fallback:**

If API fetch fails:
1. Catches error silently
2. Falls back to static featured products
3. Selects product based on day of year
4. Works identically from user perspective

---

## Daily Query Selection

### Code Implementation

```typescript
// app/api/products/daily-deal/route.ts

const dealQueries = [
  'electronics trending deals discount',      // Monday
  'gaming console playstation xbox deals',    // Tuesday
  'nike jordan sneakers limited',             // Wednesday
  'apple macbook iphone deals',               // Thursday
  'smart home alexa echo discount',           // Friday
  'beauty dyson trending deals',              // Saturday
  'collectibles pokemon cards rare',          // Sunday (repeats)
];

function getDailyQuery(): string {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  
  return dealQueries[dayOfYear % dealQueries.length];
}
```

**Result:** Same query all day, changes at midnight

---

## Customization Options

### 1. Adjust Discount Threshold

Edit `app/api/products/daily-deal/route.ts`:

```typescript
// Change from 20% to 30%
return discount >= 30;
```

### 2. Add More Query Rotations

```typescript
const dealQueries = [
  'electronics trending deals discount',
  'gaming console playstation xbox deals',
  'nike jordan sneakers limited',
  'apple macbook iphone deals',
  'smart home alexa echo discount',
  'beauty dyson trending deals',
  'collectibles pokemon cards rare',
  'fitness equipment weights deals',        // NEW
  'baby stroller car seat deals',          // NEW
  'home kitchen appliances discount',      // NEW
];
```

### 3. Change Cache Duration

```typescript
// Default: 1 hour
export const revalidate = 3600;

// Change to 30 minutes
export const revalidate = 1800;

// Change to 2 hours
export const revalidate = 7200;
```

### 4. Fetch More Deals

```typescript
// Default: Fetch 20, filter, select 1
const data = await searchEbayProducts(query, 20);

// Fetch 50 for more variety
const data = await searchEbayProducts(query, 50);
```

---

## Testing

### Test API Endpoint

```bash
# Fetch current deal
curl https://your-site.vercel.app/api/products/daily-deal

# Expected response
{
  "source": "ebay_live",
  "deal": { ... },
  "rotatesAt": "midnight",
  "totalDealsAvailable": 12,
  "query": "electronics trending deals discount"
}
```

### Verify Deal Quality

Check that returned deal has:
- ✅ `originalPrice > price`
- ✅ Discount >= 20%
- ✅ Valid affiliate link with Campaign ID
- ✅ Custom ID: `api-deal`
- ✅ Real product image from eBay

### Test Daily Rotation

1. Note current deal at 11:50 PM
2. Wait until 12:01 AM (next day)
3. Refresh homepage
4. Deal should change (or stay same if cache not expired)
5. After 1 hour, deal will definitely change

### Simulate Different Days

To test query rotation locally:

```typescript
// Temporarily modify getDailyQuery() for testing
function getDailyQuery(): string {
  const testDay = 3; // Force day 3 (Apple products)
  return dealQueries[testDay % dealQueries.length];
}
```

---

## Monitoring

### Check Deal Performance

1. **EPN Dashboard** → Advanced Reports → Custom ID
2. Filter by: `api-deal`
3. Metrics to watch:
   - **Clicks** - How many people click the deal
   - **CTR** - Click-through rate vs other products
   - **Revenue** - Conversions from deal clicks
   - **EPC** - Earnings per click for deals

### Expected Performance

**Typical Metrics:**
- Clicks: 50-200 per day (depends on traffic)
- CTR: 5-15% (deals typically convert well)
- Revenue: Higher than average (due to discount)
- Best days: Monday, Friday (payday traffic)

---

## Troubleshooting

### Deal Not Showing

**Check:**
1. `/api/products/daily-deal` returns valid JSON
2. Response has `deal` object
3. Browser console for errors
4. Network tab shows 200 OK response

**Fix:** Clear cache, refresh page

### Same Deal Every Day

**Cause:** Query returns same product repeatedly

**Fix:**
1. Add more variety to search queries
2. Increase `searchEbayProducts` limit (20 → 50)
3. Add randomization within same day

### No High-Discount Deals Found

**Cause:** 20% threshold too strict for current query

**Fix:**
1. Lower threshold to 15%: `discount >= 15`
2. Expand search query terms
3. Component shows static fallback automatically

### Deal Image Not Loading

**Cause:** eBay image URL restrictions

**Fix:** Already handled in `next.config.js`:
```javascript
images: {
  remotePatterns: [
    { hostname: 'i.ebayimg.com' },
    { hostname: 'ir.ebaystatic.com' },
  ]
}
```

---

## Performance Impact

### Page Load Time

- **First load after cache expiry:** +2-3 seconds (eBay API call)
- **Cached loads:** +0ms (served from CDN)
- **Fallback to static:** +0ms (instant)

### API Usage

- **Calls per day:** 24 max (1 per hour cache)
- **eBay API quota:** 5,000 calls/day (production)
- **Percentage used:** < 0.5% of daily quota

---

## Future Enhancements

### Potential Features

1. **Multiple Daily Deals** - Show 3-5 deals in carousel
2. **Category-Specific Deals** - One deal per category
3. **Personalized Deals** - Based on user browsing history
4. **Flash Sales** - Hourly changing deals
5. **Deal Archive** - View past deals
6. **Email Notifications** - Subscribe to daily deal emails
7. **Social Sharing** - Share deals on social media
8. **Deal Ratings** - Users rate deal quality

---

## Best Practices

### Query Optimization

✅ **Do:**
- Use specific brand names ("Apple", "Nike")
- Include "deals", "discount", "sale" keywords
- Target trending items
- Vary across categories

❌ **Don't:**
- Use generic terms ("stuff", "things")
- Target outdated products
- Repeat same query multiple days
- Use obscure categories

### Discount Display

✅ **Do:**
- Show original price crossed out
- Highlight discount percentage
- Create urgency (countdown timer)
- Use contrasting colors (red/orange)

❌ **Don't:**
- Exaggerate discounts
- Hide original prices
- Show fake urgency
- Mislead users

---

## Summary

✅ **Implemented:**
- Daily rotating deals from eBay API
- 20%+ discount filtering
- 7-day query rotation
- Live deal indicator
- Countdown timer
- Affiliate tracking
- Graceful fallbacks
- 1-hour caching

✅ **Benefits:**
- Fresh content daily
- Real discounts
- Higher conversions
- Better engagement
- Automated system
- Low API usage

---

**The Deal of the Day feature is now live and updating automatically every 24 hours with real trending deals from eBay!** 🎉
