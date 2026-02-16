import { NextResponse } from 'next/server';
import { allProducts, Product, categories } from '../../../../lib/products';
import {
  getEbayIntegrationStatus,
  searchEbayProducts,
} from '../../../../lib/ebay-api';

// Force dynamic rendering - required for runtime environment variables
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Optimized category queries with better keywords
const categoryQueries: Array<{ category: string; query: string }> = [
  { category: 'Electronics', query: 'bluetooth headphones' },
  { category: 'Gaming', query: 'xbox series x' },
  { category: 'Smart Home', query: 'smart light bulbs' },
  { category: 'Sneakers', query: 'nike air max' },
  { category: 'Home & Kitchen', query: 'air fryer' },
];

export async function GET() {
  try {
    const status = getEbayIntegrationStatus();
    console.log('🔍 eBay Integration Status:', JSON.stringify(status));

    // Use eBay API if configured
    if (status.mode !== 'disabled') {
      console.log('🔍 Discovering products from eBay API...');

      // Search multiple categories in parallel
      const productPromises = categoryQueries.map(({ category, query }) =>
        searchEbayProducts(query, 4)
      );

      const results = await Promise.all(productPromises);
      const products = results.flat();

      if (products.length > 0) {
        console.log(`✅ Found ${products.length} live eBay products`);
        
        // Shuffle and limit
        const shuffled = products.sort(() => Math.random() - 0.5);
        const limited = shuffled.slice(0, 20);

        return NextResponse.json({
          products: limited,
          source: 'ebay_live',
          total: limited.length,
          categories: categoryQueries.map((c) => c.category),
        });
      }

      console.warn('⚠️ eBay API returned 0 products, using fallback');
    } else {
      console.warn('⚠️ eBay API disabled - missing credentials:', status.missing);
    }

    // Fallback: Return shuffled static products
    console.log('⚠️ Using fallback discover products');
    const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
    const limited = shuffled.slice(0, 20);

    return NextResponse.json({
      products: limited,
      source: 'fallback',
      total: limited.length,
      categories: categories.map((c) => c.name),
    });
  } catch (error) {
    console.error('❌ Error in discover endpoint:', error);

    const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
    const limited = shuffled.slice(0, 20);

    return NextResponse.json({
      products: limited,
      source: 'fallback-error',
      total: limited.length,
    });
  }
}
