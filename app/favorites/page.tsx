'use client';

import Link from 'next/link';
import { useFavorites } from '../contexts/FavoritesContext';
import ProductCard from '../components/ProductCard';
import { useToast } from '../contexts/ToastContext';

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();
  const { addToast } = useToast();

  const handleClearAll = () => {
    if (confirm('Are you sure you want to remove all favorites?')) {
      clearFavorites();
      addToast('All favorites cleared', 'info');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Favorites</h1>
          <p className="text-xl text-blue-100">
            {favorites.length} {favorites.length === 1 ? 'product' : 'products'} saved
          </p>
        </div>
      </section>

      {/* Favorites Grid */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💙</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No favorites yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start browsing our products and click the heart icon to save your favorites!
            </p>
            <Link 
              href="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Products →
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Saved Products
              </h2>
              <button
                onClick={handleClearAll}
                className="text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favorites.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            DealsHub is a participant in the eBay Partner Network, an affiliate advertising program.
          </p>
          <p className="mt-2 text-gray-500 text-sm">
            © 2025 DealsHub. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
