'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Product } from '@/lib/products';
import { fetchSearchProducts, sortProducts } from '@/src/features/search/services/search-service';

export function useSearchProducts(query: string, sortBy: string): {
  products: Product[];
  totalResults: number;
  isLoading: boolean;
} {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setTotalResults(0);
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);

    fetchSearchProducts(query, sortBy)
      .then((result) => {
        if (!active) return;
        setProducts(result.products);
        setTotalResults(result.total);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query, sortBy]);

  const sortedProducts = useMemo(() => sortProducts(products, sortBy), [products, sortBy]);

  return { products: sortedProducts, totalResults, isLoading };
}
