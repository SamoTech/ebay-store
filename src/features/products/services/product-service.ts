import type { Product } from '@/lib/products';

export function filterProductsByCategory(products: Product[], category: string): Product[] {
  return products.filter((product) => product.category.toLowerCase() === category.toLowerCase());
}
