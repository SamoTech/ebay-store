'use client';

import { useState } from 'react';
import { Product } from '../lib/products';
import { trackEvent } from '../lib/analytics';

interface PriceAlertFormProps {
  product: Product;
}

export default function PriceAlertForm({ product }: PriceAlertFormProps) {
  const [email, setEmail] = useState('');
  const [targetPrice, setTargetPrice] = useState(Math.floor(product.price * 0.9)); // Default 10% discount
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/price-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          productId: product.id,
          productTitle: product.title,
          currentPrice: product.price,
          targetPrice,
          productImage: product.image,
          affiliateLink: product.affiliateLink
        })
      });

      if (response.ok) {
        setSuccess(true);
        trackEvent({ event: 'price_alert_created', productId: product.id, targetPrice });
        setTimeout(() => {
          setSuccess(false);
          setEmail('');
        }, 3000);
      } else {
        setError('Failed to create price alert. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
        <p className="text-green-800 dark:text-green-200 font-semibold">✓ Price Alert Set!</p>
        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
          We'll email you when the price drops below ${targetPrice}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
      <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
        <span>💰</span> Price Drop Alert
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        Get notified when this product goes on sale!
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Target Price: ${targetPrice}
          </label>
          <input
            type="range"
            min={Math.floor(product.price * 0.5)}
            max={product.price}
            value={targetPrice}
            onChange={(e) => setTargetPrice(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Save ${(product.price - targetPrice).toFixed(2)}</span>
            <span>{Math.round(((product.price - targetPrice) / product.price) * 100)}% off</span>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Setting Alert...' : 'Notify Me When Price Drops'}
        </button>
      </form>
    </div>
  );
}
