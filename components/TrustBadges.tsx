'use client';

import { Shield, Lock, TrendingUp, CheckCircle } from 'lucide-react';

export default function TrustBadges() {
  return (
    <section className="bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-2">
              <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Verified eBay Partner</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Official Partner Network</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-2">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Buyer Protection</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">eBay Money Back Guarantee</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-2">
              <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Secure Shopping</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">SSL Encrypted</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full mb-2">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Daily Deals</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Updated every 24 hours</p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            <strong>Disclosure:</strong> We earn a commission from qualifying purchases made through our affiliate links at no additional cost to you.
          </p>
        </div>
      </div>
    </section>
  );
}