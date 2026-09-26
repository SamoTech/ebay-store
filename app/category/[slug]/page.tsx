import { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
  if (!['electronics','gaming','sneakers','smart-home','beauty','collectibles','home','fitness','pet-supplies','baby','auto','office','ebay-motors','consumer-electronics','collectibles-art','home-garden','clothing-shoes-accessories','toys-hobbies','sporting-goods','books-movies-music','health-beauty','business-industrial','jewelry-watches','baby-essentials','pet-supplies-ebay','tickets-travel','everything-else','real-estate','gift-cards-coupons','specialty-services','computers-tablets-networking','cell-phones-accessories','video-games-consoles','cameras-photo','tv-video-home-audio','portable-audio-headphones','vehicle-parts-accessories','vehicle-electronics-gps','surveillance-smart-home-electronics','virtual-reality','coins-paper-money','antiques','art','crafts','pottery-glass','stamps','entertainment-memorabilia','dolls-bears','musical-instruments-gear','sports-mem-cards-fan-shop','books-magazines','travel','video-game-accessories'].includes(slug)) notFound();
  return <CategoryPageClient slug={slug} />;
}
