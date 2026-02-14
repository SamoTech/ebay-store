export function BlogSkeletonCard() {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded mb-3" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </article>
  );
}

export function BlogSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BlogSkeletonCard key={i} />
      ))}
    </div>
  );
}

export function FeaturedBlogSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="md:flex">
        <div className="md:w-1/2">
          <div className="h-64 md:h-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="md:w-1/2 p-8">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-4" />
          <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="flex gap-2 mb-6">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="h-12 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
