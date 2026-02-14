# DealsHub - eBay Affiliate Store

An affiliate marketing website that features trending products from eBay, targeting customers in the USA, Canada, and Europe.

## 🌐 Live Website

**[DealsHub](https://ebay-store.vercel.app)** – Best Deals & Discounts

## 📋 Overview

DealsHub is a Next.js-based affiliate store that showcases trending products from eBay across multiple categories. The website is designed for English-speaking audiences in North America and Europe.

## ✨ Features

- **62+ Trending Products** across 13 categories
- **13 Categories**: Electronics, Gaming, Sneakers, Smart Home, Beauty, Collectibles, Home, Fitness, Pet Supplies, Baby, Auto, Office
- **Category Filtering** – Filter products by category
- **Search Function** – Search products on eBay directly
- **Blog Section** – 10 professional articles with shopping guides and tips
- **Affiliate Links** – All products link to eBay with affiliate tracking
- **Responsive Design** – Works on mobile, tablet, and desktop
- **Fast Performance** – Built with Next.js and Tailwind CSS
- **SEO Optimized** – English content for international audiences
- **Vercel Speed Insights** – Built-in performance monitoring

## 🛍️ Product Categories

| Category | Products |
|----------|----------|
| 💻 Electronics | MacBook, iPhone, iPad, AirPods, Samsung, Sony, Dyson |
| 🎮 Gaming | PlayStation 5, Xbox, Nintendo Switch, Steam Deck, VR2 |
| 👟 Sneakers | Air Jordan, Nike, Adidas, New Balance, Converse |
| 🏠 Smart Home | Amazon Echo, Apple HomePod, Ring, Philips Hue |
| 💄 Beauty | Dyson Airwrap, Oral-B iO, Foreo Luna |
| 🎯 Collectibles | Pokémon Cards, Funko Pops, Jerseys, Coins |
| 🛋️ Home | Roomba, Nespresso, Vitamix, Instant Pot |
| 💪 Fitness | Peloton, Yoga Mat, Dumbbells, Garmin |
| 🐕 Pet Supplies | Furbo, Auto Feeder, Pet Bed |
| 👶 Baby | Stroller, Car Seat, Monitor, Kids Tablet |
| 🚗 Auto | Dash Cam, Jump Starter |
| 💼 Office | Standing Desk, Chair, Monitor Stand |

## 🔗 Affiliate Program

This project uses the **eBay Partner Network (EPN)** for affiliate tracking.

- **Campaign ID**: 5338903178
- **Tracking Parameters**: `mkcid`, `mkrid`, `siteid`, `campid`

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 14
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Hosting**: [Vercel](https://vercel.com)
- **Source**: GitHub

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/SamoTech/ebay-store.git

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 📁 Project Structure

```text
ebay-store/
├── app/
│   ├── page.tsx          # Main page with products
│   ├── blog/page.tsx     # Blog page
│   └── layout.tsx        # Root layout with EPN script
├── components/
│   ├── Header.tsx        # Navigation header
│   └── ProductCard.tsx   # Product display card
├── lib/
│   ├── products.ts       # Product data with affiliate links
│   └── ebay.ts           # eBay API utilities
└── public/               # Static assets
```

## 📝 License

MIT License

## 👤 Author

**SamoTech**

- GitHub: [@SamoTech](https://github.com/SamoTech)

## 🔗 Useful Links

- [eBay Partner Network](https://www.ebay.com/partners/affiliate)
- [Vercel](https://vercel.com)
- [Next.js Documentation](https://nextjs.org)


## eBay API (Live Catalog Mode)

The app can run with live eBay Browse API data on the homepage via `/api/products/discover`.

Set these environment variables:

- `EBAY_CLIENT_ID`
- `EBAY_CLIENT_SECRET`
- `EBAY_MARKETPLACE_ID` (optional, defaults to `EBAY_US`)
- `EBAY_OAUTH_SCOPE` (optional, defaults to `https://api.ebay.com/oauth/api_scope`)

Alternative (manual token):

- `EBAY_OAUTH_TOKEN`

If no credentials/token are provided, the app safely falls back to static products from `lib/products.ts`.

## Step-by-step: Configure Option A (`EBAY_CLIENT_ID` + `EBAY_CLIENT_SECRET`)

1. **Open eBay Developer Program**
   - Sign in at https://developer.ebay.com/
   - Go to your application keys page.

2. **Copy Production keys**
   - Copy **App ID (Client ID)** and **Cert ID (Client Secret)** from your Production keyset.
   - Do **not** commit these values into Git.

3. **Create local environment file**
   - Copy the example file and fill your values:

   ```bash
   cp env.example .env.local
   ```

   Then edit `.env.local`:

   ```env
   EBAY_CLIENT_ID=YOUR_APP_ID
   EBAY_CLIENT_SECRET=YOUR_CERT_ID
   EBAY_MARKETPLACE_ID=EBAY_US
   ```

4. **Start the app**

   ```bash
   npm run dev
   ```

5. **Verify live eBay mode is active**
   - Open: `http://localhost:3000/api/ebay/status`
   - Confirm `integration.mode` is `"client_credentials"` or `"manual_token"` (not `"disabled"`).
   - Open: `http://localhost:3000/api/products/discover`
   - Confirm JSON contains: `"source": "ebay_live"`.
   - Open homepage and confirm products are loading from live discovery.

6. **Configure Vercel (production)**
   - Vercel Project → **Settings** → **Environment Variables**
   - Add:
     - `EBAY_CLIENT_ID`
     - `EBAY_CLIENT_SECRET`
     - `EBAY_MARKETPLACE_ID` (optional)
   - Redeploy.

### Troubleshooting

- If `source` is `fallback_static`, check:
  1. Key names are exact (`EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`).
  2. Keys are Production keys (not sandbox if using production APIs).
  3. No extra spaces/quotes in `.env.local` values.
  4. Restarted dev server after editing env vars.



### Security note

If credentials were ever shared in chat/issues/PR comments, rotate them in the eBay Developer portal immediately and replace your environment variables.


## API Verification (تأكيد إن الـ API شغّال)

### Quick automated check

1. Start the app:

```bash
npm run dev
```

2. In another terminal, run:

```bash
npm run verify:apis
```

If everything is healthy, you should see `API verification PASSED`.

### Manual checks (optional)

```bash
curl -s http://127.0.0.1:3000/api/ebay/status
curl -s http://127.0.0.1:3000/api/products/discover | jq '.source, (.products | length)'
curl -s -X POST http://127.0.0.1:3000/api/subscribe -H 'content-type: application/json' -d '{"email":"check@example.com","source":"manual"}'
```

Expected behavior:

- Search API supports category mapping: `/api/products/search?q=iphone&category=electronics` so returned products are grouped under the selected category.
- `/api/ebay/status` returns integration mode and `ok`.
- `/api/products/discover` returns `source` as `ebay_live` (when credentials are set) or `fallback_static` (without credentials).
- Subscribe/alerts/track endpoints return `ok: true` for valid payloads.

### Conflict check before push (PR file conflict fix)

If you had a PR/file conflict and deleted it, run this before pushing:

```bash
npm run verify:conflicts
```

- If it prints `No merge conflict markers found.` you're clean.
- If it fails, remove conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) from listed files.

