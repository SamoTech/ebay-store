// Schema.org markup generator for SEO

export interface ProductSchema {
  '@context': string;
  '@type': string;
  name: string;
  image?: string;
  description?: string;
  brand?: string;
  offers: {
    '@type': string;
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
    seller?: {
      '@type': string;
      name: string;
    };
  };
  aggregateRating?: {
    '@type': string;
    ratingValue: string;
    reviewCount: string;
  };
}

export interface BlogSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  author: {
    '@type': string;
    name: string;
  };
  datePublished: string;
  dateModified?: string;
  image?: string;
}

export function generateProductSchema(product: {
  title: string;
  price: number;
  image?: string;
  description?: string;
  affiliateLink: string;
  rating?: number;
  reviewCount?: number;
}): ProductSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.image,
    description: product.description || `${product.title} available on eBay`,
    brand: 'eBay',
    offers: {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: product.affiliateLink,
      seller: {
        '@type': 'Organization',
        name: 'eBay',
      },
    },
    ...(product.rating && product.reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating.toString(),
            reviewCount: product.reviewCount.toString(),
          },
        }
      : {}),
  };
}

export function generateBlogSchema(blog: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}): BlogSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.description,
    author: {
      '@type': 'Organization',
      name: 'DealsHub',
    },
    datePublished: blog.datePublished,
    dateModified: blog.dateModified || blog.datePublished,
    image: blog.image,
  };
}

export function injectSchema(schema: ProductSchema | BlogSchema): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}
