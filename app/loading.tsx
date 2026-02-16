export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mb-4 animate-pulse" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-96 animate-pulse" />
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse"
            >
              {/* Image Skeleton */}
              <div className="h-64 bg-gray-200 dark:bg-gray-700" />

              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />

                {/* Price */}
                <div className="flex items-center justify-between mt-4">
                  <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                </div>

                {/* Button */}
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full mt-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Loading Text */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="font-medium">Loading amazing deals...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
