import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us - DealsHub',
  description: 'Learn about DealsHub, your trusted source for the best eBay deals. Discover our mission, how we work, and why thousands trust us for their online shopping needs.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About DealsHub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your trusted partner in finding the best deals on eBay
          </p>
        </div>

        {/* Our Story */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Our Story
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              DealsHub was born from a simple idea: make online shopping smarter, easier, and more rewarding. 
              We know how overwhelming it can be to find genuine deals among millions of products on eBay.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              That's why we created DealsHub - a curated platform that brings you the best deals across electronics, 
              gaming, fashion, home goods, and more. We do the hard work of finding, verifying, and organizing the 
              best offers so you don't have to.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Since our launch, we've helped thousands of shoppers save money and discover amazing products they love.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="mb-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            To empower shoppers with the tools, information, and confidence they need to make smart purchasing 
            decisions and get the best value for their money.
          </p>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                We Search
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our team scours eBay daily to find the hottest deals and trending products
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                We Verify
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Every deal is checked for authenticity, seller reputation, and real value
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                You Save
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Browse our curated collection and shop with confidence knowing you're getting the best deals
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Why Choose DealsHub?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Curated Selection</h3>
                <p className="text-gray-600 dark:text-gray-400">Hand-picked deals across popular categories</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Updated Daily</h3>
                <p className="text-gray-600 dark:text-gray-400">Fresh deals added every single day</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Trusted Sellers</h3>
                <p className="text-gray-600 dark:text-gray-400">We only feature reputable eBay sellers</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">100% Free</h3>
                <p className="text-gray-600 dark:text-gray-400">No fees, no subscriptions, just great deals</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Easy to Use</h3>
                <p className="text-gray-600 dark:text-gray-400">Simple interface, powerful search, fast checkout</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Secure Shopping</h3>
                <p className="text-gray-600 dark:text-gray-400">All purchases through eBay's secure platform</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">62+</div>
              <div className="text-gray-600 dark:text-gray-400">Active Deals</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">6</div>
              <div className="text-gray-600 dark:text-gray-400">Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">Daily</div>
              <div className="text-gray-600 dark:text-gray-400">Updates</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600 dark:text-gray-400">Free Service</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of smart shoppers who trust DealsHub for the best eBay deals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-blue-600 bg-white hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              Browse Deals
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
