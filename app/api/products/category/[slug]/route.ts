import { NextResponse } from 'next/server';
import { allProducts } from '../../../../../lib/products';
import { getEbayIntegrationStatus, searchEbayProducts } from '../../../../../lib/ebay-api';
import { validateCategorySlug, asValidationErrorResponse } from '@/src/lib/validation';
import { logger } from '@/src/lib/logger';

export const dynamic = 'force-dynamic';
export const revalidate = 600;

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

  try {
    const status = getEbayIntegrationStatus();

    if (status.mode !== 'disabled') {
      const products = await searchEbayProducts(categoryName, 16);
      if (products.length > 0) {
        return NextResponse.json({ products, category: categoryName, source: 'ebay-api', total: products.length });
      }
    }

    const fallbackProducts = allProducts.filter((p) => p.category.toLowerCase() === categoryName.toLowerCase());
    return NextResponse.json({ products: fallbackProducts, category: categoryName, source: 'fallback', total: fallbackProducts.length });
  } catch (error) {
    logger.error('Category route failure', {
      categoryName,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json({ products: [], category: categoryName, source: 'fallback-error', total: 0 }, { status: 500 });
  }
}
