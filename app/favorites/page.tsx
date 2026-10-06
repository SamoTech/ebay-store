import type { Metadata } from 'next';
import FavoritesClient from './FavoritesClient';

export const metadata: Metadata = {
  title: 'Saved Favorites | Saleh Store',
  description: 'Saved product selections on Saleh Store. This personalized utility page is not intended for search indexing.',
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}
