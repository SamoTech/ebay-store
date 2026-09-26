import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryPageClient from '../../../components/CategoryPageClient';
import { categories } from '../../../lib/products';
import { absoluteUrl } from '../../../lib/site';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug && item.slug !== 'all');

  if (!category) {
    return {};
  }

  return {
    title: `${category.name} Deals`,
    description: `Browse the best ${category.name.toLowerCase()} deals and products on Saleh Store.`,
    alternates: { canonical: absoluteUrl(`/category/${slug}`) },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!categories.some((category) => category.slug === slug && category.slug !== 'all')) {
    notFound();
  }

  return <CategoryPageClient slug={slug} />;
}
