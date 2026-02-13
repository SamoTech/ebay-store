export default function Blog() {
  const posts = [
    {
      id: 1,
      title: 'Best Laptops for Students in 2024',
      excerpt: 'Complete review of the best laptops for students at affordable prices. Find the perfect laptop for your needs and budget.',
      category: 'Electronics',
      date: 'January 15, 2024',
      image: 'https://i.ebayimg.com/thumbs/images/g/laptop/s-l500.jpg'
    },
    {
      id: 2,
      title: 'How to Make Money with Affiliate Marketing',
      excerpt: 'Complete guide for beginners on how to start earning with affiliate marketing. Learn the secrets of successful affiliates.',
      category: 'Make Money',
      date: 'January 10, 2024',
      image: 'https://i.ebayimg.com/thumbs/images/g/money/s-l500.jpg'
    },
    {
      id: 3,
      title: 'Best Bluetooth Headphones 2024',
      excerpt: 'Comparison of the best wireless earbuds in the market. Find your perfect pair of headphones.',
      category: 'Electronics',
      date: 'January 5, 2024',
      image: 'https://i.ebayimg.com/thumbs/images/g/headphones/s-l500.jpg'
    },
    {
      id: 4,
      title: 'Top Gaming Consoles for Gamers',
      excerpt: 'Review of the best gaming consoles: PlayStation, Xbox, and Nintendo Switch. Which one is right for you?',
      category: 'Gaming',
      date: 'January 1, 2024',
      image: 'https://i.ebayimg.com/thumbs/images/g/gaming/s-l500.jpg'
    },
    {
      id: 5,
      title: 'Smartphone Buying Guide 2024',
      excerpt: 'Everything you need to know before buying a new smartphone. Features, specs, and best deals.',
      category: 'Electronics',
      date: 'December 28, 2023',
      image: 'https://i.ebayimg.com/thumbs/images/g/phone/s-l500.jpg'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold">Blog</h1>
          <p className="mt-2 text-blue-100">Reviews, Tips & Deals</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="grid gap-6">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="md:flex">
                <div className="md:w-48 h-48 bg-gray-200">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-blue-600 font-medium">{post.category}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <a href="#" className="text-blue-600 hover:underline font-medium">
                    Read More →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>DealsHub - Affiliate with eBay Partner Network</p>
        </div>
      </footer>
    </main>
  );
}
