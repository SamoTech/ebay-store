'use client';

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { allProducts } from '../../lib/products';
import Footer from '../../components/Footer';

function CompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids');
  const ids = idsParam ? idsParam.split(',').map(Number) : [];
  
  const products = allProducts.filter(p => ids.includes(p.id));

  if (products.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">No Products to Compare</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Add products to compare from the product listings.</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  const lowestPrice = Math.min(...products.map(p => p.price));
  const highestPrice = Math.max(...products.map(p => p.price));

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="text-blue-200 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Compare Products</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Compare Products
          </h1>
          <p className="text-xl text-blue-100">
            Comparing {products.length} products side by side
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 text-left text-gray-600 dark:text-gray-400 font-medium w-40">Feature</th>
                  {products.map(product => (
                    <th key={product.id} className="p-4 text-center min-w-[200px]">
                      <Link href={`/product/${product.id}`}>
                        <div className="relative h-40 w-40 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                          {product.title}
                        </h3>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price Row */}
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Price</td>
                  {products.map(product => (
                    <td key={product.id} className="p-4 text-center">
                      <span className={`text-2xl font-bold ${
                        product.price === lowestPrice 
                          ? 'text-green-600 dark:text-green-400' 
                          : product.price === highestPrice 
                            ? 'text-red-500' 
                            : 'text-gray-900 dark:text-white'
                      }`}>
                        ${product.price.toFixed(2)}
                      </span>
                      {product.price === lowestPrice && (
                        <span className="block text-xs text-green-600 dark:text-green-400 mt-1">Best Price!</span>
                      )}
                      {product.originalPrice && (
                        <span className="block text-sm text-gray-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Category Row */}
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Category</td>
                  {products.map(product => (
                    <td key={product.id} className="p-4 text-center">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm px-3 py-1 rounded-full">
                        {product.category}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Description Row */}
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Description</td>
                  {products.map(product => (
                    <td key={product.id} className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">
                      {product.description || 'No description available'}
                    </td>
                  ))}
                </tr>

                {/* Savings Row */}
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Savings</td>
                  {products.map(product => (
                    <td key={product.id} className="p-4 text-center">
                      {product.originalPrice ? (
                        <div>
                          <span className="text-green-600 dark:text-green-400 font-bold">
                            ${(product.originalPrice - product.price).toFixed(2)} off
                          </span>
                          <span className="block text-sm text-gray-500">
                            ({Math.round((1 - product.price / product.originalPrice) * 100)}% discount)
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">No discount</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Affiliate Link Row */}
                <tr className="bg-gray-50 dark:bg-gray-900/50">
                  <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Action</td>
                  {products.map(product => (
                    <td key={product.id} className="p-4 text-center">
                      <a
                        href={product.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Shop on eBay
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-green-800 dark:text-green-200 mb-4">
            💡 Our Recommendation
          </h2>
          <p className="text-green-700 dark:text-green-300">
            Based on price alone, the <strong>{products.find(p => p.price === lowestPrice)?.title}</strong> offers 
            the best value at <strong>${lowestPrice.toFixed(2)}</strong>. 
            {highestPrice - lowestPrice > 0 && (
              <> That's a savings of <strong>${(highestPrice - lowestPrice).toFixed(2)}</strong> compared to the most expensive option.</>
            )}
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading comparison...</p>
        </div>
      </main>
    }>
      <CompareContent />
    </Suspense>
  );
}
