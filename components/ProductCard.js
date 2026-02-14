'use client';

import { useFavorites } from '../contexts/FavoritesContext';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { useToast } from './Toast';

export default function ProductCard({ product }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { addToast } = useToast();
  const isFav = isFavorite(product.id);

  const handleFavoriteClick = (e) => {
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

  const handleShare = async (e) => {
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
      // Fallback: copy to clipboard
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative h-48 bg-gray-100 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
          loading="lazy"
        />
        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
          {product.category}
        </span>
        
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
      </div>
      <div className="p-4">
        <h3 className="font-bold text-sm line-clamp-2 min-h-[2.5rem]">{product.title}</h3>
        <p className="text-gray-500 text-xs mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-green-600 font-bold text-xl">
            ${product.price.toFixed(2)}
          </p>
          {product.originalPrice && (
            <p className="text-gray-400 text-sm line-through">
              ${product.originalPrice.toFixed(2)}
            </p>
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
