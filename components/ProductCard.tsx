'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product, isLiveProduct } from '../lib/products';
import { formatPrice } from '../lib/utils/price';
import { trackEvent } from '../lib/analytics';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';

interface ProductCardProps {
  product: Product;
  showCompare?: boolean;
  onCompare?: (product: Product) => void;
  isComparing?: boolean;
}

const blurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
const FALLBACK_IMAGE = 'https://via.placeholder.com/400x300?text=No+Image';

export default function ProductCard({ product, showCompare, onCompare, isComparing }: ProductCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { addToast } = useToast();

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const isApiProduct = product.isLive ?? isLiveProduct(product);
  const favorite = typeof product.id === 'number' && isFavorite(product.id);

  const handleClick = () => {
    trackEvent({
      event: isApiProduct ? 'affiliate_outbound_click' : 'product_card_click',
      productId: product.id,
      source: isApiProduct ? 'api_product_card' : 'static_product_card',
      category: product.category,
      url: product.affiliateLink,
    });
  };

  const handleFavorite = () => {
    if (favorite) {
      removeFavorite(product.id);
      addToast(`Removed "${product.title}" from favorites`, 'info');
      return;
    }

    addFavorite({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      affiliateLink: product.affiliateLink,
      description: product.description,
      originalPrice: product.originalPrice,
      currency: product.currency,
    });
    addToast(`Saved "${product.title}" to favorites`, 'success');
    trackEvent({ event: 'product_card_click', productId: product.id, source: 'favorite_toggle', category: product.category });
  };

  const productLink = isApiProduct ? product.affiliateLink : `/product/${product.id}`;
  const linkTarget = isApiProduct ? '_blank' : undefined;
  const linkRel = isApiProduct ? 'noopener noreferrer' : undefined;

  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group flex flex-col">
      <div className="relative">
        <Link href={productLink} target={linkTarget} rel={linkRel} onClick={handleClick}>
          <div className="relative h-52 overflow-hidden bg-gray-50 dark:bg-gray-700">
            <Image
              src={product.image?.trim() ? product.image : FALLBACK_IMAGE}
              alt={product.title}
              fill
              loading="lazy"
              placeholder="blur"
              blurDataURL={blurDataURL}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {discount > 0 && (
              <span className="absolute top-2 right-2 bg-[#e53238] text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-sm">
                -{discount}%
              </span>
            )}
            {isApiProduct && (
              <span className="absolute top-2 left-2 bg-[#86b817] text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-sm">
                LIVE
              </span>
            )}
          </div>
        </Link>

        <button
          type="button"
          onClick={handleFavorite}
          aria-label={favorite ? `Remove ${product.title} from favorites` : `Add ${product.title} to favorites`}
          aria-pressed={favorite}
          className={`absolute bottom-2 right-2 rounded-full p-2 shadow-md transition-colors ${
            favorite
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white/90 text-gray-600 hover:bg-white dark:bg-gray-800/90 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="p-4 md:p-5 flex flex-col flex-1">
        <Link href={productLink} target={linkTarget} rel={linkRel} onClick={handleClick}>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
            {product.category}
          </span>
          <h3 className="font-bold text-gray-800 dark:text-white mt-1 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.title}
          </h3>
        </Link>

        {(product.condition || product.shipping) && (
          <div className="flex flex-wrap gap-2 mb-2 text-xs">
            {product.condition && (
              <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-gray-600 dark:text-gray-300">
                {product.condition}
              </span>
            )}
            {product.shipping && (
              <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-gray-600 dark:text-gray-300">
                🚚 {product.shipping}
              </span>
            )}
          </div>
        )}

        <div className="flex items-baseline gap-2 mb-3 mt-auto">
          <span className="text-xl font-extrabold text-[#0064d2] dark:text-blue-400">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice, product.currency)}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {!isApiProduct && (
            <Link
              href={`/product/${product.id}`}
              className="flex-1 bg-[#0064d2] text-white text-center py-2.5 rounded-lg hover:bg-[#0054ad] transition-colors text-sm font-semibold"
            >
              View Details
            </Link>
          )}
          <a
            href={product.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent({ event: 'affiliate_outbound_click', productId: product.id, source: 'product_card', category: product.category, url: product.affiliateLink })}
            className="flex-1 bg-[#86b817] text-white text-center py-2.5 rounded-lg hover:bg-[#719f12] transition-colors text-sm font-semibold"
          >
            {isApiProduct ? 'View on eBay' : 'Buy Now'}
          </a>
        </div>

        {showCompare && onCompare && (
          <button
            type="button"
            onClick={() => onCompare(product)}
            className={`w-full mt-2 py-2 rounded-lg text-sm font-medium transition-colors ${
              isComparing
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {isComparing ? '✓ Added to Compare' : 'Compare'}
          </button>
        )}
      </div>
    </article>
  );
}
