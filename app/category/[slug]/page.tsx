import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryPageClient from '../../../components/CategoryPageClient';
import { allProducts, categories } from '../../../lib/products';
import { absoluteUrl } from '../../../lib/site';
import { generateBreadcrumbSchema, SchemaScript } from '../../../lib/schema';

const categoryFocus: Record<string, string> = {
  electronics: 'Compare consumer electronics, devices, accessories, and related eBay listings with clear product details and current marketplace links.',
  gaming: 'Explore gaming consoles, accessories, hardware, and related eBay listings while comparing product specifications, prices, and purchase terms.',
  sneakers: 'Explore sneakers and footwear listings with product details, price comparisons, and direct eBay purchase links.',
  'smart-home': 'Explore smart-home devices and accessories, including connected lighting, speakers, security products, and home automation equipment.',
  beauty: 'Explore beauty and personal-care products with practical product information, price comparisons, and direct marketplace links.',
  collectibles: 'Explore collectibles and memorabilia with product information and marketplace listings across popular collecting categories.',
  home: 'Explore home products and appliances with product details, price comparisons, and direct eBay listings.',
  fitness: 'Explore fitness equipment, wearables, and training accessories with practical product information and marketplace links.',
  'pet-supplies': 'Explore pet supplies and accessories with product details, price comparisons, and direct eBay listings.',
  baby: 'Explore baby products and essentials with practical product information and direct marketplace links.',
  auto: 'Explore automotive accessories and equipment with product details, price comparisons, and direct eBay listings.',
  office: 'Explore office furniture, accessories, and equipment with practical product information and marketplace links.',
};

function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug && category.slug !== 'all');
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    return {};
  }

  const description = categoryFocus[slug] ?? `Explore ${category.name.toLowerCase()} products, marketplace listings, and buying information on Saleh Store.`;

  return {
    title: `${category.name} Deals`,
    description,
    openGraph: {
      title: `${category.name} Deals | Saleh Store`,
      description,
      url: absoluteUrl(`/category/${slug}`),
    },
    alternates: { canonical: absoluteUrl(`/category/${slug}`) },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    notFound();
  }

  const description =
    categoryFocus[slug] ??
    `Explore ${category.name.toLowerCase()} products, marketplace listings, and buying information on Saleh Store.`;

  const staticProducts = allProducts
    .filter((product) => product.category.toLowerCase() === category.name.toLowerCase())
    .slice(0, 24);

  const categoryUrl = absoluteUrl(`/category/${slug}`);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Categories', url: absoluteUrl('/categories') },
    { name: category.name, url: categoryUrl },
  ]);

  const itemListSchema = staticProducts.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${category.name} products`,
        url: categoryUrl,
        numberOfItems: staticProducts.length,
        itemListElement: staticProducts.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: product.title,
          url: absoluteUrl(`/product/${product.id}`),
        })),
      }
    : null;

  return (
    <>
      <SchemaScript schema={breadcrumbSchema} />
      {itemListSchema && <SchemaScript schema={itemListSchema} />}

      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-sm font-semibold text-[#0064d2] dark:text-blue-400 uppercase tracking-wide">
            Saleh Store category
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
            {category.name} Deals
          </h1>
          <p className="mt-3 max-w-4xl text-base md:text-lg leading-7 text-gray-600 dark:text-gray-300">
            {description}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a href={categoryUrl} className="font-semibold text-[#0064d2] dark:text-blue-400">
              Canonical category page
            </a>
            <a href="/categories" className="font-semibold text-[#0064d2] dark:text-blue-400">
              Browse all categories
            </a>
          </div>
        </div>
      </section>

      <AdSenseBlock placement="category-after-intro" />
      <CategoryPageClient slug={slug} />
    </>
  );
}
