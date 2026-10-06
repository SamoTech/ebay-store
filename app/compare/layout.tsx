import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Products',
  robots: { index: false, follow: true },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
