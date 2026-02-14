'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface FavoriteItem {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  affiliateLink: string;
  description?: string;  // Optional for backward compatibility
  originalPrice?: number;
  currency?: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('dealshub-favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('dealshub-favorites', JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const addFavorite = (item: FavoriteItem) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === item.id)) return prev;
      // Ensure description exists for compatibility
      const itemWithDescription = {
        ...item,
        description: item.description || `${item.category} product from eBay`,
      };
      return [...prev, itemWithDescription];
    });
  };

  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const isFavorite = (id: number) => {
    return favorites.some((f) => f.id === id);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
