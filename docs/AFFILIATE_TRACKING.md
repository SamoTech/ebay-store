# Affiliate Tracking Reference

## Campaign Configuration

Your eBay Partner Network affiliate tracking is configured with the following parameters:

### Primary Tracking Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| **campid** | `5338903178` | Your eBay Partner Network Campaign ID |
| **mkcid** | `1` | Marketing channel ID (eBay Partner Network) |
| **mkrid** | `711-53200-19255-0` | Marketing routing ID (eBay US) |
| **siteid** | `0` | Site ID (eBay United States) |

### Custom ID Tracking Strategy

The `customid` parameter enables granular tracking of different traffic sources:

| Custom ID Pattern | Source | Example |
|-------------------|--------|----------|
| `api-{category}` | Live API products | `api-electronics`, `api-gaming` |
| `static-{category}` | Hardcoded products | `static-sneakers`, `static-beauty` |
| `fallback-{category}` | API fallback links | `fallback-electronics` |

## Example Affiliate URLs

### API Product Link
```
https://www.ebay.com/itm/394792651234?mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=5338903178&customid=api-electronics
```

### Static Product Search Link
```
https://www.ebay.com/sch/i.html?_nkw=iPhone+15+Pro&mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=5338903178&customid=static-electronics
```

## URL Structure Breakdown

```
https://www.ebay.com/itm/394792651234
  ?mkcid=1                           ← Partner Network identifier
  &mkrid=711-53200-19255-0           ← Routing for US marketplace
  &siteid=0                          ← eBay US site
  &campid=5338903178                 ← YOUR Campaign ID
  &customid=api-electronics          ← Granular tracking tag
```

## Verifying Affiliate Links

### Method 1: Manual Inspection

1. Right-click on any product link on your site
2. Select "Copy Link Address"
3. Paste in a text editor
4. Verify all required parameters are present

### Method 2: Browser Extension

Use [Link Redirect Trace](https://chrome.google.com/webstore) extension:

1. Install the extension
2. Click a product link on your site
3. View the redirect chain
4. Confirm `campid=5338903178` appears in the URL

### Method 3: Automated Testing

```typescript
// Add to your test suite
import { createAffiliateUrl } from '@/lib/ebay-api';

test('affiliate URL contains Campaign ID', () => {
  const url = createAffiliateUrl('https://www.ebay.com/itm/123', 'test');
  expect(url).toContain('campid=5338903178');
  expect(url).toContain('customid=test');
});
```

## Monitoring in EPN Dashboard

### Accessing Your Reports

1. Log in to [partnernetwork.ebay.com](https://partnernetwork.ebay.com)
2. Navigate to **Reports** → **Campaign Reports**
3. Filter by Campaign ID: `5338903178`

### Key Metrics to Track

| Metric | What It Tells You |
|--------|-------------------|
| **Clicks** | Total traffic sent to eBay |
| **Click-Through Rate** | Quality of your product selection |
| **Conversion Rate** | % of clicks that result in sales |
| **Revenue** | Total earnings from sales |
| **EPC (Earnings Per Click)** | Average revenue per click |

### Custom ID Analysis

**View by Custom ID:**
1. Go to **Reports** → **Advanced Reports**
2. Add dimension: **Custom ID**
3. Group data to see performance by:
   - Category (electronics, gaming, etc.)
   - Source type (api vs static)
   - Specific campaigns or promotions

**Example Analysis:**
```
Custom ID          | Clicks | Revenue | EPC
-------------------|--------|---------|------
api-electronics    | 1,250  | $182.50 | $0.146
api-gaming         | 890    | $134.20 | $0.151
static-sneakers    | 620    | $78.40  | $0.126
static-beauty      | 340    | $45.60  | $0.134
```

## Tracking Best Practices

### 1. Consistent Naming Convention

✅ **Good:**
- `api-electronics`
- `api-gaming`
- `static-electronics`

❌ **Avoid:**
- `ElectronicsAPI`
- `gaming_static`
- `home-items-from-api`

### 2. Use Descriptive Custom IDs

Add context when useful:
- `api-electronics-homepage`
- `static-gaming-featured`
- `api-sneakers-sale-2026`

### 3. Track Important Events

```typescript
// Track which pages drive conversions
const customId = `api-${category}-${page}`;
// Example: api-electronics-homepage
```

### 4. A/B Testing with Custom IDs

```typescript
// Test different product selections
const customId = isTestGroup 
  ? `api-${category}-test-a`
  : `api-${category}-test-b`;
```

## Data Retention & Privacy

### What eBay Tracks

- Click timestamps
- User purchases (anonymized)
- Conversion events
- Revenue generated

### What You See

- Aggregated click data
- Total revenue per campaign
- Custom ID performance
- NO personally identifiable information

### Compliance

✅ Your implementation is compliant with:
- eBay Partner Network Terms
- GDPR (no personal data collected)
- CCPA (affiliate tracking disclosed)

## Troubleshooting

### No Clicks Showing in Dashboard

**Wait Period:** Data appears 24-48 hours after first click

**Verify:**
1. Campaign `5338903178` is active in EPN
2. Your site is sending traffic with correct parameters
3. Links are not being blocked by ad blockers (rare)

### Low Conversion Rates

**Optimize:**
- Target higher-value categories (Electronics, Gaming)
- Feature products with good reviews
- Use API for fresh, in-stock items
- Improve product descriptions and images

### Custom IDs Not Appearing

**Check:**
1. Custom ID is URL-encoded properly
2. Length doesn't exceed 256 characters
3. Special characters are escaped
4. Parameter is in all generated URLs

```typescript
// Verify custom ID encoding
const customId = encodeURIComponent('api-electronics-homepage');
console.log(customId); // api-electronics-homepage (no change if simple)
```

## Advanced Tracking Scenarios

### Seasonal Campaigns

```typescript
const customId = `api-${category}-${season}-${year}`;
// Example: api-electronics-valentine-2026
```

### User Segmentation

```typescript
const customId = `api-${category}-${userType}`;
// Example: api-gaming-returning-user
```

### Promotion Tracking

```typescript
const customId = `api-${category}-promo-${promoCode}`;
// Example: api-sneakers-promo-SAVE20
```

## Reporting Schedule

| Report Type | Frequency | Latency |
|-------------|-----------|----------|
| Real-time Preview | Live | 1-2 hours |
| Daily Summary | Daily | 24 hours |
| Campaign Report | Daily | 24-48 hours |
| Custom ID Breakdown | Daily | 24-48 hours |
| Payment Report | Monthly | 2-3 days after month end |

## Quick Reference: Testing Checklist

- [ ] Campaign ID `5338903178` present in all links
- [ ] `mkcid`, `mkrid`, `siteid` parameters included
- [ ] Custom ID follows naming convention
- [ ] Links redirect to eBay product pages
- [ ] No 404 errors on eBay side
- [ ] EPN dashboard shows incoming clicks
- [ ] Custom IDs appear in advanced reports

## Support Resources

- **EPN Help Center**: [partnerhelp.ebay.com](https://partnerhelp.ebay.com)
- **Tracking Guide**: [EPN Link Parameters](https://partnerhelp.ebay.com/helpcenter/s/article/What-are-the-parameters-of-an-EPN-link)
- **API Documentation**: [developer.ebay.com](https://developer.ebay.com/api-docs)

---

**Campaign ID:** `5338903178` | **Last Updated:** February 2026
