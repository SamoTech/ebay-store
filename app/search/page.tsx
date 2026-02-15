import { Suspense } from 'react';
import SearchPageContent from './SearchPageContent';

export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </main>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
