import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | DealsHub',
  description: 'Learn how DealsHub collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Last updated: February 16, 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              DealsHub is an affiliate marketing website that helps users find deals on eBay. We collect minimal information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Email addresses:</strong> When you subscribe to our newsletter for deal alerts</li>
              <li><strong>Analytics data:</strong> We use cookies and analytics tools to understand how visitors use our site</li>
              <li><strong>Preferences:</strong> We store your favorite products and recently viewed items in your browser local storage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Send you deal alerts and newsletters (only if you subscribe)</li>
              <li>Improve our website and user experience</li>
              <li>Analyze site traffic and user behavior</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Third-Party Services
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>eBay Partner Network:</strong> We participate in the eBay Partner Network and earn commissions from qualifying purchases</li>
              <li><strong>Vercel Analytics:</strong> For website performance monitoring</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              When you click on affiliate links and purchase products on eBay, you are subject to eBay privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Cookies and Tracking
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Remember your preferences (dark mode, currency, etc.)</li>
              <li>Track affiliate link clicks for commission purposes</li>
              <li>Analyze site performance and user behavior</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              You can disable cookies in your browser settings, but this may affect site functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Data Storage and Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We store your data securely and do not sell your personal information to third parties. Email addresses are stored securely and only used for sending newsletters you have subscribed to.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Your Rights
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Unsubscribe from our newsletter at any time (link in every email)</li>
              <li>Request deletion of your email address from our database</li>
              <li>Clear your local storage data (favorites, recently viewed) by clearing your browser data</li>
              <li>Opt out of analytics tracking using browser extensions or settings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Children Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Changes to This Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update this privacy policy from time to time. We will notify you of significant changes by posting a notice on our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              9. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have questions about this privacy policy, please contact us through our website.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
