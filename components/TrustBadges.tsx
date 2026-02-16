'use client';

import { Shield, Lock, Award, CheckCircle, TrendingUp } from 'lucide-react';

export default function TrustBadges() {
  return (
    <section className="bg-white dark:bg-gray-800 py-8 border-y border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4">
        {/* eBay Partner Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg">
            <Award className="text-yellow-300" size={24} />
            <span className="text-white font-bold text-lg">
              Verified eBay Partner Network Member
            </span>
            <CheckCircle className="text-green-300" size={24} />
          </div>
        </div>

        {/* Trust Signals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Buyer Protection */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-3">
              <Shield className="text-green-600 dark:text-green-400" size={32} />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-1">Buyer Protection</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              100% eBay Money Back Guarantee
            </p>
          </div>

          {/* Secure Shopping */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-3">
              <Lock className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-1">Secure Shopping</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              SSL Encrypted Connections
            </p>
          </div>

          {/* Verified Deals */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-3">
              <CheckCircle className="text-purple-600 dark:text-purple-400" size={32} />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-1">Verified Deals</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time Price Validation
            </p>
          </div>

          {/* Trusted Platform */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-3">
              <TrendingUp className="text-yellow-600 dark:text-yellow-400" size={32} />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-1">132M+ Buyers</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Active eBay Community
            </p>
          </div>
        </div>

        {/* Affiliate Disclosure */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            <strong>Transparency Note:</strong> We are an authorized eBay Partner Network affiliate. 
            When you purchase through our links, we may earn a commission at no extra cost to you. 
            This helps us provide free content and maintain this platform. All prices and availability 
            are accurate at the time of publication.
          </p>
        </div>
      </div>
    </section>
  );
}
