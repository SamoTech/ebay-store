import type { Metadata } from 'next';
import Link from 'next/link';
import { categories } from '../../lib/products';
import { absoluteUrl } from '../../lib/site';

export const metadata: Metadata = {
  title: 'All Categories | Saleh Store',
  description: 'Explore Saleh Store categories covering electronics, motors, fashion, home, collectibles, sports, business, travel and more across eBay.',
  alternates: { canonical: absoluteUrl('/categories') },
};

export default function CategoriesPage() {
  const visibleCategories = categories.filter((category) => category.slug !== 'all');

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-[#0064d2] via-[#0054ad] to-[#003f7f] text-white px-4 py-14 md:py-18">
        <div className="max-w-6xl mx-auto">
          <nav className="text-sm text-blue-100 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span>Categories</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">All Categories</h1>
          <p className="mt-4 max-w-3xl text-lg text-blue-100">
            Browse popular Saleh Store departments and broad eBay marketplace categories. Each category is a searchable landing page for products in that department.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10" aria-labelledby="category-directory-heading">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 id="category-directory-heading" className="text-2xl font-black text-gray-900 dark:text-white">Marketplace directory</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{visibleCategories.length} category landing pages available.</p>
          </div>
          <Link href="/" className="hidden sm:inline-flex text-sm font-bold text-[#0064d2] hover:underline">Back to home</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {visibleCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:-translate-y-0.5 hover:border-[#0064d2] hover:shadow-md transition-all"
            >
              <span className="text-3xl" aria-hidden="true">{category.icon}</span>
              <span className="mt-2 block font-bold text-gray-800 dark:text-gray-100 group-hover:text-[#0064d2]">
                {category.name}
              </span>
              <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                Browse products →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
