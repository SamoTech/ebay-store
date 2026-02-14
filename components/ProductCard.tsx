'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useFavorites } from '../contexts/FavoritesContext';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { useToast } from '../contexts/ToastContext';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  affiliateLink: string;
  description?: string;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
}

interface ProductCardProps {
  product: Product;
  showCompare?: boolean;
  onCompare?: (product: Product) => void;
  isComparing?: boolean;
}

export default function ProductCard({ product, showCompare, onCompare, isComparing }: ProductCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { addToast } = useToast();
  const isFav = isFavorite(product.id);

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
      title: product.title,
      text: `Check out this deal: ${product.title} - $${product.price}`,
      url: product.affiliateLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        addToast('Shared successfully!', 'success');
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${product.title} - ${product.affiliateLink}`);
        addToast('Link copied to clipboard!', 'success');
      } catch (err) {
        addToast('Failed to copy link', 'error');
      }
    }
  };

  const handleProductClick = () => {
    addToRecentlyViewed({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      affiliateLink: product.affiliateLink,
    });
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCompare) {
      onCompare(product);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {product.reviewCount && (
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({product.reviewCount})</span>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group ${isComparing ? 'ring-2 ring-blue-500' : ''}`}>
      <Link href={`/product/${product.id}`} onClick={handleProductClick}>
        <div className="relative h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          <Image 
            src={product.image} 
            alt={product.title} 
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
          />
          
          {/* Category Badge */}
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
            {product.category}
          </span>

          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute top-2 left-20 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
              -{discount}%
            </span>
          )}
          
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
              isFav 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill={isFav ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isFav ? 0 : 2}
            >
              <path 
                fillRule="evenodd" 
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="absolute bottom-2 right-2 p-2 bg-white/80 text-gray-600 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Share product"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </button>

          {/* Compare Button */}
          {showCompare && (
            <button
              onClick={handleCompareClick}
              className={`absolute bottom-2 left-2 p-2 rounded-full transition-all duration-200 ${
                isComparing 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-blue-600'
              } opacity-0 group-hover:opacity-100`}
              aria-label="Compare product"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/product/${product.id}`} onClick={handleProductClick}>
          <h3 className="font-bold text-sm line-clamp-2 min-h-[2.5rem] text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        {product.description && (
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-2">{product.description}</p>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="mt-2">
            {renderStars(product.rating)}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-green-600 dark:text-green-400 font-bold text-xl">
              ${product.price.toFixed(2)}
            </p>
            {product.originalPrice && (
              <p className="text-gray-400 dark:text-gray-500 text-sm line-through">
                ${product.originalPrice.toFixed(2)}
              </p>
            )}
          </div>
          {discount > 0 && (
            <span className="text-red-500 text-sm font-semibold">
              Save ${(product.originalPrice! - product.price).toFixed(2)}
            </span>
          )}
        </div>
        
        <a 
          href={product.affiliateLink} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={handleProductClick}
          className="block w-full bg-blue-600 text-white text-center py-2 rounded mt-3 hover:bg-blue-700 transition-colors font-medium active:scale-95 transform"
        >
          Shop Now on eBay
        </a>
      </div>
    </div>
  );
}
