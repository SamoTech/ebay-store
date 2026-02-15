'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../../../components/Footer';
import { blogArticles } from '../../../lib/blog-data';

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = blogArticles.find(a => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-blue-600">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">{article.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
              {article.category}
            </span>
            <span>•</span>
            <span>{article.readTime}</span>
            <span>•</span>
            <span>{article.date}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {article.author.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{article.author}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Expert Contributor</p>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className={`h-96 rounded-2xl bg-gradient-to-br ${article.gradient} mb-10 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-lg font-semibold opacity-90">{article.excerpt}</p>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {article.content.map((section, index) => (
            <div key={index} className="mb-8">
              {section.type === 'heading' && (
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6">
                  {section.text}
                </h2>
              )}
              {section.type === 'paragraph' && (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-lg">
                  {section.text}
                </p>
              )}
              {section.type === 'list' && (
                <ul className="space-y-3 mb-6">
                  {section.items?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.type === 'quote' && (
                <blockquote className="border-l-4 border-blue-600 pl-6 py-4 my-8 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
                  <p className="text-xl italic text-gray-800 dark:text-gray-200">{section.text}</p>
                </blockquote>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Shopping?</h3>
          <p className="text-blue-100 mb-6">Browse our curated collection of verified deals</p>
          <Link 
            href="/"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Browse All Deals →
          </Link>
        </div>

        {/* Author Bio */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
              {article.author.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">About {article.author}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {article.authorBio}
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="bg-white dark:bg-gray-800 py-16 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogArticles
              .filter(a => a.category === article.category && a.id !== article.id)
              .slice(0, 3)
              .map(related => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className={`h-40 bg-gradient-to-br ${related.gradient}`}></div>
                  <div className="p-4">
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">{related.category}</p>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{related.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{related.readTime}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
