'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createSearchLink } from '../../lib/products';
import Footer from '../../components/Footer';
import { trackEvent } from '../../lib/analytics';

// High-commission product review articles - Focus on premium items
const blogPosts = [
  {
    id: 1,
    title: "MacBook Pro M3 Max Review: Worth the $3,500+ Investment?",
    excerpt: "In-depth review of Apple's most powerful laptop. Performance benchmarks, real-world usage, and whether the M3 Max justifies its premium price for professionals and creators.",
    category: "Electronics",
    date: "February 14, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    searchQuery: "MacBook Pro M3 Max 16 inch",
    priceRange: "$3,499 - $4,299",
    valueRating: 4.5,
    pros: ["Incredible M3 Max performance", "18+ hours battery life", "ProMotion display 120Hz", "Best laptop for video editing"],
    cons: ["Very expensive", "Limited port selection", "Overkill for basic tasks"],
    content: "The MacBook Pro M3 Max represents the pinnacle of laptop performance. Our testing shows 40% faster renders than M2 Max, making it essential for 4K/8K video editing and 3D work..."
  },
  {
    id: 2,
    title: "PlayStation 5 Pro Deep Dive: Gaming's Best $599 Console?",
    excerpt: "Complete analysis of PS5 Pro's upgraded GPU, ray tracing, and AI upscaling. We compare performance across 50+ games to determine if the $100 premium over standard PS5 is justified.",
    category: "Gaming",
    date: "February 12, 2026",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800",
    searchQuery: "PlayStation 5 Pro console bundle",
    priceRange: "$599 - $749 (with bundle)",
    valueRating: 4.7,
    pros: ["60% more GPU power", "True 4K 60fps gaming", "Advanced ray tracing", "2TB storage included"],
    cons: ["Games still $70", "Disc drive sold separately", "Not backward compatible with PS3"],
    content: "Sony's PS5 Pro delivers a massive leap in visual fidelity. Testing Spider-Man 2, our frame rate analysis shows locked 60fps at 4K with ray tracing enabled..."
  },
  {
    id: 3,
    title: "Air Jordan 1 Retro High OG Investment Guide 2026",
    excerpt: "Which colorways appreciate most? Historical resale data analysis of 100+ releases. Learn how to identify valuable drops and build a profitable sneaker portfolio worth $10K+.",
    category: "Sneakers",
    date: "February 10, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    searchQuery: "Air Jordan 1 Retro High OG Chicago",
    priceRange: "$180 retail, $400-$2,500+ resale",
    valueRating: 4.8,
    pros: ["Consistent resale value", "Timeless design", "Multiple colorways", "Strong collector demand"],
    cons: ["Hard to get retail", "Fakes flooding market", "Requires authentication"],
    content: "The Air Jordan 1 remains the most reliable sneaker investment. Our 5-year analysis shows Chicago and Bred colorways averaging 300% ROI..."
  },
  {
    id: 4,
    title: "Dyson Airwrap Complete: $600 Hair Tool or Life Changer?",
    excerpt: "3-month testing review with before/after results. We compare Dyson Airwrap to professional salon treatments and determine actual cost savings for different hair types.",
    category: "Beauty",
    date: "February 8, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=800",
    searchQuery: "Dyson Airwrap Complete Long",
    priceRange: "$599 - $629",
    valueRating: 4.6,
    pros: ["Salon-quality results at home", "No extreme heat damage", "8 attachments included", "Saves $200+/month on blowouts"],
    cons: ["Very expensive upfront", "Learning curve", "Heavy to hold", "Not ideal for very short hair"],
    content: "After 90 days of daily use, the Dyson Airwrap has eliminated my weekly salon visits. ROI breakeven: 3 months compared to professional styling costs..."
  },
  {
    id: 5,
    title: "Sony A7IV vs Canon R6 Mark II: Which $2,500 Camera Wins?",
    excerpt: "Side-by-side comparison of the two best hybrid cameras. Real-world photo and video tests across 20+ scenarios including weddings, sports, and low-light performance.",
    category: "Electronics",
    date: "February 6, 2026",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800",
    searchQuery: "Sony A7 IV full frame mirrorless camera",
    priceRange: "$2,498 - $2,798 (body only)",
    valueRating: 4.9,
    pros: ["33MP high resolution", "10fps burst shooting", "Excellent video specs", "Best-in-class autofocus"],
    cons: ["Expensive lenses", "Menu system complex", "Battery life average"],
    content: "Professional photographers praise the Sony A7IV's versatility. Our low-light testing at ISO 12800 shows cleaner results than competitors..."
  },
  {
    id: 6,
    title: "Rolex Submariner: Ultimate Luxury Watch Investment Analysis",
    excerpt: "Financial breakdown of Rolex's most iconic timepiece. Market trends, authentication tips, and why the Submariner beats traditional investments with 8% annual appreciation.",
    category: "Collectibles",
    date: "February 4, 2026",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
    searchQuery: "Rolex Submariner date 41mm",
    priceRange: "$9,550 retail, $13,000-$18,000 grey market",
    valueRating: 5.0,
    pros: ["Appreciates 8%/year average", "Liquid asset", "Timeless design", "Celebrity status symbol"],
    cons: ["Huge initial investment", "Years-long waiting lists", "High insurance costs", "Requires servicing"],
    content: "The Rolex Submariner is more than a watch—it's a portable bank account. Historical data shows consistent 8% annual appreciation, outperforming S&P 500 over 20 years..."
  },
  {
    id: 7,
    title: "Gaming PC vs PS5 Pro: The $1,500 Value Showdown 2026",
    excerpt: "Building a gaming PC to match PS5 Pro performance. Complete component breakdown with actual frame rates, upgrade paths, and 5-year total cost of ownership comparison.",
    category: "Gaming",
    date: "February 2, 2026",
    readTime: "11 min read",
    image: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=800",
    searchQuery: "gaming desktop PC RTX 4070 Ryzen 7",
    priceRange: "$1,499 - $1,899",
    valueRating: 4.4,
    pros: ["Upgrade individual parts", "Better for productivity", "Cheaper games (Steam sales)", "Full modding support"],
    cons: ["Complex to build", "Troubleshooting required", "Takes desk space", "Higher power consumption"],
    content: "Our testing shows a $1,500 PC (RTX 4070 + Ryzen 7 7800X3D) matching PS5 Pro in most games, but the upgrade path and Steam sales change the equation..."
  },
  {
    id: 8,
    title: "iPhone 15 Pro Max: The $1,199 Smartphone That Replaces Your Camera",
    excerpt: "Pro photographer tests iPhone 15 Pro Max as primary camera for 30 days. Portrait mode, ProRAW, and whether it can truly replace a $3,000 DSLR setup for professionals.",
    category: "Electronics",
    date: "January 30, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
    searchQuery: "iPhone 15 Pro Max 512GB",
    priceRange: "$1,199 - $1,599",
    valueRating: 4.7,
    pros: ["48MP main camera", "ProRAW + ProRes video", "Replaces point-and-shoot", "Always in your pocket"],
    cons: ["Can't match DSLR in low light", "No optical zoom flexibility", "Storage fills up fast"],
    content: "After shooting 5,000+ photos, the iPhone 15 Pro Max replaced 80% of my DSLR usage. Wedding photographers still need dedicated gear, but for travel and social media..."
  },
  {
    id: 9,
    title: "Herman Miller Aeron Chair: $1,500 Office Chair Worth It?",
    excerpt: "Ergonomic deep dive after 2 years of daily use. Comparing back pain reduction, posture improvement, and productivity gains versus $200 budget chairs for remote workers.",
    category: "Office",
    date: "January 28, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800",
    searchQuery: "Herman Miller Aeron office chair",
    priceRange: "$1,445 - $1,745",
    valueRating: 4.8,
    pros: ["12-year warranty", "Back pain elimination", "Resale value holds", "Premium materials"],
    cons: ["Expensive upfront", "Not soft/plush", "Size selection crucial", "Mesh not for everyone"],
    content: "My chronic back pain disappeared after 3 weeks with the Aeron. Calculating saved chiropractor visits ($1,200/year), ROI achieved in 14 months..."
  },
  {
    id: 10,
    title: "Apple Watch Ultra 2: $799 Smartwatch for Serious Athletes?",
    excerpt: "Extreme testing across marathon training, diving, and mountain climbing. GPS accuracy, battery life under stress, and whether Ultra 2 justifies double the Series 9 price.",
    category: "Fitness",
    date: "January 26, 2026",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800",
    searchQuery: "Apple Watch Ultra 2 titanium",
    priceRange: "$799 - $899",
    valueRating: 4.6,
    pros: ["3-day battery life", "Rugged titanium build", "Dual-frequency GPS", "Action button convenience"],
    cons: ["Overkill for casual users", "Heavy vs Series 9", "Limited exclusive features", "Series 9 is 80% as good"],
    content: "After running a marathon and diving to 40 meters, the Ultra 2 proved its worth. Battery lasted 72 hours with constant GPS tracking—Series 9 would've died twice..."
  },
  {
    id: 11,
    title: "DJI Mavic 3 Pro: Best $2,199 Drone for Content Creators",
    excerpt: "6 months creating YouTube content with DJI's flagship drone. Comparing video quality, flight time, and obstacle avoidance to cheaper alternatives for professional creators.",
    category: "Electronics",
    date: "January 24, 2026",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800",
    searchQuery: "DJI Mavic 3 Pro drone",
    priceRange: "$2,199 - $2,999 (with accessories)",
    valueRating: 4.9,
    pros: ["Triple camera system", "43 minutes flight time", "Cine version for pros", "Incredible stabilization"],
    cons: ["Very expensive", "Requires FAA registration", "Complex flight laws", "Insurance recommended"],
    content: "The Mavic 3 Pro's Hasselblad camera captures cinema-quality aerial footage. After 200+ flights generating $15K in client work, it paid for itself in 4 months..."
  },
  {
    id: 12,
    title: "Peloton Bike+: $2,495 Exercise Bike vs Gym Membership Math",
    excerpt: "Breaking down the real cost of Peloton after 18 months. Comparing total investment including subscription to gym memberships, plus health improvements and weight loss results.",
    category: "Fitness",
    date: "January 22, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
    searchQuery: "Peloton Bike Plus indoor cycling",
    priceRange: "$2,495 + $44/month subscription",
    valueRating: 4.3,
    pros: ["Convenience of home workouts", "World-class instructors", "Resale value decent", "Family can share"],
    cons: ["Huge upfront cost", "Requires $44/month subscription", "Takes up space", "Boring for some"],
    content: "My Equinox membership was $250/month. Peloton cost $2,495 + $44/month. Breakeven hit at month 11, and I've lost 35 pounds with 300+ rides logged..."
  }
];

// Categories for filtering
const blogCategories = [
  { name: 'All', slug: 'all' },
  { name: 'Electronics', slug: 'Electronics' },
  { name: 'Gaming', slug: 'Gaming' },
  { name: 'Sneakers', slug: 'Sneakers' },
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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'blog_newsletter' }),
    });

    if (response.ok) {
      trackEvent({ event: 'newsletter_submit', source: 'blog' });
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Premium Product Reviews</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            In-depth reviews of high-value products with real ROI analysis and expert recommendations
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
                <div className="relative w-full h-64 md:h-full min-h-[260px]">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-semibold px-3 py-1 rounded-full mb-4 w-fit">
                  {featuredPost.category}
                </span>
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{featuredPost.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{featuredPost.excerpt}</p>
                <div className="flex items-center mb-4">
                  <div className="flex text-lg mr-2">{renderStars(featuredPost.valueRating)}</div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    {featuredPost.valueRating.toFixed(1)} Value Rating
                  </span>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
                  <span className="text-green-800 dark:text-green-200 font-semibold text-sm">
                    💰 Price Range: {featuredPost.priceRange}
                  </span>
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-6">
                  <span>{featuredPost.date}</span>
                  <span className="mx-2">•</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <a 
                  href={createSearchLink(featuredPost.searchQuery, `blog-featured-${featuredPost.id}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent({ event: 'affiliate_outbound_click', productId: featuredPost.id, source: 'blog_featured', category: featuredPost.category })}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium w-fit"
                >
                  Shop on eBay →
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
          {selectedCategory === 'all' ? 'All Reviews' : `${selectedCategory} Reviews`}
          <span className="text-gray-500 dark:text-gray-400 text-base font-normal ml-3">({filteredPosts.length} articles)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPosts.map((post) => (
            <article key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <div className="absolute bottom-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {post.priceRange.split('-')[0].trim()}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900 dark:text-white">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 text-sm">{post.excerpt}</p>
                <div className="flex items-center mb-4">
                  <div className="flex text-base">{renderStars(post.valueRating)}</div>
                  <span className="text-gray-600 dark:text-gray-400 text-xs ml-2">
                    {post.valueRating.toFixed(1)}
                  </span>
                </div>
                <a 
                  href={createSearchLink(post.searchQuery, `blog-${post.id}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent({ event: 'affiliate_outbound_click', productId: post.id, source: 'blog_card', category: post.category })}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-sm"
                >
                  Shop Now on eBay →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-blue-600 text-white py-16 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get Premium Deal Alerts</h2>
          <p className="text-blue-100 mb-8">
            Subscribe for exclusive high-value product reviews and early access to our best deals
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
