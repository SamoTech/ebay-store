import Link from 'next/link';
import { Metadata } from 'next';
import { absoluteUrl } from '../../lib/site';
import Footer from '../../components/Footer';
import { blogArticles } from '../../lib/blog-data';
import { SchemaScript } from '../../lib/schema';

export const metadata: Metadata = {
  title: 'Blog - Shopping Tips & Product Reviews',
  description: 'Expert shopping guides, honest product reviews, and money-saving strategies for finding the best deals on eBay. From electronics to sneakers, learn how to shop smarter.',
  keywords: ['eBay shopping guides', 'eBay buying tips', 'eBay deals', 'product buying guides', 'buyer protection'],
  openGraph: {
    title: 'Saleh Store Blog - eBay Shopping Guides & Buying Tips',
    description: 'Practical eBay shopping guides covering price comparison, electronics, gaming, buyer protection, and safer marketplace purchases.',
    type: 'website',
    url: absoluteUrl('/blog'),
  },
  alternates: {
    canonical: absoluteUrl('/blog'),
  },
};

const displayPosts = blogArticles;

export default function BlogPage() {
  const blogSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': absoluteUrl('/blog#blog'),
        url: absoluteUrl('/blog'),
        name: 'Saleh Store Blog',
        description: 'Practical eBay shopping guides covering price comparison, electronics, gaming, buyer protection, and safer marketplace purchases.',
        publisher: { '@id': absoluteUrl('/#organization') },
      },
      {
        '@type': 'ItemList',
        '@id': absoluteUrl('/blog#articles'),
        name: 'Saleh Store shopping guides',
        numberOfItems: blogArticles.length,
        itemListElement: blogArticles.map((article, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: absoluteUrl(`/blog/${article.slug}`),
          name: article.title,
        })),
      },
    ],
  };

  return (
    <>
      <SchemaScript schema={blogSchema} />
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Saleh Store Blog
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-4">
            Expert shopping guides, honest reviews, and insider tips
          </p>
          <p className="text-blue-200">
            Written by real shoppers, resellers, and product experts
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.map(post => {
            return (
              <article 
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`h-56 bg-gradient-to-br ${post.gradient} relative`}>
                  <div className="absolute inset-0 bg-black/10"></div>

                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 min-h-[3.5rem]">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-sm">
                      <p className="text-gray-900 dark:text-white font-medium">{post.author}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">{post.date}</p>
                    </div>
                    <Link
                        href={`/blog/${post.slug}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm flex items-center gap-1 group"
                      >
                        Read
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Categories Overview */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Browse by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from(new Set(blogArticles.map(article => article.category))).map((category) => {
              const count = blogArticles.filter(article => article.category === category).length;
              return (
                <div key={category} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">{category}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {count} {count === 1 ? 'article' : 'articles'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Back to Shopping CTA */}
        <div className="mt-12 text-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🎯 Ready to Start Shopping?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Browse curated products across 12 categories and compare current eBay listings, seller details, and purchase terms.
          </p>
          <Link 
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            Browse All Deals →
          </Link>
        </div>
      </section>

      <Footer />
      </main>
    </>
  );
}
