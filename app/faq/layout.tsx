import type { Metadata } from 'next';
import { absoluteUrl } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about Saleh Store.',
  alternates: {
    canonical: absoluteUrl('/faq'),
  },
};

export default function FAQLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
