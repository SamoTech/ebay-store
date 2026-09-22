import { Metadata } from 'next';
import CategoryPageClient from '../../../components/CategoryPageClient';
import { absoluteUrl } from '../../../lib/site';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  return {
    title: `${categoryName} Deals`,
    description: `Browse the best ${categoryName.toLowerCase()} deals and products on Saleh Store.`,
    alternates: { canonical: absoluteUrl(`/category/${slug}`) },
  };
}


export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CategoryPageClient slug={slug} />;
}
