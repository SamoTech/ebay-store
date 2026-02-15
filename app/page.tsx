import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import NewsletterPopup from "../components/NewsletterPopup";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Find the Best Deals on eBay 🛍️
          </h1>
          <p className="text-xl mb-8 text-white/90">
            62+ hand-picked products with exclusive discounts
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ProductGrid />
      </div>

      <Footer />
      
      {/* Newsletter popup - shows after 30 seconds or on exit intent */}
      <NewsletterPopup delay={30000} />
    </main>
  );
}
