import type { Metadata } from 'next';
import Link from 'next/link';
import { absoluteUrl } from '../../../lib/site';
import { SchemaScript } from '../../../lib/schema';

export const metadata: Metadata = {
  title: 'eBay Deal Comparison Methodology | Saleh Store',
  description: 'The Saleh Store methodology for comparing eBay marketplace listings by product configuration, condition, price, shipping, accessories, and purchase terms.',
  alternates: { canonical: absoluteUrl('/research/ebay-deal-comparison-methodology') },
};

export default function MethodologyPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'eBay Deal Comparison Methodology',
    description: 'How Saleh Store normalizes and compares marketplace listings.',
    author: { '@type': 'Organization', name: 'Saleh Store Editorial Team', url: absoluteUrl('/about/editorial-team') },
    publisher: { '@id': absoluteUrl('/#organization') },
    mainEntityOfPage: absoluteUrl('/research/ebay-deal-comparison-methodology'),
  };

  return (
    <>
      <SchemaScript schema={schema} />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <article className="max-w-4xl mx-auto px-4 py-12">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-[#0064d2]">Home</Link>
            <span className="mx-2">/</span>
            <span>Research</span>
          </nav>

          <h1 className="mt-6 text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
            eBay Deal Comparison Methodology
          </h1>
          <p className="mt-5 text-lg leading-8 text-gray-700 dark:text-gray-300">
            Saleh Store compares marketplace listings by normalizing the variables that can materially change the real cost or usefulness of a purchase.
          </p>

          <div className="mt-10 space-y-10">
            <section>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">1. Normalize the product</h2>
              <p className="mt-3 leading-8 text-gray-700 dark:text-gray-300">
                Confirm the exact model, generation, storage, size, color, bundle, condition, and other variant information. Two listings are not directly comparable when their configurations differ.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">2. Calculate realistic cost</h2>
              <p className="mt-3 leading-8 text-gray-700 dark:text-gray-300">
                Start with item price and add shipping, applicable taxes or duties, required accessories, replacement parts, and other known costs. The headline price is not the complete comparison.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">3. Compare condition and completeness</h2>
              <p className="mt-3 leading-8 text-gray-700 dark:text-gray-300">
                New, used, open-box, refurbished, incomplete, and damaged listings should not be treated as equivalent. Check what is actually included and inspect condition evidence.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">4. Check purchase terms</h2>
              <p className="mt-3 leading-8 text-gray-700 dark:text-gray-300">
                Review shipping, handling, returns, seller information, compatibility, and any listing-specific restrictions before treating a price difference as meaningful.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">5. Preserve the evidence</h2>
              <p className="mt-3 leading-8 text-gray-700 dark:text-gray-300">
                For higher-value purchases, keep the listing description, photos, order details, and relevant messages until the transaction is complete and any return period has passed.
              </p>
            </section>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/tools/deal-comparison" className="font-semibold text-[#0064d2] hover:underline">Use the comparison calculator →</Link>
            <Link href="/blog/ecommerce-deal-price-comparison-guide" className="font-semibold text-[#0064d2] hover:underline">Read the buying guide →</Link>
          </div>
        </article>
      </main>
    </>
  );
}
