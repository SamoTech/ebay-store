# DealsHub - eBay Affiliate Store

An affiliate marketing website that features trending products from eBay, targeting customers in the USA, Canada, and Europe.

## 🌐 Live Website

**[DealsHub](https://ebay-store.vercel.app)** - Best Deals & Discounts

## 📋 Overview

DealsHub is a Next.js-based affiliate store that showcases trending products from eBay across multiple categories. The website is designed for English-speaking audiences in North America and Europe.

## ✨ Features

- **24+ Trending Products** across 7 categories
- **7 Categories**: Electronics, Gaming, Sneakers, Smart Home, Beauty, Collectibles
- **Category Filtering** - Filter products by category
- **Affiliate Links** - All products link to eBay with affiliate tracking
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Fast Performance** - Built with Next.js and Tailwind CSS
- **SEO Optimized** - English content for international audience

## 🛍️ Product Categories

| Category | Products |
|----------|----------|
| 💻 Electronics | MacBook, iPhone, Samsung, Sony Headphones, Apple Watch |
| 🎮 Gaming | PlayStation 5, Nintendo Switch, Xbox Series X |
| 👟 Sneakers | Air Jordan, Nike Air Max, Adidas Ultraboost, Nike Dunk |
| 🏠 Smart Home | Amazon Echo, Apple HomePod, Ring Doorbell, Philips Hue |
| 💄 Beauty | Dyson Airwrap, Oral-B iO, Foreo Luna |
| 🎯 Collectibles | Pokemon Cards, Sports Jerseys, Funko Pops, Rare Coins |

## 🔗 Affiliate Program

This project uses **eBay Partner Network (EPN)** for affiliate tracking.

- **Campaign ID**: 5338903178
- **Tracking Parameters**: mkcid, mkrid, siteid, campid

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
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

```
ebay-store/
├── app/
│   ├── page.tsx          # Main page with products
│   ├── blog/page.tsx     # Blog page
│   └── layout.tsx        # Root layout with EPN script
├── components/
│   ├── Header.tsx        # Navigation header
│   └── ProductCard.tsx  # Product display card
├── lib/
│   ├── products.js       # Products data with affiliate links
│   └── categories.js     # Category definitions
└── public/              # Static assets
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
