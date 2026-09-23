import { NextResponse } from 'next/server';
import { allProducts } from '../../../../../lib/products';
import { getEbayIntegrationStatus, searchEbayProducts } from '../../../../../lib/ebay-api';
import { validateCategorySlug, asValidationErrorResponse } from '@/src/lib/validation';
import { logger } from '@/src/lib/logger';

export const dynamic = 'force-dynamic';
export const revalidate = 600;

/**
 * Search-intent terms for the broad marketplace taxonomy.
 * These are intentionally human search phrases rather than slug-derived text,
 * so eBay receives useful queries for categories such as "TV, Video & Home Audio"
 * and "Vehicle Electronics & GPS".
 */
const EBAY_CATEGORY_SEARCH_TERMS: Record<string, string> = {
  electronics: 'electronics',
  gaming: 'gaming',
  sneakers: 'sneakers shoes',
  'smart-home': 'smart home devices',
  beauty: 'beauty personal care',
  collectibles: 'collectibles',
  home: 'home furniture',
  fitness: 'fitness equipment',
  'pet-supplies': 'pet supplies',
  baby: 'baby products',
  auto: 'auto parts accessories',
  office: 'office supplies equipment',
  'ebay-motors': 'cars trucks motorcycles parts accessories',
  'consumer-electronics': 'consumer electronics',
  'collectibles-art': 'collectibles art',
  'home-garden': 'home garden',
  'clothing-shoes-accessories': 'clothing shoes accessories',
  'toys-hobbies': 'toys hobbies',
  'sporting-goods': 'sporting goods',
  'books-movies-music': 'books movies music',
  'health-beauty': 'health beauty',
  'business-industrial': 'business industrial equipment',
  'jewelry-watches': 'jewelry watches',
  'baby-essentials': 'baby essentials',
  'pet-supplies-ebay': 'pet supplies',
  'tickets-travel': 'tickets travel',
  'everything-else': 'miscellaneous products',
  'real-estate': 'real estate',
  'gift-cards-coupons': 'gift cards coupons',
  'specialty-services': 'specialty services',
  'computers-tablets-networking': 'computers tablets networking',
  'cell-phones-accessories': 'cell phones accessories',
  'video-games-consoles': 'video games consoles',
  'cameras-photo': 'cameras photo',
  'tv-video-home-audio': 'TV video home audio',
  'portable-audio-headphones': 'headphones portable audio',
  'vehicle-parts-accessories': 'vehicle parts accessories',
  'vehicle-electronics-gps': 'vehicle electronics GPS',
  'surveillance-smart-home-electronics': 'security cameras smart home electronics',
  'virtual-reality': 'virtual reality VR',
  'coins-paper-money': 'coins paper money',
  antiques: 'antiques',
  art: 'art',
  crafts: 'craft supplies',
  'pottery-glass': 'pottery glass',
  stamps: 'stamps',
  'entertainment-memorabilia': 'entertainment memorabilia',
  'dolls-bears': 'dolls bears',
  'musical-instruments-gear': 'musical instruments gear',
  'sports-mem-cards-fan-shop': 'sports memorabilia cards fan shop',
  'books-magazines': 'books magazines',
  travel: 'travel accessories luggage',
  'video-games': 'video games',
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const slugValidation = validateCategorySlug(slug);
  if (!slugValidation.success) {
    return NextResponse.json(asValidationErrorResponse(slugValidation), { status: 400 });
  }

  const categoryName = slug.replace(/-/g, ' ');
  const searchTerm = EBAY_CATEGORY_SEARCH_TERMS[slug] ?? categoryName;

  try {
    const status = getEbayIntegrationStatus();

    if (status.mode !== 'disabled') {
      const products = await searchEbayProducts(searchTerm, 16);
      if (products.length > 0) {
        return NextResponse.json({ products, category: categoryName, source: 'ebay-api', total: products.length });
      }
    }

    const fallbackProducts = allProducts.filter((p) => p.category.toLowerCase() === categoryName.toLowerCase());
    return NextResponse.json({ products: fallbackProducts, category: categoryName, source: 'fallback', total: fallbackProducts.length });
  } catch (error) {
    logger.error('Category route failure', {
      categoryName,
      searchTerm,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json({ products: [], category: categoryName, source: 'fallback-error', total: 0 }, { status: 500 });
  }
}
