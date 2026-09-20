import type { Metadata } from 'next';
import { absoluteUrl } from '../../lib/site';
import LegalPageShell from '../../components/LegalPageShell';

export const metadata: Metadata = {
  title: 'Terms of Use | Saleh Store',
  description: 'Terms of Use for Saleh Store, an eBay affiliate deals hub.',
  alternates: { canonical: absoluteUrl('/terms') },
};

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Use" effectiveDate="September 20, 2026">
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2><p>By accessing saleh-store.com, you agree to these Terms of Use. If you do not agree, please do not use the website.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">2. Nature of Our Service</h2><p>Saleh Store is a curated affiliate deals and product-discovery website. We do not sell, manufacture, package, ship, fulfill, or provide customer service for products listed on the website.</p><ul className="list-disc pl-6 space-y-2"><li><strong>Product information, pricing, availability, shipping, seller policies, and promotions</strong> are controlled by eBay and/or the applicable seller.</li><li>Prices and availability may change between the time information is displayed on Saleh Store and the time you visit eBay.</li><li>A transaction made after following an affiliate link is between you, eBay, and/or the applicable seller.</li></ul></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">3. Affiliate Disclosure</h2><p>Saleh Store participates in the eBay Partner Network. We may earn a commission from qualifying purchases generated through our affiliate links, at no additional affiliate charge to you. Our affiliate relationship does not mean that eBay or an individual seller endorses Saleh Store.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">4. Pricing, Availability, and Accuracy</h2><p>We aim to provide useful and current deal information, but we do not guarantee that product descriptions, prices, discounts, stock status, seller information, shipping costs, taxes, or other listing details are complete, current, or error-free. Always verify the final terms on eBay before purchasing.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">5. Third-Party Transactions and Liability</h2><p>Saleh Store does not participate in, control, or guarantee transactions between users and eBay sellers. To the extent permitted by applicable law, Saleh Store is not responsible for defective products, counterfeit or misrepresented items, seller disputes, refunds, returns, shipping delays, taxes, customs, payment issues, account issues, or losses arising from a third-party transaction. Order, return, refund, and purchase-support requests should be directed to eBay or the applicable seller.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">6. Disclaimer of Warranties</h2><p>The website and its content are provided on an “as is” and “as available” basis to the extent permitted by law. We do not warrant uninterrupted availability, completeness, accuracy, or suitability for a particular purpose.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">7. Intellectual Property</h2><p>Saleh Store’s original text, design, branding, and website materials are owned by or licensed to us. eBay names, trademarks, logos, product images, listing content, and other third-party materials remain the property of their respective owners.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">8. Acceptable Use</h2><p>You may not use the website to interfere with its operation, attempt unauthorized access, introduce malicious code, abuse APIs or services, or systematically copy content without permission.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">9. Changes</h2><p>We may modify these Terms of Use by publishing an updated version on this page. Continued use after an update constitutes acceptance to the extent permitted by applicable law.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">10. Governing Law</h2><p>These Terms are intended to be governed by the laws of the Arab Republic of Egypt, without prejudice to any mandatory consumer-protection or data-protection rights that apply to you under the law of your place of residence. Subject to those mandatory rights, disputes shall be brought before the competent courts in Egypt.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">11. Contact</h2><p>Questions about these Terms can be submitted through our <a className="text-blue-600 dark:text-blue-400 hover:underline" href="/contact">Contact Us</a> page.</p></section>
    </LegalPageShell>
  );
}
