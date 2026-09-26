import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/site';

export const metadata: Metadata = {
  title: 'eBay Deal Comparison Calculator | Saleh Store',
  description: 'Compare marketplace listings by item price, shipping, applicable charges, missing accessories, and total delivered cost.',
  alternates: { canonical: absoluteUrl('/tools/deal-comparison') },
};

export default function DealComparisonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
