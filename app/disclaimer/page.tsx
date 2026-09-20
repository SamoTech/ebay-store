import type { Metadata } from 'next';
import { absoluteUrl } from '../../lib/site';
import LegalPageShell from '../../components/LegalPageShell';

export const metadata: Metadata = {
  title: 'Affiliate & Legal Disclaimers | Saleh Store',
  description: 'Affiliate, pricing, availability, and third-party transaction disclosures for Saleh Store.',
  alternates: { canonical: absoluteUrl('/disclaimer') },
};

export default function DisclaimerPage() {
  return (
    <LegalPageShell title="Affiliate & Legal Disclaimers" effectiveDate="September 20, 2026">
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">eBay Partner Network Disclosure</h2><p><strong>Saleh Store is a participant in the eBay Partner Network, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to eBay.com.</strong></p><p className="mt-3">When you click an affiliate link on Saleh Store and make a qualifying purchase, we may earn a commission. This does not increase the price you pay for the item.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Affiliate Advertising Disclosure</h2><p>Saleh Store may receive compensation when visitors click affiliate links and make qualifying purchases. This relationship is disclosed clearly because it is a material connection that may be relevant when evaluating our recommendations or deal content.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Pricing and Availability</h2><p>Prices, discounts, inventory, shipping charges, taxes, seller information, and availability can change at any time. Information displayed on Saleh Store may be delayed or may contain errors. The final price and terms are those shown on eBay at the time of purchase.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Seller or Product Guarantee</h2><p>Saleh Store does not manufacture, own, inspect, authenticate, warehouse, ship, or fulfill products listed on eBay. We do not guarantee seller performance, product condition, authenticity, warranty coverage, shipping, returns, refunds, or suitability. Product and seller disputes should be addressed with eBay and/or the applicable seller.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Implied Endorsement</h2><p>References to eBay, sellers, brands, products, trademarks, or logos are for identification and shopping-navigation purposes. Unless expressly stated, they do not imply sponsorship, endorsement, or certification by the referenced brand, seller, or eBay.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Editorial and Commercial Transparency</h2><p>Affiliate commissions help support operation of Saleh Store. The existence of an affiliate relationship should be considered when evaluating our deal content. We do not represent that every product is the cheapest available or that every deal is suitable for every buyer.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Questions</h2><p>For questions about affiliate links or disclosures, use our <a className="text-blue-600 dark:text-blue-400 hover:underline" href="/contact">Contact Us</a> page.</p></section>
    </LegalPageShell>
  );
}
