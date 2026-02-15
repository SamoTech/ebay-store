import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import Categories from "../components/Categories";
import Footer from "../components/Footer";
import NewsletterPopup from "../components/NewsletterPopup";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Footer />
      
      {/* Newsletter popup - shows after 30 seconds or on exit intent */}
      <NewsletterPopup delay={30000} />
    </main>
  );
}
