import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Favorites | Saleh Store',
  robots: { index: false, follow: true },
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
