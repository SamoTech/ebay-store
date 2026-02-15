import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogArticles, BlogArticle } from '../../../lib/blog-data';
import SocialShare from '../../../components/SocialShare';
import Footer from '../../../components/Footer';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Helper function to get blog post by slug
function getBlogPost(slug: string): BlogArticle | undefined {
  return blogArticles.find((post) => post.slug === slug);
}

export async function generateStaticParams() {
  return blogArticles.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: [post.category],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const postUrl = `https://ebay-store.vercel.app/blog/${post.slug}`;
  const relatedPosts = blogArticles
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  // Convert content array to HTML string
  const contentHtml = post.content.map((block) => {
    switch (block.type) {
      case 'heading':
        return `<h2 class="text-2xl font-bold mt-8 mb-4">${block.text}</h2>`;
      case 'paragraph':
        return `<p class="mb-4">${block.text}</p>`;
      case 'list':
        return `<ul class="list-disc pl-6 mb-4 space-y-2">${block.items?.map(item => `<li>${item}</li>`).join('')}</ul>`;
      case 'quote':
        return `<blockquote class="border-l-4 border-blue-500 pl-4 italic my-6 text-lg">${block.text}</blockquote>`;
      default:
        return '';
    }
  }).join('');

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>

          <div className="mb-4">
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Social Share - Top */}
        <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
          <SocialShare
            url={postUrl}
            title={post.title}
            description={post.excerpt}
            hashtags={['DealsHub', 'eBayShopping', post.category.replace(/\s+/g, '')]}
          />
        </div>

        {/* Excerpt */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Main Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-ul:text-gray-700 dark:prose-ul:text-gray-300
            prose-ol:text-gray-700 dark:prose-ol:text-gray-300
            prose-li:my-2
            prose-img:rounded-xl prose-img:shadow-lg
            prose-code:text-blue-600 dark:prose-code:text-blue-400
            prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Social Share - Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Found this helpful? Share it with your network!
          </p>
          <SocialShare
            url={postUrl}
            title={post.title}
            description={post.excerpt}
            hashtags={['DealsHub', 'eBayShopping', post.category.replace(/\s+/g, '')]}
          />
        </div>

        {/* Author Bio */}
        <div className="mt-12 p-6 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-white">
                {post.author.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                About {post.author}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {post.authorBio}
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Related Articles
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                className="group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <div className={`h-32 bg-gradient-to-br ${relatedPost.gradient}`}></div>
                <div className="p-4">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {relatedPost.category}
                  </span>
                  <h3 className="font-bold text-gray-900 dark:text-white mt-2 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {relatedPost.readTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
