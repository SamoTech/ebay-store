export default function Blog() {
  const posts = [
    {
      id: 1,
      title: 'Best Laptops for Students in 2024',
      excerpt: 'Complete review of the best laptops for students at affordable prices',
      category: 'Electronics',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'How to Make Money with Affiliate Marketing',
      excerpt: 'Complete guide for beginners on how to start earning with affiliate marketing',
      category: 'Make Money Online',
      date: '2024-01-10'
    },
    {
      id: 3,
      title: 'Best Bluetooth Headphones',
      excerpt: 'Comparison of the best wireless earbuds in the market',
      category: 'Electronics',
      date: '2024-01-05'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="mt-2">Reviews and Tips</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <span className="text-sm text-blue-600 font-medium">{post.category}</span>
              <h2 className="text-xl font-bold mt-2">{post.title}</h2>
              <p className="text-gray-600 mt-2">{post.excerpt}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-400">{post.date}</span>
                <a href="#" className="text-blue-600 hover:underline">Read More</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
