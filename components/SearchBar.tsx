'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product } from '../lib/products';
import { formatPrice } from '../lib/utils/price';
import { trackEvent } from '../lib/analytics';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(query.trim())}&limit=5`);
        const data = await response.json();
        setResults(data.products || []);
        setIsOpen(true);
        setActiveIndex(-1);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const submitQuery = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    // URLSearchParams encodes spaces as "+", which Next.js decodes back to
    // spaces when reading `useSearchParams()`.
    const params = new URLSearchParams({ q: trimmed });
    router.push(`/search?${params.toString()}`);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuery(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (results.length === 0) return;
      e.preventDefault();
      setActiveIndex((current) => {
        const next = e.key === 'ArrowDown' ? current + 1 : current - 1;
        if (next < 0) return results.length - 1;
        if (next >= results.length) return 0;
        return next;
      });
    }
  };

  const clearQuery = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} role="search" aria-label="Product search">
        <div className="relative">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            aria-label="Search for products"
            placeholder="Search for products, categories, brands..."
            className="w-full px-5 py-3 pl-12 pr-24 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors [&::-webkit-search-cancel-button]:hidden"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isLoading && (
              <div
                className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"
                role="status"
                aria-label="Searching"
              />
            )}

            {query.length > 0 && !isLoading && (
              <button
                type="button"
                onClick={clearQuery}
                aria-label="Clear input"
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            <button
              type="submit"
              aria-label="Search"
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && results.length > 0 && (
          <div
            id="search-suggestions"
            role="listbox"
            aria-label="Search suggestions"
            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="py-2">
              {results.map((result, index) => (
                <a
                  key={result.id}
                  id={`search-option-${index}`}
                  role="option"
                  aria-selected={activeIndex === index}
                  href={result.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    trackEvent({
                      event: 'affiliate_outbound_click',
                      productId: result.id,
                      source: 'search_autocomplete',
                      category: result.category,
                      placement: 'autocomplete_result',
                      url: result.affiliateLink,
                    });
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    activeIndex === index
                      ? 'bg-gray-50 dark:bg-gray-700'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={result.image}
                      alt={result.title}
                      fill
                      className="object-cover rounded-lg"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {result.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {result.category}
                      </span>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {formatPrice(result.price, result.currency)}
                      </span>
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-900">
              <button
                type="submit"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-2"
              >
                See all results for &quot;{query}&quot;
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* No Results */}
        {isOpen && !isLoading && query.trim().length >= 2 && results.length === 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No products found for &quot;{query}&quot;</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Try different keywords</p>
          </div>
        )}
      </form>
    </div>
  );
}
