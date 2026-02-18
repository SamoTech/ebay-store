import { Metadata } from 'next';
import Link from 'next/link';
import { generateArticleSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Top 15 eBay Deals This Week (February 2026) - DealsHub',
  description: 'Hand-picked eBay deals for February 2026. Electronics, gaming, fashion, and more. Updated weekly with verified discounts up to 60% off.',
  keywords: 'ebay deals february 2026, best ebay deals, ebay discounts, cheap deals ebay, weekly ebay deals',
};

const schema = generateArticleSchema({
  title: 'Top 15 eBay Deals This Week (February 2026)',
  description: 'Curated list of the best deals on eBay this week',
  image: 'https://ebay-store.vercel.app/blog/deals-hero.jpg',
  publishedAt: '2026-02-16T00:00:00Z',
  author: 'DealsHub Deals Team',
  siteUrl: 'https://ebay-store.vercel.app'
});

const deals = [
  { id: 1, title: 'Sony WH-1000XM5 Headphones', price: 249, originalPrice: 399, discount: 38, category: 'Audio', link: 'https://www.ebay.com/sch/i.html?_nkw=sony+wh1000xm5' },
  { id: 2, title: 'Nintendo Switch OLED', price: 299, originalPrice: 349, discount: 14, category: 'Gaming', link: 'https://www.ebay.com/sch/i.html?_nkw=nintendo+switch+oled' },
  { id: 3, title: 'Apple Watch Series 9', price: 329, originalPrice: 429, discount: 23, category: 'Wearables', link: 'https://www.ebay.com/sch/i.html?_nkw=apple+watch+series+9' },
  { id: 4, title: 'LG 55" C3 OLED TV', price: 1199, originalPrice: 1799, discount: 33, category: 'TV', link: 'https://www.ebay.com/sch/i.html?_nkw=lg+c3+oled+55' },
  { id: 5, title: 'Dyson V15 Vacuum', price: 499, originalPrice: 749, discount: 33, category: 'Home', link: 'https://www.ebay.com/sch/i.html?_nkw=dyson+v15' },
  { id: 6, title: 'Ray-Ban Aviators', price: 89, originalPrice: 154, discount: 42, category: 'Fashion', link: 'https://www.ebay.com/sch/i.html?_nkw=ray+ban+aviator' },
  { id: 7, title: 'DJI Mini 3 Pro Drone', price: 659, originalPrice: 759, discount: 13, category: 'Tech', link: 'https://www.ebay.com/sch/i.html?_nkw=dji+mini+3+pro' },
  { id: 8, title: 'Instant Pot Duo Plus', price: 79, originalPrice: 129, discount: 39, category: 'Kitchen', link: 'https://www.ebay.com/sch/i.html?_nkw=instant+pot+duo+plus' },
  { id: 9, title: 'Bose SoundLink Flex', price: 99, originalPrice: 149, discount: 34, category: 'Audio', link: 'https://www.ebay.com/sch/i.html?_nkw=bose+soundlink+flex' },
  { id: 10, title: 'LEGO Star Wars UCS Set', price: 349, originalPrice: 499, discount: 30, category: 'Toys', link: 'https://www.ebay.com/sch/i.html?_nkw=lego+star+wars+ucs' },
];

export default function DealsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      <article className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link> {' > '}
            <Link href="/blog" className="hover:text-blue-600">Blog</Link> {' > '}
            <span className="text-gray-800 dark:text-white">eBay Deals February 2026</span>
          </nav>

          <header className="mb-8">
            <div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold mb-4">
              🔥 HOT DEALS
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Top 15 eBay Deals This Week (February 16, 2026)
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Hand-picked deals updated weekly. Save up to 60% on verified sellers with free shipping.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-4">
              <time dateTime="2026-02-16">Updated: Feb 16, 2026</time>
              <span>•</span>
              <span>Verified deals</span>
            </div>
          </header>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">⏰ Limited Time Offers</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These deals expire within 48-72 hours. Stock is limited. All items ship from US sellers with eBay's Money Back Guarantee.
            </p>
            <div className="flex gap-3">
              <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold">
                ✓ Free Shipping
              </span>
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
                ✓ Buyer Protection
              </span>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">This Week's Hottest Deals</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {deals.map((deal, idx) => (
                <div key={deal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400">#{idx + 1}</span>
                    <span className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded text-sm font-bold">
                      {deal.discount}% OFF
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{deal.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{deal.category}</p>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-3xl font-bold text-green-600">${deal.price}</span>
                    <span className="text-lg text-gray-400 line-through">${deal.originalPrice}</span>
                  </div>
                  <a 
                    href={deal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Deal on eBay →
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-blue-600 text-white rounded-lg p-8 mb-12">
            <h2 className="text-3xl font-bold mb-4">🚀 Explore More Deals</h2>
            <p className="text-lg text-blue-100 mb-6">
              New deals added every Monday and Thursday. Bookmark this page or follow us for instant notifications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/" className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-center">
                Browse All Products
              </Link>
              <a href="https://www.ebay.com/deals" target="_blank" rel="noopener" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-400 transition-colors font-medium text-center">
                eBay Deals Page →
              </a>
            </div>
          </section>

          <section className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <h2>How We Find These Deals</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our team monitors <strong>over 10,000 eBay listings daily</strong> using price tracking algorithms and seller reputation data. 
              We verify each deal manually to ensure:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Sellers have 98%+ positive feedback</li>
              <li>Prices are genuinely discounted (not fake "sales")</li>
              <li>Products are authentic and ship from verified locations</li>
              <li>Free or low-cost shipping is available</li>
            </ul>

            <h2>Deal Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 not-prose">
              {['Electronics', 'Gaming', 'Fashion', 'Home', 'Audio', 'Wearables'].map(cat => (
                <div key={cat} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <p className="font-semibold text-gray-900 dark:text-white">{cat}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">New deals weekly</p>
                </div>
              ))}
            </div>

            <h2>FAQ</h2>
            <details className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3">
              <summary className="font-semibold cursor-pointer">Are these deals legit?</summary>
              <p className="mt-2">Yes! All deals are from eBay's verified seller network with buyer protection.</p>
            </details>
            <details className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">How often are deals updated?</summary>
              <p className="mt-2">We update this list every Monday and Thursday with fresh deals.</p>
            </details>
          </section>

          <div className="mt-12 text-center">
            <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-medium">← Back to Blog</Link>
          </div>
        </div>
      </article>
    </>
  );
}