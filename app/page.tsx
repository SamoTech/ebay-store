'use client';

import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../lib/products';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            DealsHub - Best Prices Online
          </h1>
          <p className="text-xl text-blue-100">
            Discover amazing deals on electronics, clothing, and more from eBay
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`bg-white rounded-lg shadow-md p-4 text-center hover:shadow-xl transition-all ${
                selectedCategory === cat.slug ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              <span className="text-3xl">{cat.icon}</span>
              <p className="font-bold mt-2 text-gray-700">{cat.name}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.slug === selectedCategory)?.name}
          </h2>
          <span className="text-gray-500">{filteredProducts.length} products</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category</p>
          </div>
        )}
      </div>

      {/* Affiliate CTA */}
      <section className="bg-gray-100 py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Earn Money?</h2>
          <p className="text-gray-600 mb-6">
            Join our affiliate program and earn commissions by promoting products
          </p>
          <a 
            href="https://www.ebay.com/partners/affiliate" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Join eBay Partner Network
          </a>
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
