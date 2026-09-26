import type { Metadata } from 'next';
import Link from 'next/link';
import { absoluteUrl } from '../../../lib/site';
import { SchemaScript } from '../../../lib/schema';

export const metadata: Metadata = {
  title: 'Saleh Store Editorial Team',
  description:
    'Meet the Saleh Store editorial team and learn how our shopping guides evaluate product specifications, compatibility, condition, price, shipping, and marketplace purchase terms.',
  alternates: { canonical: absoluteUrl('/about/editorial-team') },
};

export default function EditorialTeamPage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteUrl('/about/editorial-team#organization'),
    name: 'Saleh Store Editorial Team',
    url: absoluteUrl('/about/editorial-team'),
    parentOrganization: { '@id': absoluteUrl('/#organization') },
    description:
      'Editorial team publishing practical product research and marketplace buying guides based on specifications, price comparison, compatibility, condition, and purchase terms.',
  };

  return (
    <>
      <SchemaScript schema={organizationSchema} />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <section className="bg-gradient-to-br from-[#0064d2] via-[#0054ad] to-[#003f7f] text-white px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-blue-100 mb-5" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/about" className="hover:text-white">About</Link>
              <span className="mx-2">/</span>
              <span>Editorial Team</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-black">Saleh Store Editorial Team</h1>
            <p className="mt-5 text-lg leading-8 text-blue-100">
              We publish practical shopping research for people comparing products and eBay marketplace listings.
            </p>
          </div>
        </section>

        <article className="max-w-4xl mx-auto px-4 py-12 space-y-10">
          <section>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Editorial method</h2>
            <p className="mt-3 text-gray-700 dark:text-gray-300 leading-8">
              Our guides focus on information that can materially change a purchase comparison: exact model and variant, specifications, compatibility, condition, included accessories, total delivered cost, shipping, and return terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">What we do not claim</h2>
            <p className="mt-3 text-gray-700 dark:text-gray-300 leading-8">
              We do not present generic marketplace listings as firsthand product testing, and we do not invent customer reviews, seller histories, prices, or product specifications. When a fact depends on a live eBay listing, the listing itself remains the source of truth.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Research hub</h2>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link href="/blog" className="font-semibold text-[#0064d2] hover:underline">Shopping guides</Link>
              <Link href="/categories" className="font-semibold text-[#0064d2] hover:underline">Product categories</Link>
              <Link href="/" className="font-semibold text-[#0064d2] hover:underline">Product discovery</Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
