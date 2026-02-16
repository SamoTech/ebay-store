'use client';

import { Shield, Lock, Award, CheckCircle, Star } from 'lucide-react';

export default function TrustBadges() {
  return (
    <section className="bg-white dark:bg-gray-800 py-12 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4">
        {/* Trust Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Shop with Confidence
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your trusted partner for the best eBay deals
          </p>
        </div>

        {/* Trust Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {/* eBay Partner Network Badge */}
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-blue-600">
              <Award className="text-white" size={24} />
            </div>
            <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-1">
              Verified Partner
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Official eBay Partner Network Member
            </p>
          </div>

          {/* Buyer Protection */}
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-green-600">
              <Shield className="text-white" size={24} />
            </div>
            <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-1">
              Buyer Protection
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              eBay Money Back Guarantee
            </p>
          </div>

          {/* Secure Checkout */}
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-purple-600">
              <Lock className="text-white" size={24} />
            </div>
            <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-1">
              Secure Checkout
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              SSL Encrypted Transactions
            </p>
          </div>

          {/* Quality Verified */}
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-yellow-600">
              <CheckCircle className="text-white" size={24} />
            </div>
            <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-1">
              Quality Verified
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Curated Top-Rated Sellers
            </p>
          </div>

          {/* Customer Rated */}
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <div className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-orange-600">
              <Star className="text-white" size={24} />
            </div>
            <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-1">
              Highly Rated
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              4.8/5 from 10,000+ Users
            </p>
          </div>
        </div>

        {/* Additional Trust Information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            <strong>Full Transparency:</strong> We may earn a commission when you purchase through our affiliate links at no extra cost to you.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            <span>✓ 24/7 Customer Support</span>
            <span>✓ Fast Shipping</span>
            <span>✓ Easy Returns</span>
            <span>✓ Price Match Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
}
