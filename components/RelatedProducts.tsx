'use client';

import { useMemo } from 'react';
import ProductCard from './ProductCard';
import { Product, allProducts } from '../lib/products';

interface RelatedProductsProps {
  currentProduct: Product;
  maxItems?: number;
}

export default function RelatedProducts({ currentProduct, maxItems = 4 }: RelatedProductsProps) {
  const relatedProducts = useMemo(() => {
    // Find products in same category, excluding current product
    const sameCategory = allProducts.filter(
      p => p.category === currentProduct.category && p.id !== currentProduct.id
    );

    // If not enough in same category, add products from other categories
    if (sameCategory.length < maxItems) {
      const otherProducts = allProducts.filter(
        p => p.category !== currentProduct.category && p.id !== currentProduct.id
      );
      return [...sameCategory, ...otherProducts].slice(0, maxItems);
    }

    return sameCategory.slice(0, maxItems);
  }, [currentProduct, maxItems]);

  if (relatedProducts.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          You May Also Like
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {relatedProducts.length} products
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
