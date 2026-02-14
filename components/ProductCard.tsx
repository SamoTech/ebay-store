'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../lib/products';
import { trackEvent } from '../lib/analytics';

interface ProductCardProps {
  product: Product;
  showCompare?: boolean;
  onCompare?: (product: Product) => void;
  isComparing?: boolean;
}

export default function ProductCard({ product, showCompare, onCompare, isComparing }: ProductCardProps) {
  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  // Check if this is an API product (ID >= 1000) or static product (ID < 1000)
  const isApiProduct = product.id >= 1000;

  const handleClick = () => {
    trackEvent({ 
      event: 'product_click', 
      productId: product.id, 
      source: isApiProduct ? 'api_product_card' : 'static_product_card', 
      category: product.category 
    });
  };

  // For API products, link directly to eBay
  // For static products, link to detail page
  const productLink = isApiProduct ? product.affiliateLink : `/product/${product.id}`;
  const linkTarget = isApiProduct ? "_blank" : undefined;
  const linkRel = isApiProduct ? "noopener noreferrer" : undefined;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <Link href={productLink} target={linkTarget} rel={linkRel} onClick={handleClick}>
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              -{discount}%
            </span>
          )}
          {isApiProduct && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              LIVE
            </span>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={productLink} target={linkTarget} rel={linkRel} onClick={handleClick}>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
            {product.category}
          </span>
          <h3 className="font-bold text-gray-800 dark:text-white mt-1 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-green-600 dark:text-green-400">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          {!isApiProduct && (
            <Link
              href={`/product/${product.id}`}
              className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              View Details
            </Link>
          )}
          <a
            href={product.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent({ event: 'affiliate_outbound_click', productId: product.id, source: 'product_card', category: product.category })}
            className={`${isApiProduct ? 'flex-1' : 'flex-1'} bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium`}
          >
            {isApiProduct ? 'View on eBay' : 'Buy Now'}
          </a>
        </div>

        {showCompare && onCompare && (
          <button
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
    </div>
  );
}
