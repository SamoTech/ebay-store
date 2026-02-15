import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { allProducts } from '../../../lib/products';
import { trackEvent } from '../../../lib/analytics';
import Footer from '../../../components/Footer';
import RelatedProducts from '../../../components/RelatedProducts';
import SocialShare from '../../../components/SocialShare';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return allProducts
    .filter(p => p.id < 1000) // Only static products
    .map((product) => ({
      id: product.id.toString(),
    }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = allProducts.find(p => p.id === parseInt(params.id));
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.title} - $${product.price}`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image],
      // Note: 'product' type not supported by Next.js OpenGraph
      // Using default 'website' type
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = allProducts.find(p => p.id === parseInt(params.id));

  if (!product) {
    notFound();
  }

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  const productUrl = `https://ebay-store.vercel.app/product/${product.id}`;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
          <span>/</span>
          <Link href={`/category/${product.category.toLowerCase()}`} className="hover:text-blue-600 dark:hover:text-blue-400">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="relative aspect-square bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-lg px-4 py-2 rounded-full font-bold shadow-lg">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Share */}
            <div className="mt-6">
              <SocialShare
                url={productUrl}
                title={`Check out this deal: ${product.title}`}
                description={`${product.title} - Only $${product.price}`}
                hashtags={['DealsHub', 'eBayDeals', product.category.replace(/\s+/g, '')]}
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full mb-4">
              {product.category}
            </span>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-2xl text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {product.rating && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating!)
                          ? 'text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  {product.rating} / 5
                </span>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-3">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex gap-4">
              <a
                href={product.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white text-center py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Buy Now on eBay 🛒
              </a>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Affiliate Disclosure:</strong> We earn a commission from eBay when you purchase through our links. This helps us keep DealsHub free and find you the best deals!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts currentProduct={product} maxItems={4} />
      </div>

      <Footer />
    </main>
  );
}
