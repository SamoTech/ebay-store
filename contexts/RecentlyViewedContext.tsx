'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ViewedItem {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  affiliateLink: string;
  viewedAt: number;
}

interface RecentlyViewedContextType {
  recentlyViewed: ViewedItem[];
  addToRecentlyViewed: (item: Omit<ViewedItem, 'viewedAt'>) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

// ✅ Increased limit to 20 items
const MAX_RECENT_ITEMS = 20;
const STORAGE_KEY = 'dealshub-recently-viewed';

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<ViewedItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // ✅ Validate and limit on load
        if (Array.isArray(parsed)) {
          setRecentlyViewed(parsed.slice(0, MAX_RECENT_ITEMS));
        }
      }
    } catch (e) {
      console.error('Error loading recently viewed:', e);
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && recentlyViewed.length > 0) {
      try {
        const data = JSON.stringify(recentlyViewed);
        // ✅ Check localStorage size (limit to ~4KB for recently viewed)
        if (data.length < 4096) {
          localStorage.setItem(STORAGE_KEY, data);
        } else {
          // If too large, keep only newest 10
          const reduced = recentlyViewed.slice(0, 10);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced));
          setRecentlyViewed(reduced);
          console.warn('Recently viewed list too large, reduced to 10 items');
        }
      } catch (e) {
        console.error('Error saving recently viewed:', e);
        // If quota exceeded, clear old data
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
          const reduced = recentlyViewed.slice(0, 5);
          setRecentlyViewed(reduced);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced));
        }
      }
    }
  }, [recentlyViewed, isLoaded]);

  const addToRecentlyViewed = (item: Omit<ViewedItem, 'viewedAt'>) => {
    setRecentlyViewed((prev) => {
      // Remove duplicate if exists
      const filtered = prev.filter((p) => p.id !== item.id);
      const newItem = { ...item, viewedAt: Date.now() };
      // ✅ Limit to MAX_RECENT_ITEMS (20)
      return [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS);
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed, clearRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}
