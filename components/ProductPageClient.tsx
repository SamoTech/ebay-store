'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { allProducts, createSearchLink } from '../lib/products';
import { useFavorites } from '../contexts/FavoritesContext';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { useToast } from '../contexts/ToastContext';
import ProductCard from './ProductCard';
import Footer from './Footer';
import { trackEvent } from '../lib/analytics';

export default function ProductPageClient({ productId }: { productId: number }) {
  const product = allProducts.find(p => p.id === productId);
  
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { addToast } = useToast();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [priceAlert, setPriceAlert] = useState(false);
  
  const isFav = product ? isFavorite(product.id) : false;

  useEffect(() => {
    if (product) {
      addToRecentlyViewed({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        affiliateLink: product.affiliateLink,
      });
      
      // Load saved rating from localStorage
      const savedRating = localStorage.getItem(`rating-${product.id}`);
      if (savedRating) {
        setUserRating(Number(savedRating));
      }
      
      // Check price alert status
      const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
      setPriceAlert(alerts.includes(product.id));
      trackEvent({ event: 'product_view', productId: product.id, source: 'product_page', category: product.category });
    }
  }, [product]);

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Product Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleFavoriteClick = () => {
    if (isFav) {
      removeFavorite(product.id);
      addToast('Removed from favorites', 'info');
    } else {
      addFavorite({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        affiliateLink: product.affiliateLink,
      });
      addToast('Added to favorites!', 'success');
    }
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    localStorage.setItem(`rating-${product.id}`, String(rating));
    addToast(`You rated this product ${rating} stars!`, 'success');
  };

  const handlePriceAlert = () => {
    const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
    if (priceAlert) {
      const newAlerts = alerts.filter((id: number) => id !== product.id);
      localStorage.setItem('priceAlerts', JSON.stringify(newAlerts));
      setPriceAlert(false);
      addToast('Price alert removed', 'info');
    } else {
      alerts.push(product.id);
      localStorage.setItem('priceAlerts', JSON.stringify(alerts));
      setPriceAlert(true);
      addToast('Price alert set! We\'ll notify you when the price drops.', 'success');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Check out this deal: ${product.title} - $${product.price}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${product.title} - ${window.location.href}`);
        addToast('Link copied to clipboard!', 'success');
      } catch (err) {
        addToast('Failed to copy link', 'error');
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link></li>
          <li>/</li>
          <li><Link href={`/category/${product.category.toLowerCase().replace(' ', '-')}`} className="hover:text-blue-600 dark:hover:text-blue-400">{product.category}</Link></li>
          <li>/</li>
          <li className="text-gray-800 dark:text-white truncate max-w-[200px]">{product.title}</li>
        </ol>
      </nav>

      {/* Product Section */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Image Gallery */}
            <div className="md:w-1/2 p-6">
              <div className="relative h-80 md:h-96 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                    -{discount}% OFF
                  </span>
                )}
              </div>
              
              {/* Thumbnail placeholder - would have multiple images in real app */}
              <div className="flex gap-2 mt-4">
                <button className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden ring-2 ring-blue-500">
                  <Image src={product.image} alt="" width={64} height={64} className="object-cover w-full h-full" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-semibold px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Share"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleFavoriteClick}
                    className={`p-2 rounded-full transition-colors ${
                      isFav 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isFav ? 0 : 2}>
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Rate this product:</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      className={`w-8 h-8 transition-colors ${
                        star <= userRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                      }`}
                    >
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                  {userRating > 0 && (
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      You rated: {userRating}/5
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {product.description || `High-quality ${product.category.toLowerCase()} product available at great prices. Shop with confidence through eBay's buyer protection program.`}
              </p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-red-500 font-semibold">
                        Save ${(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Price Alert */}
              <button
                onClick={handlePriceAlert}
                className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg border transition-colors ${
                  priceAlert 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                {priceAlert ? 'Price Alert Active' : 'Set Price Drop Alert'}
              </button>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <a
                  href={product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent({ event: 'affiliate_outbound_click', productId: product.id, source: 'product_page', category: product.category })}
                  className="block w-full bg-blue-600 text-white text-center py-4 rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg"
                >
                  Shop Now on eBay
                </a>
                <a
                  href={createSearchLink(product.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-center py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Compare Prices on eBay
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <svg className="w-8 h-8 mx-auto text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Buyer Protection</p>
                  </div>
                  <div>
                    <svg className="w-8 h-8 mx-auto text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Secure Payment</p>
                  </div>
                  <div>
                    <svg className="w-8 h-8 mx-auto text-purple-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Fast Shipping</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
