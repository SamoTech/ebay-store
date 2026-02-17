'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton, { ProductSkeletonGrid } from '@/components/ProductSkeleton';
import Footer from '@/components/Footer';
import DealOfTheDay from '@/components/DealOfTheDay';
import TrustBadges from '@/components/TrustBadges';
import { useToast } from '@/contexts/ToastContext';
import { allProducts, categories, createSearchLink, Product } from '@/lib/products';
import { useRecentlyViewed } from '@/contexts/RecentlyViewedContext';
import Link from 'next/link';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllProducts, setShowAllProducts] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'name'>('name');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [catalog, setCatalog] = useState<Product[]>(allProducts);
  const [catalogSource, setCatalogSource] = useState<'static' | 'ebay_live'>('static');
  const { addToast } = useToast();
  const { recentlyViewed } = useRecentlyViewed();

  // Load catalog from eBay API on mount
  useEffect(() => {
    let isMounted = true;

    async function loadCatalog(): Promise<void> {
      console.log('🔄 Loading catalog from /api/products/discover...');
      
      try {
        // 15 second timeout for eBay API (OAuth + API call)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.warn('⏱️ Fetch timeout after 15s');
          controller.abort();
        }, 15000);

        const response = await fetch('/api/products/discover', {
          signal: controller.signal,
          cache: 'no-store',
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          console.error('❌ API returned error:', response.status, response.statusText);
          // Use static fallback
          if (isMounted) {
            setIsLoading(false);
          }
          return;
        }

        const data = await response.json() as { source?: string; products?: Product[] };
        
        if (!isMounted) return;

        if (!data.products?.length) {
          console.warn('⚠️ API returned 0 products, using static fallback');
          setIsLoading(false);
          return;
        }

        console.log(`✅ Loaded ${data.products.length} products from source: ${data.source}`);
        
        // Update catalog with live products
        setCatalog(data.products);
        setCatalogSource(data.source === 'ebay_live' ? 'ebay_live' : 'static');
        
        // Show success notification for live products
        if (data.source === 'ebay_live') {
          addToast('✅ Live eBay products loaded!', 'success');
        }
      } catch (error) {
        if (!isMounted) return;
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.error('❌ Fetch aborted (timeout)');
            addToast('⏱️ eBay API timeout, using cached products', 'info');
          } else {
            console.error('❌ Fetch error:', error.message);
          }
        }
        // Keep static fallback on error
      } finally {
        // Always hide loading after API completes (success or fail)
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCatalog();
    return () => { isMounted = false; };
  }, [addToast]);

  const selectedCategoryName = categories.find(c => c.slug === selectedCategory)?.name;
  let filteredProducts = selectedCategory === 'all' 
    ? catalog 
    : catalog.filter(p => p.category === selectedCategoryName);

  filteredProducts = filteredProducts.filter(p => 
    p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    return 0;
  });

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    setSearchQuery('');
    setShowAllProducts(false);
  };

  const searchResultsLink = searchQuery ? createSearchLink(searchQuery) : null;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🛍️ DealsHub - Best Prices Online</h1>
          <p className="text-xl text-blue-100 mb-6">Discover amazing deals on electronics, gaming, sneakers and more from eBay</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="#products" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg">Browse Products</Link>
            <Link href="/blog" className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors">Shopping Guides</Link>
          </div>
          <p className="text-sm text-blue-200 mt-4">🔍 Use the search bar above to find specific products</p>
        </div>
      </section>

      <TrustBadges />

      {searchQuery && (<section className="max-w-6xl mx-auto px-4 py-6"><div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4"><div><p className="font-bold text-yellow-800 dark:text-yellow-200">Search results for: "{searchQuery}"</p><p className="text-sm text-yellow-700 dark:text-yellow-300">Showing all products from eBay matching your search</p></div>{searchResultsLink && (<a href={searchResultsLink} target="_blank" rel="noopener noreferrer" className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium whitespace-nowrap">View on eBay →</a>)}</div></section>)}

      {catalogSource === 'ebay_live' && !isLoading && (<section className="max-w-6xl mx-auto px-4 pt-4"><div className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-700 px-4 py-1 text-sm font-medium dark:bg-green-900/30 dark:text-green-300">● Live eBay catalog active</div></section>)}

      <section id="products" className="max-w-6xl mx-auto px-4 py-8"><div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">{categories.map((cat) => (<button key={cat.id} onClick={() => handleCategoryClick(cat.slug)} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 text-center hover:shadow-xl transition-all ${selectedCategory === cat.slug ? 'ring-2 ring-blue-600 bg-blue-50 dark:bg-blue-900/30' : ''}`}><span className="text-2xl">{cat.icon}</span><p className="font-bold mt-1 text-gray-700 dark:text-gray-200 text-sm">{cat.name}</p></button>))}</div></section>

      {!searchQuery && selectedCategory === 'all' && !isLoading && (<DealOfTheDay />)}

      {recentlyViewed.length > 0 && !searchQuery && selectedCategory === 'all' && !isLoading && (<section className="max-w-6xl mx-auto px-4 py-8"><h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Recently Viewed</h2><div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">{recentlyViewed.slice(0, 5).map((product) => (<div key={product.id} className="flex-shrink-0 w-40"><a href={product.affiliateLink} target="_blank" rel="noopener noreferrer"><div className="relative w-full h-32 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"><Image src={product.image} alt={product.title} fill className="object-cover" sizes="160px" /></div><p className="text-sm font-medium mt-2 line-clamp-1 text-gray-700 dark:text-gray-300">{product.title}</p><p className="text-green-600 font-bold text-sm">${product.price}</p></a></div>))}</div></section>)}

      <section className="max-w-6xl mx-auto px-4 py-6"><div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"><h2 className="text-2xl font-bold text-gray-800 dark:text-white">{searchQuery ? `Search: "${searchQuery}"` : selectedCategory === 'all' ? showAllProducts ? 'All Products' : 'Featured Products' : categories.find(c => c.slug === selectedCategory)?.name}<span className="text-gray-500 dark:text-gray-400 text-base font-normal ml-3">({filteredProducts.length} products)</span></h2><div className="flex flex-wrap gap-3"><select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="name">Sort by Name</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option></select><div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"><span className="text-sm text-gray-600 dark:text-gray-400">$</span><input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} className="w-16 text-sm bg-transparent text-gray-700 dark:text-gray-200 focus:outline-none" placeholder="Min" /><span className="text-gray-400">-</span><input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-16 text-sm bg-transparent text-gray-700 dark:text-gray-200 focus:outline-none" placeholder="Max" /></div></div></div></section>
      
      <div className="max-w-6xl mx-auto py-8 px-4">{isLoading ? (<ProductSkeletonGrid count={8} />) : (<><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{filteredProducts.slice(0, showAllProducts || searchQuery ? filteredProducts.length : 8).map((product) => (<ProductCard key={product.id} product={product} />))}</div>{!showAllProducts && !searchQuery && filteredProducts.length > 8 && (<div className="text-center mt-8"><button onClick={() => setShowAllProducts(true)} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">View All {filteredProducts.length} Products →</button></div>)}{filteredProducts.length === 0 && (<div className="text-center py-12"><p className="text-gray-500 dark:text-gray-400 text-lg">No products found</p><p className="text-gray-400 dark:text-gray-500 mt-2">Try adjusting your filters or search</p></div>)}</>)}</div>

      <section className="bg-gray-100 dark:bg-gray-800 py-12 mt-12"><div className="max-w-4xl mx-auto px-4 text-center"><h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Can't Find What You're Looking For?</h2><p className="text-gray-600 dark:text-gray-300 mb-6">Browse millions of products on eBay with our affiliate links</p><a href={createSearchLink(searchQuery || '')} target="_blank" rel="noopener noreferrer" className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">Browse More on eBay</a></div></section>

      <section className="bg-blue-600 text-white py-12 mt-12"><div className="max-w-6xl mx-auto px-4"><div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"><div><p className="text-4xl font-bold">{catalog.length}+</p><p className="text-blue-200">Products</p></div><div><p className="text-4xl font-bold">{categories.length - 1}</p><p className="text-blue-200">Categories</p></div><div><p className="text-4xl font-bold">$74B+</p><p className="text-blue-200">eBay Sales</p></div><div><p className="text-4xl font-bold">132M+</p><p className="text-blue-200">Active Buyers</p></div></div></div></section>

      <Footer />
    </main>
  );
}
