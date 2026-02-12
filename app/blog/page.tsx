export default function Blog() {
  const posts = [
    {
      id: 1,
      title: 'أفضل laptops للطلاب في 2024',
      excerpt: 'مراجعة شاملة لأفضل أجهزة الكمبيوتر المحمولة للطلاب بسعر مناسب',
      category: 'إلكترونيات',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'طريقة الربح منAffiliate Marketing',
      excerpt: 'دليل شامل للمبتدئين لكيفية البدء في التسويق بالعمولة',
      category: 'ربح من الإنترنت',
      date: '2024-01-10'
    },
    {
      id: 3,
      title: 'أفضل سماعات بلوتوث',
      excerpt: 'مقارنة بين أفضل سماعات الأذن اللاسلكية في السوق',
      category: 'إلكترونيات',
      date: '2024-01-05'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold">المدونة</h1>
          <p className="mt-2">مراجعات ونصائح</p>
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
                <a href="#" className="text-blue-600 hover:underline">اقرأ المزيد</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
