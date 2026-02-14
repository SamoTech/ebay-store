'use client';

import { useState } from 'react';
import { Product } from '../lib/products';

interface ShareButtonProps {
  product: Product;
  className?: string;
}

export default function ShareButton({ product, className = '' }: ShareButtonProps) {
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Check out this deal: ${product.title} - Only $${product.price}!`,
      url: typeof window !== 'undefined' ? window.location.href : ''
    };

    try {
      if (navigator.share) {
        // Native mobile share
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (e) {
        alert('Could not share this product');
      }
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        className={`flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors ${className}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share Deal
      </button>

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          ✓ Link copied to clipboard!
        </div>
      )}
    </>
  );
}
