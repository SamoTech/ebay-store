'use client';

import { useState } from 'react';
import { createSearchLink } from '../../lib/products';
import Footer from '../../components/Footer';

// Blog posts data - 10 comprehensive articles with working images
const blogPosts = [
  {
    id: 1,
    title: "Top 10 Electronics Trends for 2025",
    excerpt: "Discover the hottest electronics trends for 2025, from AI-powered devices to sustainable tech. Find out which gadgets are worth your investment.",
    category: "Electronics",
    date: "February 10, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
    searchQuery: "electronics trends 2025 gadgets",
    content: "The electronics industry is evolving rapidly with AI integration, sustainable materials, and innovative designs leading the way..."
  },
  {
    id: 2,
    title: "How to Start Affiliate Marketing in 2025",
    excerpt: "A complete beginner's guide to affiliate marketing. Learn how to earn passive income by promoting products you love.",
    category: "Make Money",
    date: "February 8, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    searchQuery: "affiliate marketing beginner guide",
    content: "Affiliate marketing is one of the best ways to earn passive income online. Here's your complete roadmap to success..."
  },
  {
    id: 3,
    title: "Best Sneakers to Invest In: 2025 Guide",
    excerpt: "Sneaker resale is big business. Learn which kicks are worth investing in this year and how to spot valuable releases.",
    category: "Sneakers",
    date: "February 5, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    searchQuery: "sneakers investment Air Jordan Nike",
    content: "The sneaker resale market continues to grow. Here are the top releases to watch and how to build your collection..."
  },
  {
    id: 4,
    title: "Smart Home Setup: Beginner to Pro",
    excerpt: "Transform your home with smart devices. From basic setups to advanced automation, here's everything you need to know.",
    category: "Smart Home",
    date: "February 3, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800",
    searchQuery: "smart home devices Amazon Echo Apple HomePod",
    content: "Creating a smart home has never been easier. Start with these essential devices and build your perfect setup..."
  },
  {
    id: 5,
    title: "Gaming Consoles Comparison: PS5 vs Xbox vs Switch",
    excerpt: "Which gaming console is right for you? We compare PlayStation 5, Xbox Series X, and Nintendo Switch in detail.",
    category: "Gaming",
    date: "February 1, 2025",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800",
    searchQuery: "PlayStation 5 Xbox Series X Nintendo Switch comparison",
    content: "Choosing the right gaming console depends on your preferences. Here's the ultimate comparison to help you decide..."
  },
  {
    id: 6,
    title: "Beauty Tech: Must-Have Gadgets",
    excerpt: "From Dyson Airwrap to LED masks, discover the beauty tech gadgets that are actually worth the hype.",
    category: "Beauty",
    date: "January 28, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800",
    searchQuery: "beauty tech gadgets Dyson Airwrap Foreo",
    content: "Beauty tech is revolutionizing skincare and haircare. These gadgets deliver professional results at home..."
  },
  {
    id: 7,
    title: "Collectibles Investment Guide 2025",
    excerpt: "Pokemon cards, Funko Pops, vintage jerseys - learn which collectibles are trending and how to start your collection.",
    category: "Collectibles",
    date: "January 25, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800",
    searchQuery: "collectibles investment Pokemon cards Funko Pop",
    content: "Collectibles are becoming serious investments. Learn how to identify valuable items and build a profitable collection..."
  },
  {
    id: 8,
    title: "How to Score the Best Deals on eBay",
    excerpt: "Master the art of eBay shopping. Tips and tricks to find the best deals, avoid scams, and win auctions.",
    category: "Shopping Tips",
    date: "January 22, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800",
    searchQuery: "eBay shopping tips deals auctions",
    content: "eBay is a treasure trove of deals when you know how to shop. Here are pro tips to save money and shop safely..."
  },
  {
    id: 9,
    title: "Fitness Tech: Best Wearables for 2025",
    excerpt: "Apple Watch, Garmin, Fitbit - which fitness tracker is best for your goals? Complete comparison and reviews.",
    category: "Fitness",
    date: "January 20, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
    searchQuery: "fitness tracker Apple Watch Garmin comparison",
    content: "Finding the right fitness tracker can transform your health journey. We compare the top options for every budget..."
  },
  {
    id: 10,
    title: "Home Office Essentials: Work From Home Setup",
    excerpt: "Create the perfect home office with these essential gadgets and furniture. Boost productivity and comfort.",
    category: "Office",
    date: "January 18, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800",
    searchQuery: "home office setup standing desk ergonomic chair",
    content: "A well-designed home office boosts productivity and health. Here's everything you need for the perfect workspace..."
  }
];

// Categories for filtering
const blogCategories = [
  { name: 'All', slug: 'all' },
  { name: 'Electronics', slug: 'Electronics' },
  { name: 'Gaming', slug: 'Gaming' },
  { name: 'Shopping Tips', slug: 'Shopping Tips' },
  { name: 'Make Money', slug: 'Make Money' },
  { name: 'Sneakers', slug: 'Sneakers' },
  { name: 'Smart Home', slug: 'Smart Home' },
  { name: 'Beauty', slug: 'Beauty' },
  { name: 'Collectibles', slug: 'Collectibles' },
  { name: 'Fitness', slug: 'Fitness' },
  { name: 'Office', slug: 'Office' }
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = filteredPosts[0];
  const allPosts = filteredPosts.slice(1);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">DealsHub Blog</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Shopping guides, product reviews, and tips to help you find the best deals
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {blogCategories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full shadow-sm transition-all font-medium ${
                selectedCategory === cat.slug
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/800x600?text=Article+Image';
                  }}
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-semibold px-3 py-1 rounded-full mb-4 w-fit">
                  {featuredPost.category}
                </span>
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{featuredPost.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{featuredPost.excerpt}</p>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-6">
                  <span>{featuredPost.date}</span>
                  <span className="mx-2">•</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <a 
                  href={createSearchLink(featuredPost.searchQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium w-fit"
                >
                  Read Article on eBay →
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
          {selectedCategory === 'all' ? 'Latest Articles' : `${selectedCategory} Articles`}
          <span className="text-gray-500 dark:text-gray-400 text-base font-normal ml-3">({filteredPosts.length} articles)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPosts.map((post) => (
            <article key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x300?text=Article+Image';
                  }}
                />
                <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {post.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900 dark:text-white">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                <a 
                  href={createSearchLink(post.searchQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  Read More on eBay →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-blue-600 text-white py-16 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-8">
            Subscribe to our newsletter for the latest deals, shopping tips, and exclusive offers
          </p>
          {subscribed ? (
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg inline-block">
              ✓ Thanks for subscribing! Check your email.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button 
                type="submit"
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-medium whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
