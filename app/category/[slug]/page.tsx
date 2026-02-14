'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { allProducts, categories, createSearchLink } from '../../../lib/products';
import ProductCard from '../../../components/ProductCard';
import Footer from '../../../components/Footer';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const category = categories.find(c => c.slug === slug);
  const categoryName = category?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'name'>('name');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [compareList, setCompareList] = useState<number[]>([]);

  const categoryProducts = useMemo(() => {
    let filtered = allProducts.filter(p => 
      p.category.toLowerCase() === categoryName.toLowerCase() ||
      p.category.toLowerCase().replace(' ', '-') === slug
    );

    // Apply price filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Apply sorting
    return [...filtered].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return a.title.localeCompare(b.title);
    });
  }, [categoryName, slug, sortBy, priceRange]);

  const compareProducts = allProducts.filter(p => compareList.includes(p.id));

  const handleCompare = (product: { id: number }) => {
    if (compareList.includes(product.id)) {
      setCompareList(compareList.filter(id => id !== product.id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, product.id]);
    }
  };

  const minPrice = Math.min(...allProducts.filter(p => p.category.toLowerCase() === categoryName.toLowerCase()).map(p => p.price));
  const maxPrice = Math.max(...allProducts.filter(p => p.category.toLowerCase() === categoryName.toLowerCase()).map(p => p.price));

  if (categoryProducts.length === 0 && !category) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Category Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The category you're looking for doesn't exist.</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="text-blue-200 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{categoryName}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {category?.icon} {categoryName}
          </h1>
          <p className="text-xl text-blue-100">
            {categoryProducts.length} products available • Best deals on {categoryName.toLowerCase()}
          </p>
        </div>
      </section>

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div className="sticky top-0 z-40 bg-blue-600 text-white py-3 px-4 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-medium">Comparing {compareList.length}/3 products</span>
              <div className="flex gap-2">
                {compareProducts.map(p => (
                  <span key={p.id} className="bg-blue-500 px-3 py-1 rounded-full text-sm">
                    {p.title.slice(0, 20)}...
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCompareList([])}
                className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-400 transition-colors"
              >
                Clear
              </button>
              <Link
                href={`/compare?ids=${compareList.join(',')}`}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Compare Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-400">Filter by:</span>
              
              {/* Price Range */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">$</span>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-16 text-sm bg-transparent text-gray-700 dark:text-gray-200 focus:outline-none"
                  placeholder="Min"
                  min={0}
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-16 text-sm bg-transparent text-gray-700 dark:text-gray-200 focus:outline-none"
                  placeholder="Max"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {categoryProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No products found in this price range.</p>
            <button 
              onClick={() => setPriceRange([0, 5000])}
              className="mt-4 text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                showCompare
                onCompare={handleCompare}
                isComparing={compareList.includes(product.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Browse More CTA */}
      <section className="bg-gray-100 dark:bg-gray-800 py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            Looking for More {categoryName}?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Browse thousands more products on eBay
          </p>
          <a 
            href={createSearchLink(categoryName)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Browse {categoryName} on eBay →
          </a>
        </div>
      </section>

      {/* Other Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Browse Other Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.filter(c => c.slug !== 'all' && c.slug !== slug).map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <span className="text-3xl">{cat.icon}</span>
              <p className="font-medium mt-2 text-gray-700 dark:text-gray-200 text-sm">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
