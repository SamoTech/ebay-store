import type { Metadata } from 'next';
import Link from 'next/link';
import { absoluteUrl } from '../../lib/site';

export const metadata: Metadata = {
  title: 'About Saleh Store',
  description:
    'Learn how Saleh Store combines eBay product discovery with practical, independent shopping research.',
  alternates: { canonical: absoluteUrl('/about') },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-[#0064d2] via-[#0054ad] to-[#003f7f] px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-sm text-blue-100">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span>About</span>
          </nav>
          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">About Saleh Store</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">
            Saleh Store is an eBay-only product-discovery site built around a simple principle:
            useful shopping research should come before an affiliate click.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-10 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">What the site does</h2>
            <p className="mt-3 leading-8">
              The site brings together marketplace product discovery and editorial buying guidance.
              Product listings are a changing commercial layer; the editorial library focuses on the
              decisions that are easier to get wrong, such as exact configuration, compatibility,
              condition, delivered cost, accessories, and return terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">How we approach research</h2>
            <p className="mt-3 leading-8">
              Guides are written to help a reader make a decision without depending on an affiliate
              link. Where a claim depends on a live marketplace listing, current seller terms, price,
              inventory, or availability, the marketplace listing is the final source of truth.
            </p>
            <p className="mt-3 leading-8">
              We avoid presenting generic listing copy as product testing and do not claim personal
              ownership, hands-on testing, or credentials that are not documented.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Editorial standards</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white">Specific over generic</h3>
                <p className="mt-2 text-sm leading-6">Focus on decisions, tradeoffs, and details that materially change a purchase.</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white">Evidence over claims</h3>
                <p className="mt-2 text-sm leading-6">Separate known listing information from assumptions and avoid unsupported guarantees.</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white">Buyer value first</h3>
                <p className="mt-2 text-sm leading-6">Affiliate links are secondary to the information needed to evaluate a purchase.</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white">Transparent limitations</h3>
                <p className="mt-2 text-sm leading-6">When a conclusion cannot be established from available evidence, the guide says so.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Research resources</h2>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link href="/about/editorial-team" className="font-semibold text-[#0064d2] hover:underline">
                Editorial Team
              </Link>
              <Link href="/research/ebay-deal-comparison-methodology" className="font-semibold text-[#0064d2] hover:underline">
                Comparison Methodology
              </Link>
              <Link href="/blog" className="font-semibold text-[#0064d2] hover:underline">
                Shopping Guides
              </Link>
              <Link href="/contact" className="font-semibold text-[#0064d2] hover:underline">
                Contact
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Affiliate relationship</h2>
            <p className="mt-3 leading-7">
              Saleh Store participates in the eBay Partner Network. Some links may generate a
              commission from qualifying purchases at no additional cost to the buyer. Product,
              seller, price, inventory, shipping, and return information should be checked on eBay
              before purchase.
            </p>
            <Link href="/disclaimer" className="mt-4 inline-block font-semibold text-[#0064d2] hover:underline">
              Read the full affiliate and legal disclosure →
            </Link>
          </section>
        </div>
      </article>
    </main>
  );
}
