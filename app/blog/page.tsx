import Link from 'next/link';
import { Metadata } from 'next';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: 'Blog - Shopping Tips & Product Reviews',
  description: 'Expert shopping guides, honest product reviews, and money-saving strategies for finding the best deals on eBay. From electronics to sneakers, learn how to shop smarter.',
};

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'The Ultimate Guide to Finding Hidden Gems on eBay in 2026',
      excerpt: 'Discover pro strategies for uncovering underpriced items, using advanced search filters, and timing your purchases perfectly. Learn from experienced resellers who make thousands monthly.',
      date: 'February 15, 2026',
      category: 'Shopping Strategies',
      readTime: '12 min read',
      author: 'Sarah Chen',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 2,
      title: 'Electronics Buying Guide: Best Tech Deals Worth Your Money',
      excerpt: 'In-depth reviews of laptops, tablets, smartphones, and accessories. Which brands offer the best value? What specs really matter? Real performance tests and price comparisons included.',
      date: 'February 14, 2026',
      category: 'Product Reviews',
      readTime: '15 min read',
      author: 'Michael Rodriguez',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 3,
      title: 'How to Spot Counterfeit Products: A Security Expert\'s Checklist',
      excerpt: 'Protect yourself from fakes with professional authentication techniques. Learn to verify Nike sneakers, Apple products, designer items, and more. Red flags that sellers hope you\'ll miss.',
      date: 'February 12, 2026',
      category: 'Buyer Protection',
      readTime: '10 min read',
      author: 'James Park',
      gradient: 'from-red-500 to-orange-600'
    },
    {
      id: 4,
      title: 'Gaming Console Deals: PS5, Xbox Series X, and Nintendo Switch Compared',
      excerpt: 'Which console offers the best value in 2026? We analyze game libraries, exclusive titles, performance specs, and total cost of ownership. Plus: when to buy for maximum savings.',
      date: 'February 10, 2026',
      category: 'Gaming Reviews',
      readTime: '18 min read',
      author: 'Emily Watson',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      id: 5,
      title: 'Sneaker Investment Guide: Which Air Jordans Actually Appreciate in Value?',
      excerpt: 'Data-driven analysis of sneaker resale markets. Historical price trends, authentication tips, and storage best practices. Why some pairs 10x in value while others tank.',
      date: 'February 8, 2026',
      category: 'Investment Guide',
      readTime: '14 min read',
      author: 'Marcus Johnson',
      gradient: 'from-yellow-500 to-red-600'
    },
    {
      id: 6,
      title: 'Smart Home on a Budget: Best Affordable Devices That Actually Work',
      excerpt: 'Tested reviews of budget smart plugs, lights, cameras, and voice assistants. Which cheap alternatives match expensive brands? Complete setup guides and compatibility charts included.',
      date: 'February 6, 2026',
      category: 'Smart Home',
      readTime: '11 min read',
      author: 'Lisa Thompson',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      id: 7,
      title: 'Negotiation Tactics: How to Get Sellers to Accept Lower Offers',
      excerpt: 'Psychology-based negotiation strategies that work on eBay. When to make offers, how much to lowball, what messages get responses. Real examples with 60%+ success rates.',
      date: 'February 4, 2026',
      category: 'Shopping Tips',
      readTime: '9 min read',
      author: 'David Kim',
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      id: 8,
      title: 'Beauty Products Online: Authentic vs Fake - What I Learned Spending $5000',
      excerpt: 'A beauty blogger\'s investigation into counterfeit cosmetics. Lab tests, ingredient analysis, and seller red flags. How to buy luxury beauty safely and avoid dangerous fakes.',
      date: 'February 2, 2026',
      category: 'Beauty & Safety',
      readTime: '13 min read',
      author: 'Sophia Martinez',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      id: 9,
      title: 'Collectibles Market Report: What\'s Hot, What\'s Not in 2026',
      excerpt: 'Monthly analysis of trending collectibles. Funko Pops, trading cards, vintage toys, and memorabilia. Price predictions based on market data and collector demand patterns.',
      date: 'January 30, 2026',
      category: 'Market Analysis',
      readTime: '16 min read',
      author: 'Robert Chang',
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      id: 10,
      title: 'eBay Seller Red Flags: 20 Warning Signs You Should Never Ignore',
      excerpt: 'Protect your money with this fraud prevention guide. Learn to spot scammers, fake reviews, stolen images, and suspicious behavior. What to do if you\'ve been scammed.',
      date: 'January 28, 2026',
      category: 'Safety Guide',
      readTime: '8 min read',
      author: 'Jennifer Lee',
      gradient: 'from-red-500 to-pink-600'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            DealsHub Blog
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
          {blogPosts.map(post => (
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
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm flex items-center gap-1 group">
                    Read
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Categories Overview */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Browse by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
              <div className="text-2xl mb-2">🛍️</div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">Shopping Tips</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">3 articles</div>
            </button>
            <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
              <div className="text-2xl mb-2">⭐</div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">Product Reviews</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">4 articles</div>
            </button>
            <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
              <div className="text-2xl mb-2">🛡️</div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">Buyer Protection</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">2 articles</div>
            </button>
            <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">Market Analysis</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">1 article</div>
            </button>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 md:p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            📬 Never Miss a Deal
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get weekly shopping guides, exclusive deals, and insider tips delivered to your inbox. Join 10,000+ smart shoppers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Subscribe Free
            </button>
          </div>
          <p className="text-xs text-blue-200 mt-3">No spam. Unsubscribe anytime.</p>
        </div>

        {/* Back to Shopping CTA */}
        <div className="mt-12 text-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🎯 Ready to Start Shopping?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Browse 70+ curated products across 12 categories. All verified sellers. Best prices guaranteed.
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
  );
}
