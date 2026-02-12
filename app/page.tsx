import ProductCard from '../components/ProductCard';
import { sampleProducts } from '../lib/products';
import { categories } from '../lib/categories';

export default function Home() {
  const products = sampleProducts;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-blue-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold">متجر العروض والتخفيضات</h1>
          <p className="mt-4 text-xl">أفضل المنتجات من eBay بأسعار مخفضة</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <a 
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition"
            >
              <span className="text-3xl">{cat.icon}</span>
              <p className="font-bold mt-2">{cat.name}</p>
            </a>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">أحدث المنتجات</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>

      <section className="bg-gray-100 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">ابدأ الربح معنا</h2>
          <p className="text-gray-600 mb-6">
            انضم إلى برنامج affiliate معنا وابدأ بكسب العمولات
          </p>
          <a 
            href="#" 
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            سجل الآن
          </a>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>متجر العروض -Affiliate مع eBay Partner Network</p>
        </div>
      </footer>
    </main>
  );
}
