import { Metadata } from 'next';
import Link from 'next/link';
import { generateArticleSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'iPhone 15 Pro vs Samsung Galaxy S24: Which to Buy in 2026?',
  description: 'Detailed comparison of iPhone 15 Pro vs Samsung Galaxy S24. Camera, performance, battery life, and best eBay deals. Expert verdict for 2026.',
  keywords: 'iphone 15 pro vs samsung s24, iphone vs samsung 2026, best smartphone 2026, iphone 15 pro review, samsung s24 review',
};

const schema = generateArticleSchema({
  title: 'iPhone 15 Pro vs Samsung Galaxy S24: Ultimate Comparison 2026',
  description: 'Expert comparison of flagship smartphones',
  image: 'https://ebay-store.vercel.app/blog/phone-comparison.jpg',
  publishedAt: '2026-02-16T00:00:00Z',
  author: 'DealsHub Editorial',
  siteUrl: 'https://ebay-store.vercel.app'
});

export default function PhoneComparisonPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      <article className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link> {' > '}
            <Link href="/blog" className="hover:text-blue-600">Blog</Link> {' > '}
            <span className="text-gray-800 dark:text-white">iPhone 15 Pro vs Samsung S24</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              iPhone 15 Pro vs Samsung Galaxy S24: Which Should You Buy?
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2026-02-16">February 16, 2026</time>
              <span>•</span>
              <span>12 min read</span>
            </div>
          </header>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-3">🎯 Quick Verdict</h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p><strong>iPhone 15 Pro wins if:</strong> You want best-in-class camera, seamless ecosystem, and premium build quality.</p>
              <p><strong>Samsung S24 wins if:</strong> You want customization, better battery life, and 120Hz LTPO display.</p>
              <p><strong>Price difference:</strong> S24 is $100-150 cheaper on eBay ($699 vs $849)</p>
            </div>
          </div>

          <section className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <h2>Detailed Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="border p-3 text-left">Feature</th>
                    <th className="border p-3">iPhone 15 Pro</th>
                    <th className="border p-3">Samsung S24</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-3 font-semibold">Display</td>
                    <td className="border p-3">6.1" OLED, 120Hz</td>
                    <td className="border p-3 text-green-600">6.2" AMOLED, 120Hz LTPO ✓</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-semibold">Processor</td>
                    <td className="border p-3 text-green-600">A17 Pro (3nm) ✓</td>
                    <td className="border p-3">Snapdragon 8 Gen 3</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-semibold">Camera</td>
                    <td className="border p-3 text-green-600">48MP main, ProRAW ✓</td>
                    <td className="border p-3">50MP main, 3x zoom</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-semibold">Battery</td>
                    <td className="border p-3">3,274 mAh (all-day)</td>
                    <td className="border p-3 text-green-600">4,000 mAh (1.5 days) ✓</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-semibold">Price (eBay)</td>
                    <td className="border p-3">$849</td>
                    <td className="border p-3 text-green-600">$699 ✓</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Camera Showdown</h3>
            <p>
              The <strong>iPhone 15 Pro</strong> takes better photos in low light and produces more natural colors. 
              Its ProRAW format gives pros ultimate editing control. The S24 excels in zoom photography with its 
              3x optical zoom lens.
            </p>

            <h3>Performance & Gaming</h3>
            <p>
              Apple's A17 Pro chip is technically faster in benchmarks, but the <strong>Snapdragon 8 Gen 3</strong> in the S24 
              delivers comparable real-world performance. Both handle Genshin Impact and Call of Duty Mobile at max settings.
            </p>

            <h3>Battery Life Winner</h3>
            <p>
              Samsung S24's larger 4,000 mAh battery easily outlasts the iPhone, providing 1.5 days of mixed use vs iPhone's 
              full-day lifespan. Charging is faster too (25W vs 20W).
            </p>

            <h2>Where to Buy (Best Deals)</h2>
            <div className="grid md:grid-cols-2 gap-6 not-prose">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">iPhone 15 Pro</h3>
                <p className="text-3xl font-bold text-blue-600 mb-4">$849</p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                  <li>✓ Certified Refurbished</li>
                  <li>✓ 90-day warranty</li>
                  <li>✓ Free shipping</li>
                </ul>
                <a href="https://www.ebay.com/sch/i.html?_nkw=iphone+15+pro" target="_blank" rel="noopener" 
                   className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium">
                  View on eBay →
                </a>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Samsung S24</h3>
                <p className="text-3xl font-bold text-green-600 mb-4">$699</p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                  <li>✓ Factory Unlocked</li>
                  <li>✓ 1-year warranty</li>
                  <li>✓ Like-new condition</li>
                </ul>
                <a href="https://www.ebay.com/sch/i.html?_nkw=samsung+galaxy+s24" target="_blank" rel="noopener"
                   className="block w-full text-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium">
                  View on eBay →
                </a>
              </div>
            </div>

            <h2>FAQ</h2>
            <details className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3">
              <summary className="font-semibold cursor-pointer">Which has better resale value?</summary>
              <p className="mt-2">iPhone 15 Pro holds value better—typically 60% after 2 years vs S24's 45%.</p>
            </details>
            <details className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3">
              <summary className="font-semibold cursor-pointer">Can I use both phones internationally?</summary>
              <p className="mt-2">Yes, both are unlocked and support global LTE/5G bands when bought from eBay.</p>
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