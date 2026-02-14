'use client';

import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { allProducts, categories, createSearchLink } from '../lib/products';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllProducts, setShowAllProducts] = useState(false);

  const filteredProducts = selectedCategory === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleSearch = (query) => {
    setSearchQuery(query);
    setShowAllProducts(true);
    setSelectedCategory('all');
  };

  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug);
    setSearchQuery('');
    setShowAllProducts(false);
  };

  const searchResultsLink = searchQuery 
    ? createSearchLink(searchQuery) 
    : null;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            DealsHub - Best Prices Online
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Discover amazing deals on electronics, gaming, sneakers and more from eBay
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Search Results */}
      {searchQuery && (
        <section className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-bold text-yellow-800">
                Search results for: "{searchQuery}"
              </p>
              <p className="text-sm text-yellow-700">
                Showing all products from eBay matching your search
              </p>
            </div>
            <a 
              href={searchResultsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium whitespace-nowrap"
            >
              View on eBay →
            </a>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`bg-white rounded-lg shadow-md p-3 text-center hover:shadow-xl transition-all ${
                selectedCategory === cat.slug ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <p className="font-bold mt-1 text-gray-700 text-sm">{cat.name}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {searchQuery 
              ? `Search: "${searchQuery}"` 
              : selectedCategory === 'all' 
                ? showAllProducts 
                  ? 'All Products' 
                  : 'Featured Products' 
                : categories.find(c => c.slug === selectedCategory)?.name
            }
          </h2>
          <span className="text-gray-500">
            {filteredProducts.length} products
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, showAllProducts || searchQuery ? filteredProducts.length : 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More Button */}
        {!showAllProducts && !searchQuery && filteredProducts.length > 8 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllProducts(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View All {filteredProducts.length} Products →
            </button>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 mt-2">Try searching for a different product</p>
          </div>
        )}
      </div>

      {/* View More on eBay CTA */}
      <section className="bg-gray-100 py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-gray-600 mb-6">
            Browse millions of products on eBay with our affiliate links
          </p>
          <a 
            href={createSearchLink(searchQuery || '')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Browse More on eBay
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold">{allProducts.length}+</p>
              <p className="text-blue-200">Products</p>
            </div>
            <div>
              <p className="text-4xl font-bold">{categories.length - 1}</p>
              <p className="text-blue-200">Categories</p>
            </div>
            <div>
              <p className="text-4xl font-bold">$74B+</p>
              <p className="text-blue-200">eBay Sales</p>
            </div>
            <div>
              <p className="text-4xl font-bold">132M+</p>
              <p className="text-blue-200">Active Buyers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            DealsHub is a participant in the eBay Partner Network, an affiliate advertising program.
          </p>
          <p className="mt-2 text-gray-500 text-sm">
            © 2024 DealsHub. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
