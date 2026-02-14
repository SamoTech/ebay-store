import Link from 'next/link';
import { Metadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: 'Blog - Shopping Tips & Product Reviews',
  description: 'Read our latest articles about shopping deals, product reviews, and money-saving tips.',
};

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: '10 Tips for Finding the Best Deals on eBay',
      excerpt: 'Learn how to save money with our expert shopping strategies and deal-finding techniques.',
      date: 'February 14, 2026',
      category: 'Shopping Tips',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Best Electronics to Buy in 2026',
      excerpt: 'Our comprehensive guide to the top tech products worth your money this year.',
      date: 'February 10, 2026',
      category: 'Product Reviews',
      readTime: '8 min read'
    },
    {
      id: 3,
      title: 'How to Spot Fake Products Online',
      excerpt: 'Protect yourself from counterfeit items with our verification checklist.',
      date: 'February 5, 2026',
      category: 'Buyer Guides',
      readTime: '6 min read'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            DealsHub Blog
          </h1>
          <p className="text-xl text-blue-100">
            Shopping tips, product reviews, and money-saving advice
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <article 
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600"></div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded">
                    {post.category}
                  </span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {post.date}
                  </span>
                  <button className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    Read More →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-12 text-center bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            📝 More Articles Coming Soon!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We're working on bringing you more helpful shopping guides and product reviews.
          </p>
          <Link 
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse Deals
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
