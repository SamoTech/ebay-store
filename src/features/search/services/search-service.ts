import type { Product } from '@/lib/products';

export interface SearchResponse {
  products: Product[];
  total: number;
}

export async function fetchSearchProducts(query: string, sortBy: string): Promise<SearchResponse> {
  const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}&sort=${sortBy}`);
  if (!response.ok) {
    return { products: [], total: 0 };
  }

  const data = (await response.json()) as Partial<SearchResponse>;
  return {
    products: data.products ?? [],
    total: data.total ?? data.products?.length ?? 0,
  };
}

export function sortProducts(products: Product[], sortBy: string): Product[] {
  return [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating ?? 0) - (a.rating ?? 0);
      default:
        return 0;
    }
  });
}
