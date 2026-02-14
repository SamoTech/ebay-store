import Link from 'next/link';

// Blog posts data - 10 comprehensive articles
const blogPosts = [
  {
    id: 1,
    title: "Top 10 Electronics Trends for 2025",
    excerpt: "Discover the hottest electronics trends for 2025, from AI-powered devices to sustainable tech. Find out which gadgets are worth your investment.",
    category: "Electronics",
    date: "January 15, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=800",
    slug: "top-electronics-trends-2025"
  },
  {
    id: 2,
    title: "How to Start Affiliate Marketing in 2025",
    excerpt: "A complete beginner's guide to affiliate marketing. Learn how to earn passive income by promoting products you love.",
    category: "Make Money",
    date: "January 12, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    slug: "start-affiliate-marketing-2025"
  },
  {
    id: 3,
    title: "Best Sneakers to Invest In: 2025 Guide",
    excerpt: "Sneaker resale is big business. Learn which kicks are worth investing in this year and how to spot valuable releases.",
    category: "Sneakers",
    date: "January 10, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800",
    slug: "best-sneakers-invest-2025"
  },
  {
    id: 4,
    title: "Smart Home Setup: Beginner to Pro",
    excerpt: "Transform your home with smart devices. From basic setups to advanced automation, here's everything you need to know.",
    category: "Smart Home",
    date: "January 8, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    slug: "smart-home-setup-guide"
  },
  {
    id: 5,
    title: "Gaming Consoles Comparison: PS5 vs Xbox vs Switch",
    excerpt: "Which gaming console is right for you? We compare PlayStation 5, Xbox Series X, and Nintendo Switch in detail.",
    category: "Gaming",
    date: "January 5, 2025",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800",
    slug: "gaming-consoles-comparison-2025"
  },
  {
    id: 6,
    title: "Beauty Tech: Must-Have Gadgets",
    excerpt: "From Dyson Airwrap to LED masks, discover the beauty tech gadgets that are actually worth the hype.",
    category: "Beauty",
    date: "January 3, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800",
    slug: "beauty-tech-must-haves"
  },
  {
    id: 7,
    title: "Collectibles Investment Guide 2025",
    excerpt: "Pokemon cards, Funko Pops, vintage jerseys - learn which collectibles are trending and how to start your collection.",
    category: "Collectibles",
    date: "December 28, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800",
    slug: "collectibles-investment-guide"
  },
  {
    id: 8,
    title: "How to Score the Best Deals on eBay",
    excerpt: "Master the art of eBay shopping. Tips and tricks to find the best deals, avoid scams, and win auctions.",
    category: "Shopping Tips",
    date: "December 25, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800",
    slug: "ebay-shopping-tips"
  },
  {
    id: 9,
    title: "Fitness Tech: Best Wearables for 2025",
    excerpt: "Apple Watch, Garmin, Fitbit - which fitness tracker is best for your goals? Complete comparison and reviews.",
    category: "Fitness",
    date: "December 22, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
    slug: "fitness-wearables-2025"
  },
  {
    id: 10,
    title: "Home Office Essentials: Work From Home Setup",
    excerpt: "Create the perfect home office with these essential gadgets and furniture. Boost productivity and comfort.",
    category: "Office",
    date: "December 20, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800",
    slug: "home-office-essentials"
  }
];

// Categories for filtering
const blogCategories = [
  { name: 'All', slug: 'all' },
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Gaming', slug: 'gaming' },
  { name: 'Shopping Tips', slug: 'shopping-tips' },
  { name: 'Make Money', slug: 'make-money' },
  { name: 'Sneakers', slug: 'sneakers' },
  { name: 'Smart Home', slug: 'smart-home' },
  { name: 'Beauty', slug: 'beauty' },
  { name: 'Collectibles', slug: 'collectibles' },
  { name: 'Fitness', slug: 'fitness' },
  { name: 'Office', slug: 'office' }
];

export default function Blog() {
  const featuredPost = blogPosts[0];
  const allPosts = blogPosts.slice(1);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">DealsHub Blog</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Shopping guides, product reviews, and tips to help you find the best deals
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <span className="inline-block bg-blue-100 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full mb-4 w-fit">
                {featuredPost.category}
              </span>
              <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
              <p className="text-gray-600 mb-4">{featuredPost.excerpt}</p>
              <div className="flex items-center text-gray-500 text-sm mb-6">
                <span>{featuredPost.date}</span>
                <span className="mx-2">•</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <Link 
                href={`/blog/${featuredPost.slug}`}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium w-fit"
              >
                Read Article →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {blogCategories.map((cat) => (
            <button
              key={cat.slug}
              className="bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-700 hover:text-blue-600 font-medium"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Recent Posts Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {post.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Read More →
                </Link>
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
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-medium whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            DealsHub is a participant in the eBay Partner Network, an affiliate advertising program.
          </p>
          <p className="mt-2 text-gray-500 text-sm">
            © 2024 DealsHub. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
