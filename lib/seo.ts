// SEO utilities and metadata generators

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  canonical?: string;
  noindex?: boolean;
}

export function generateMetaTags(config: SEOConfig) {
  const {
    title,
    description,
    keywords = [],
    ogImage = '/og-image.png',
    ogType = 'website',
    twitterCard = 'summary_large_image',
    canonical,
    noindex = false
  } = config;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    ...(noindex && { robots: 'noindex, nofollow' }),
    ...(canonical && { canonical }),
    openGraph: {
      title,
      description,
      type: ogType,
      images: [{ url: ogImage }],
      siteName: 'DealsHub'
    },
    twitter: {
      card: twitterCard,
      title,
      description,
      images: [ogImage]
    }
  };
}

// Category-specific SEO
export const categorySEO: Record<string, SEOConfig> = {
  electronics: {
    title: 'Best Electronics Deals on eBay 2026 | DealsHub',
    description: 'Find the best deals on laptops, smartphones, tablets, and electronics on eBay. Curated selection from top-rated sellers with buyer protection.',
    keywords: ['electronics deals', 'eBay electronics', 'cheap laptops', 'smartphone deals', 'tech deals 2026']
  },
  gaming: {
    title: 'Gaming Deals: Consoles, Games & Accessories | DealsHub',
    description: 'Shop the latest gaming consoles, video games, and accessories on eBay. PS5, Xbox Series X, Nintendo Switch deals updated daily.',
    keywords: ['gaming deals', 'PS5 deals', 'Xbox deals', 'Nintendo Switch', 'cheap video games']
  },
  sneakers: {
    title: 'Authentic Sneaker Deals | Nike, Jordan, Adidas | DealsHub',
    description: 'Find authentic Nike, Air Jordan, and Adidas sneakers on eBay. Verified sellers, competitive prices, and buyer protection guaranteed.',
    keywords: ['sneaker deals', 'Nike sneakers', 'Air Jordan', 'Adidas', 'authentic sneakers']
  },
  'smart-home': {
    title: 'Smart Home Devices & Deals | Alexa, Google Home | DealsHub',
    description: 'Transform your home with smart devices from eBay. Amazon Alexa, Google Home, smart lights, thermostats, and security systems.',
    keywords: ['smart home deals', 'Alexa deals', 'Google Home', 'smart lights', 'home automation']
  },
  fashion: {
    title: 'Fashion Deals: Clothing, Accessories & More | DealsHub',
    description: 'Discover fashion deals on eBay. Designer clothes, handbags, watches, and accessories from top brands at discounted prices.',
    keywords: ['fashion deals', 'designer clothes', 'handbags', 'watches', 'accessories deals']
  },
  collectibles: {
    title: 'Collectibles & Memorabilia Deals | DealsHub',
    description: 'Find rare collectibles, trading cards, coins, and memorabilia on eBay. Authenticated items from trusted sellers.',
    keywords: ['collectibles', 'trading cards', 'rare coins', 'memorabilia', 'vintage items']
  }
};

// Blog post SEO generator
export function generateBlogSEO(post: {
  title: string;
  excerpt: string;
  keywords: string[];
  slug: string;
}) {
  return generateMetaTags({
    title: `${post.title} | DealsHub Blog`,
    description: post.excerpt,
    keywords: post.keywords,
    ogType: 'article',
    canonical: `/blog/${post.slug}`
  });
}
