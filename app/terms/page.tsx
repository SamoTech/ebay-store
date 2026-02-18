import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | DealsHub',
  description: 'Terms and conditions for using DealsHub affiliate marketing website.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Last updated: February 16, 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              By accessing and using DealsHub, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              DealsHub is an affiliate marketing website that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Curates and displays deals from eBay</li>
              <li>Provides shopping guides and product reviews</li>
              <li>Provides deal discovery tools and product search features</li>
              <li>Earns commissions from qualifying purchases made through our affiliate links</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Affiliate Disclosure
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>Important:</strong> DealsHub is a participant in the eBay Partner Network and earns commissions from qualifying purchases.
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Links to eBay products are affiliate links</li>
              <li>We earn a commission when you click our links and make a purchase</li>
              <li>This does NOT increase the price you pay</li>
              <li>We only recommend products we believe offer value to our users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. No Warranties
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              DealsHub provides information and links as is without any warranties:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Price accuracy:</strong> Prices shown may not reflect current eBay prices due to caching or delays</li>
              <li><strong>Product availability:</strong> Products may sell out or become unavailable</li>
              <li><strong>Product quality:</strong> We do not guarantee the quality or authenticity of products sold by eBay sellers</li>
              <li><strong>Deals:</strong> Deals and discounts are subject to change without notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Third-Party Transactions
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              When you click our links and purchase from eBay, you enter into a transaction with eBay and/or the individual eBay seller, NOT with DealsHub. We are not responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mt-4">
              <li>Product quality, authenticity, or condition</li>
              <li>Shipping delays or issues</li>
              <li>Seller disputes or refunds</li>
              <li>eBay policies or changes to their platform</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              For issues with purchases, contact eBay customer support directly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. User Conduct
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You agree NOT to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Use automated tools (bots, scrapers) to access our website</li>
              <li>Attempt to circumvent affiliate links or tracking</li>
              <li>Copy or reproduce our content without permission</li>
              <li>Use our website for any illegal or unauthorized purpose</li>
              <li>Attempt to hack, disrupt, or overload our servers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              All content on DealsHub (text, images, logos, design) is owned by DealsHub or licensed to us. Product images and descriptions belong to their respective owners (eBay sellers, manufacturers). You may not copy, reproduce, or distribute our content without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              DealsHub and its operators are NOT liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mt-4">
              <li>Any losses from purchases made through our affiliate links</li>
              <li>Inaccurate pricing, product descriptions, or availability</li>
              <li>Issues with eBay sellers or products</li>
              <li>Website downtime or technical issues</li>
              <li>Loss of data, savings, or profits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              9. Contact Communications
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you contact us through forms, you agree that we may use your submitted email to respond to your request.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              10. Changes to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated date. Continued use of our website after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              11. Governing Law
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              These Terms of Service are governed by applicable international e-commerce laws. Any disputes will be resolved through binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              12. Contact Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have questions about these Terms of Service, please contact us through our website.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
