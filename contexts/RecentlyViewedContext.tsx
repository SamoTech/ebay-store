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

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<ViewedItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('dealshub-recently-viewed');
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading recently viewed:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('dealshub-recently-viewed', JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed, isLoaded]);

  const addToRecentlyViewed = (item: Omit<ViewedItem, 'viewedAt'>) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== item.id);
      const newItem = { ...item, viewedAt: Date.now() };
      return [newItem, ...filtered].slice(0, 10);
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
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
