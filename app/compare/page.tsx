import type { Metadata } from 'next';
import CompareClient from './CompareClient';

export const metadata: Metadata = {
  title: 'Compare Products | Saleh Store',
  description: 'Side-by-side product comparison on Saleh Store. This personalized utility page is not intended for search indexing.',
  robots: { index: false, follow: true },
};

export default function ComparePage() {
  return <CompareClient />;
}
