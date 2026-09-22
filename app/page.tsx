'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { ProductSkeletonGrid } from '@/components/ProductSkeleton';
import Footer from '@/components/Footer';
import DealOfTheDay from '@/components/DealOfTheDay';
import TrustBadges from '@/components/TrustBadges';
import { useToast } from '@/contexts/ToastContext';
import { allProducts, categories, createSearchLink, Product } from '@/lib/products';
import { formatPrice } from '@/lib/utils/price';
import { useRecentlyViewed } from '@/contexts/RecentlyViewedContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Home() {
  const [showAllProducts, setShowAllProducts] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'name'>('name');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [catalogSource, setCatalogSource] = useState<'static' | 'ebay_live' | 'error'>('static');
  const { addToast } = useToast();
  const { recentlyViewed } = useRecentlyViewed();
  const pathname = usePathname();

  // Load catalog from eBay API on mount
  useEffect(() => {
    let isMounted = true;

    async function loadCatalog(): Promise<void> {
      console.log('🔄 Loading catalog from /api/products/discover...');
      
      try {
        // 20 second timeout for eBay API (OAuth + API call)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.warn('⏱️ Fetch timeout after 20s');
          controller.abort();
        }, 20000);

        const response = await fetch('/api/products/discover', {
          signal: controller.signal,
          cache: 'no-store',
        });
        
        clearTimeout(timeoutId);

        const data = await response.json() as { 
          source?: string; 
          products?: Product[];
          error?: string;
          details?: unknown;
        };
        
        if (!isMounted) return;

        // Handle API errors
        if (!response.ok || data.error) {
          setCatalog(allProducts);
          setCatalogSource('static');
          setApiError(null);
          setIsLoading(false);
          return;
        }

        if (!data.products?.length) {
          setCatalog(allProducts);
          setCatalogSource('static');
          setApiError(null);
          setIsLoading(false);
          return;
        }

        console.log(`✅ Loaded ${data.products.length} products from source: ${data.source}`);
        
        // Update catalog with live products
        setCatalog(data.products);
        setCatalogSource(data.source === 'ebay_live' ? 'ebay_live' : 'static');
        setApiError(null);
        
        // Show success notification for live products
        if (data.source === 'ebay_live') {
          addToast('✅ Live eBay products loaded!', 'success');
        } else if (data.source?.includes('cached')) {
          addToast('💾 Using cached eBay products', 'info');
        }
      } catch (error) {
        if (!isMounted) return;
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            setCatalog(allProducts);
            setApiError(null);
          } else {
            setCatalog(allProducts);
            setApiError(null);
          }
        }
        setCatalogSource('static');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCatalog();
    return () => { isMounted = false; };
  }, [addToast]);

  // Filter and sort products
  let filteredProducts = catalog.filter(p => 
    p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    return 0;
  });

  const isHomepage = pathname === '/';

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🛍️ DealsHub - Best Prices Online</h1>
          <p className="text-xl text-blue-100 mb-6">Discover amazing deals on electronics, gaming, sneakers and more from eBay</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="#products" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg">Browse Products</Link>
            <Link href="/blog" className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors">Shopping Guides</Link>
          </div>
          <p className="text-sm text-blue-200 mt-4">🔍 Use <Link href="/search" className="underline hover:text-white">advanced search</Link> to filter by price, condition and category</p>
        </div>
      </section>

      <TrustBadges />


      {catalogSource === 'ebay_live' && !isLoading && (<section className="max-w-6xl mx-auto px-4 pt-4"><div className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-700 px-4 py-1 text-sm font-medium dark:bg-green-900/30 dark:text-green-300">● Live eBay catalog active</div></section>)}

      {apiError && !isLoading && (<section className="max-w-6xl mx-auto px-4 pt-4"><div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4"><div className="flex items-start gap-3"><div className="text-2xl">❌</div><div className="flex-1"><p className="font-bold text-red-800 dark:text-red-200 mb-2">Failed to Load Live Products</p><p className="text-sm text-red-700 dark:text-red-300 mb-3 whitespace-pre-wrap">{apiError}</p><div className="flex flex-col sm:flex-row gap-2"><a href="/api/health" target="_blank" className="text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors inline-block text-center">Check API Health</a><a href="https://github.com/SamoTech/ebay-store/issues/16" target="_blank" rel="noopener noreferrer" className="text-sm bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors inline-block text-center">View Troubleshooting Guide</a></div></div></div></div></section>)}

      {/* Category Navigation - Now with Links */}
      <section id="products" className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {categories.map((cat) => {
            const href = cat.slug === 'all' ? '/' : `/category/${cat.slug}`;
            const isActive = (cat.slug === 'all' && isHomepage) || pathname === href;
            
            return (
              <Link 
                key={cat.id} 
                href={href}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 text-center hover:shadow-xl transition-all block ${
                  isActive ? 'ring-2 ring-blue-600 bg-blue-50 dark:bg-blue-900/30' : ''
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <p className="font-bold mt-1 text-gray-700 dark:text-gray-200 text-sm">{cat.name}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {!isLoading && !apiError && (<DealOfTheDay />)}

      {recentlyViewed.length > 0 && !isLoading && (<section className="max-w-6xl mx-auto px-4 py-8"><h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Recently Viewed</h2><div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">{recentlyViewed.slice(0, 5).map((product) => (<div key={product.id} className="flex-shrink-0 w-40"><a href={product.affiliateLink} target="_blank" rel="noopener noreferrer"><div className="relative w-full h-32 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"><Image src={product.image} alt={product.title} fill className="object-cover" sizes="160px" /></div><p className="text-sm font-medium mt-2 line-clamp-1 text-gray-700 dark:text-gray-300">{product.title}</p><p className="text-green-600 font-bold text-sm">{formatPrice(product.price, product.currency)}</p></a></div>))}</div></section>)}

      <section className="max-w-6xl mx-auto px-4 py-6"><div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"><h2 className="text-2xl font-bold text-gray-800 dark:text-white">{showAllProducts ? 'All Products' : 'Featured Products'}<span className="text-gray-500 dark:text-gray-400 text-base font-normal ml-3">({filteredProducts.length} products)</span></h2><div className="flex flex-wrap gap-3"><label htmlFor="product-sort" className="sr-only">Sort products</label><select id="product-sort" aria-label="Sort products" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'price-low' | 'price-high' | 'name')} className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="name">Sort by Name</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option></select><div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"><span className="text-sm text-gray-600 dark:text-gray-400">$</span><input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} className="w-16 text-sm bg-transparent text-gray-700 dark:text-gray-200 focus:outline-none" placeholder="Min" /><span className="text-gray-400">-</span><input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-16 text-sm bg-transparent text-gray-700 dark:text-gray-200 focus:outline-none" placeholder="Max" /></div></div></div></section>
      
      <div className="max-w-6xl mx-auto py-8 px-4">{isLoading ? (<ProductSkeletonGrid count={8} />) : (<><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{filteredProducts.slice(0, showAllProducts ? filteredProducts.length : 8).map((product) => (<ProductCard key={product.id} product={product} />))}</div>{!showAllProducts && filteredProducts.length > 8 && (<div className="text-center mt-8"><button onClick={() => setShowAllProducts(true)} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">View All {filteredProducts.length} Products →</button></div>)}{filteredProducts.length === 0 && !apiError && (<div className="text-center py-12"><p className="text-gray-500 dark:text-gray-400 text-lg">No products found</p><p className="text-gray-400 dark:text-gray-500 mt-2">Try adjusting your filters or search</p></div>)}</>)}</div>

      <section className="bg-gray-100 dark:bg-gray-800 py-12 mt-12"><div className="max-w-4xl mx-auto px-4 text-center"><h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Can&apos;t Find What You&apos;re Looking For?</h2><p className="text-gray-600 dark:text-gray-300 mb-6">Browse millions of products on eBay with our affiliate links</p><a href={createSearchLink('trending deals')} target="_blank" rel="noopener noreferrer" className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">Browse More on eBay</a></div></section>

      <section className="bg-blue-600 text-white py-12 mt-12"><div className="max-w-6xl mx-auto px-4"><div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center items-center"><div><p className="text-4xl font-bold">{catalog.length}</p><p className="text-blue-200">Products loaded</p></div><div><p className="text-4xl font-bold">{categories.length - 1}</p><p className="text-blue-200">Categories</p></div><div><Link href="#products" className="inline-block bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">Browse Deals</Link><p className="text-blue-200 text-sm mt-2">Current catalog</p></div></div></div></section>

      <Footer />
    </main>
  );
}
