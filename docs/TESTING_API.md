# Testing Your eBay API Integration

After adding your eBay API credentials to Vercel, use these endpoints to verify everything is working correctly.

## Quick Testing URLs

Replace `your-site.vercel.app` with your actual Vercel deployment URL:

### 1. Check API Status
```
https://ebay-store.vercel.app/api/ebay-status
```

**What it does:** Checks if environment variables are configured

**Expected Response (Success):**
```json
{
  "success": true,
  "mode": "client_credentials",
  "marketplaceId": "EBAY_US",
  "missing": [],
  "timestamp": "2026-02-14T21:35:00.000Z"
}
```

**Expected Response (Missing Credentials):**
```json
{
  "success": true,
  "mode": "disabled",
  "marketplaceId": "EBAY_US",
  "missing": ["EBAY_CLIENT_ID", "EBAY_CLIENT_SECRET"],
  "timestamp": "2026-02-14T21:35:00.000Z"
}
```

### 2. Test Product Fetching
```
https://ebay-store.vercel.app/api/ebay-test
```

**What it does:** Actually fetches products from eBay to verify credentials work

**Expected Response (Success):**
```json
{
  "success": true,
  "status": {
    "mode": "client_credentials",
    "marketplaceId": "EBAY_US",
    "missing": []
  },
  "test": {
    "query": "electronics",
    "productsFound": 5,
    "totalAvailable": 5000,
    "affiliateTrackingActive": true,
    "sampleProduct": {
      "title": "Apple iPhone 15 Pro Max 256GB",
      "price": 1199,
      "currency": "USD",
      "affiliateLink": "https://www.ebay.com/itm/123456?mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=5338903178&customid=api-electronics",
      "hasCorrectCampaignId": true
    }
  },
  "timestamp": "2026-02-14T21:35:00.000Z"
}
```

## Step-by-Step Verification

### Step 1: Verify Environment Variables

1. Visit: `https://ebay-store.vercel.app/api/ebay-status`
2. Check the response:
   - ✅ `"mode": "client_credentials"` = Credentials are configured
   - ❌ `"mode": "disabled"` = Credentials missing (check `missing` array)

### Step 2: Test Product Fetching

1. Visit: `https://ebay-store.vercel.app/api/ebay-test`
2. Look for:
   - ✅ `"success": true`
   - ✅ `"productsFound": 5` (or more)
   - ✅ `"affiliateTrackingActive": true`
   - ✅ `"hasCorrectCampaignId": true`

### Step 3: Verify Affiliate Tracking

In the test response, check the `affiliateLink`:
```
https://www.ebay.com/itm/123456
  ?mkcid=1
  &mkrid=711-53200-19255-0
  &siteid=0
  &campid=5338903178          ← YOUR Campaign ID
  &customid=api-electronics
```

✅ All parameters should be present, especially `campid=5338903178`

## Common Issues & Solutions

### Issue 1: "mode": "disabled"

**Problem:** Environment variables not set in Vercel

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `EBAY_CLIENT_ID` = Your Production App ID
   - `EBAY_CLIENT_SECRET` = Your Production Cert ID
3. Redeploy your site (or wait for automatic deployment)

### Issue 2: "No products returned"

**Problem:** Credentials might be invalid or wrong type

**Possible causes:**
- Using Sandbox credentials instead of Production
- Credentials have typos or extra spaces
- eBay API is temporarily down

**Solution:**
1. Double-check credentials at [developer.ebay.com/my/keys](https://developer.ebay.com/my/keys)
2. Ensure you're using **Production** keyset (not Sandbox)
3. Copy credentials carefully (no extra spaces)
4. Update in Vercel and redeploy

### Issue 3: "affiliateTrackingActive": false

**Problem:** Campaign ID not being added to URLs

**Solution:**
1. Check if `lib/ebay-api.ts` has the latest code
2. Verify `CAMPID = '5338903178'` is set
3. Redeploy to pull latest code changes

### Issue 4: 401 Unauthorized Error

**Problem:** OAuth authentication failing

**Solution:**
1. Verify credentials are Production keys (not Sandbox)
2. Check that CLIENT_ID and CLIENT_SECRET match exactly
3. Ensure no trailing spaces in environment variables
4. Try regenerating keys in eBay Developer Portal

### Issue 5: 403 Forbidden Error

**Problem:** API permissions issue

**Solution:**
1. Check marketplace ID matches your account region
2. Ensure your eBay developer account is fully activated
3. Verify OAuth scope is correct (defaults should work)

## Testing Locally

To test on your local machine:

1. **Create `.env.local`:**
```bash
EBAY_CLIENT_ID=your-production-app-id
EBAY_CLIENT_SECRET=your-production-cert-id
EBAY_MARKETPLACE_ID=EBAY_US
```

2. **Run development server:**
```bash
npm run dev
```

3. **Test endpoints:**
- Status: http://localhost:3000/api/ebay-status
- Test: http://localhost:3000/api/ebay-test

## Using Browser Developer Tools

1. Open browser DevTools (F12)
2. Go to Network tab
3. Visit test endpoint
4. Check:
   - Response status: Should be `200 OK`
   - Response time: Should be < 2 seconds
   - Response body: Should match examples above

## Command Line Testing

### Using curl:
```bash
# Check status
curl https://ebay-store.vercel.app/api/ebay-status

# Test product fetching
curl https://ebay-store.vercel.app/api/ebay-test
```

### Using httpie:
```bash
# Check status
http https://ebay-store.vercel.app/api/ebay-status

# Test product fetching
http https://ebay-store.vercel.app/api/ebay-test
```

## Monitoring in Production

### Vercel Logs

1. Go to Vercel Dashboard → Your Project → Logs
2. Filter for `/api/ebay-test` requests
3. Look for errors or warnings

### eBay Partner Network Dashboard

1. Log in to [partnernetwork.ebay.com](https://partnernetwork.ebay.com)
2. Go to Reports → Campaign Reports
3. Filter by Campaign ID: `5338903178`
4. Within 24-48 hours, you should see:
   - Test clicks from your verification
   - Real user clicks once site is live

## Success Checklist

- [ ] `/api/ebay-status` returns `"mode": "client_credentials"`
- [ ] `/api/ebay-test` returns `"success": true`
- [ ] Test response shows `"productsFound": 5` or more
- [ ] Affiliate link contains `campid=5338903178`
- [ ] `"affiliateTrackingActive": true`
- [ ] `"hasCorrectCampaignId": true`
- [ ] No errors in Vercel logs
- [ ] Click appears in EPN dashboard (wait 24-48 hours)

## Next Steps After Successful Test

Once tests pass:

1. ✅ Update your pages to use `searchEbayProducts()`
2. ✅ Replace static products with API calls
3. ✅ Deploy changes to production
4. ✅ Monitor EPN dashboard for actual user clicks
5. ✅ Optimize based on performance data

See [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) for implementation examples.

## Getting Help

If tests fail after trying solutions above:

1. Check [eBay API Status](https://developer.ebay.com/support/api-status)
2. Review [eBay Developer Forums](https://community.ebay.com/)
3. Open an issue in this repository
4. Contact eBay Partner Network support

---

**Your Campaign ID:** `5338903178`
**Test Endpoints Created:** February 14, 2026
