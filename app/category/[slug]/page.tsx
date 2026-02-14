import CategoryPageClient from '../../../components/CategoryPageClient';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CategoryPageClient slug={slug} />;
}
