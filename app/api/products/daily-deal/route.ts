import { NextResponse } from 'next/server';
import { allProducts } from '../../../../lib/products';
import {
  getEbayIntegrationStatus,
  searchEbayProducts,
} from '../../../../lib/ebay-api';
import { withRateLimit } from '../../../../lib/rate-limit';

// Force dynamic rendering - required for runtime environment variables
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Daily rotating deal categories
const dealCategories = [
  'iPhone 15',           // Sunday
  'PlayStation 5',       // Monday
  'Nike Sneakers',       // Tuesday
  'MacBook Pro',         // Wednesday
  'Samsung Galaxy',      // Thursday
  'Nintendo Switch',     // Friday
  'Apple Watch',         // Saturday
];

async function getDailyDeal() {
  try {
    const dayOfWeek = new Date().getDay();
    const todayCategory = dealCategories[dayOfWeek];

    const status = getEbayIntegrationStatus();
    console.log(`🔍 Daily Deal (${todayCategory}) - eBay Status:`, status.mode);

    // Use eBay API if configured
    if (status.mode !== 'disabled') {
      console.log(`🔍 Fetching daily deal from eBay: ${todayCategory}`);
      
      const products = await searchEbayProducts(todayCategory, 1);

      if (products.length > 0) {
        const deal = products[0];
        console.log(`✅ Daily deal found: ${deal.title}`);
        
        return NextResponse.json({
          deal,
          category: todayCategory,
          source: 'ebay-api',
          expiresAt: getEndOfDay(),
        });
      }

      console.warn(`⚠️ No eBay deal for ${todayCategory}, using fallback`);
    } else {
      console.warn('⚠️ eBay API disabled for daily deal');
    }

    // Fallback: Random product from static list
    const randomDeal = allProducts[Math.floor(Math.random() * allProducts.length)];

    return NextResponse.json({
      deal: randomDeal,
      category: todayCategory,
      source: 'fallback',
      expiresAt: getEndOfDay(),
    });
  } catch (error) {
    console.error('❌ Error fetching daily deal:', error);

    const randomDeal = allProducts[Math.floor(Math.random() * allProducts.length)];

    return NextResponse.json({
      deal: randomDeal,
      category: 'Mixed',
      source: 'fallback-error',
      expiresAt: getEndOfDay(),
    });
  }
}

function getEndOfDay(): string {
  const now = new Date();
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );
  return endOfDay.toISOString();
}


export const GET = withRateLimit(getDailyDeal, {
  maxRequests: 60,
  windowMs: 60 * 1000,
});
