import {
  createAffiliateUrl,
  createSearchLink,
  getCampaignId,
  DEFAULT_CAMPAIGN_ID,
  SITEID,
  MKRID,
  MKCID,
} from './affiliate';

export {
  createAffiliateUrl,
  createSearchLink,
  getCampaignId,
  DEFAULT_CAMPAIGN_ID,
  SITEID,
  MKRID,
  MKCID,
};

/** Kept for backwards compatibility — resolves at call time. */
export const CAMPID = DEFAULT_CAMPAIGN_ID;

/**
 * Live eBay items are assigned IDs starting at this offset so they can never
 * collide with the static catalog (`id < LIVE_PRODUCT_ID_OFFSET`).
 */
export const LIVE_PRODUCT_ID_OFFSET = 1000;

/**
 * Single source of truth for "is this item a live eBay listing?".
 *
 * Live items must link straight to eBay (affiliate URL); static catalog items
 * link to the internal `/product/[id]` detail page.
 */
export function isLiveProduct(product: Pick<Product, 'id'>): boolean {
  return product.id >= LIVE_PRODUCT_ID_OFFSET;
}

/** Assign a live-eBay product ID for the given result index. */
export function liveProductId(index: number): number {
  return LIVE_PRODUCT_ID_OFFSET + index;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  image: string;
  category: string;
  affiliateLink: string;
  description: string;
  featured?: boolean;
  rating?: number;
  /** True for items fetched live from the eBay API (see `isLiveProduct`). */
  isLive?: boolean;
  /** Listing condition reported by eBay (e.g. "New", "Pre-owned"). */
  condition?: string;
  /** Human-readable shipping summary (e.g. "Free shipping"). */
  shipping?: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  slug: string;
}

export const featuredProducts: Product[] = [
  { id: 1, title: 'Apple MacBook Pro 14" M3 Pro', price: 1999, originalPrice: 2499, currency: 'USD', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', category: 'Electronics', affiliateLink: createSearchLink('MacBook Pro M3', 'static-electronics'), description: 'Powerful laptop for professionals', featured: true, rating: 5 },
  { id: 2, title: 'iPhone 15 Pro Max 256GB', price: 1199, originalPrice: 1299, currency: 'USD', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', category: 'Electronics', affiliateLink: createSearchLink('iPhone 15 Pro Max', 'static-electronics'), description: 'Latest iPhone model', featured: true, rating: 5 },
  { id: 3, title: 'Samsung Galaxy S24 Ultra', price: 1299, originalPrice: 1419, currency: 'USD', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', category: 'Electronics', affiliateLink: createSearchLink('Samsung Galaxy S24 Ultra', 'static-electronics'), description: 'Samsung flagship phone', featured: true, rating: 4 },
  { id: 4, title: 'PlayStation 5 Console', price: 499, originalPrice: 549, currency: 'USD', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', category: 'Gaming', affiliateLink: createSearchLink('PlayStation 5', 'static-gaming'), description: 'Next-gen gaming console', featured: true, rating: 5 },
  { id: 5, title: 'Sony WH-1000XM5', price: 299, originalPrice: 399, currency: 'USD', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400', category: 'Electronics', affiliateLink: createSearchLink('Sony WH-1000XM5', 'static-electronics'), description: 'Premium headphones', featured: true, rating: 5 },
  { id: 6, title: 'Air Jordan 4 Retro', price: 350, originalPrice: 450, currency: 'USD', image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400', category: 'Sneakers', affiliateLink: createSearchLink('Air Jordan 4 Retro', 'static-sneakers'), description: 'Top selling sneaker', featured: true, rating: 5 },
  { id: 7, title: 'Nintendo Switch OLED', price: 349, currency: 'USD', image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400', category: 'Gaming', affiliateLink: createSearchLink('Nintendo Switch OLED', 'static-gaming'), description: 'Handheld gaming', featured: true, rating: 5 },
  { id: 8, title: 'Apple Watch Series 9', price: 399, originalPrice: 449, currency: 'USD', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400', category: 'Electronics', affiliateLink: createSearchLink('Apple Watch Series 9', 'static-electronics'), description: 'Smart watch', featured: true, rating: 4 }
];

export const allProducts: Product[] = [
  ...featuredProducts,
  { id: 9, title: 'iPad Pro 12.9" M3', price: 1099, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', category: 'Electronics', affiliateLink: createSearchLink('iPad Pro M3', 'static-electronics'), description: 'Professional tablet' },
  { id: 10, title: 'iPad Air M2', price: 599, image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400', category: 'Electronics', affiliateLink: createSearchLink('iPad Air M2', 'static-electronics'), description: 'Portable tablet' },
  { id: 11, title: 'AirPods Pro 2nd Gen', price: 249, image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400', category: 'Electronics', affiliateLink: createSearchLink('AirPods Pro 2', 'static-electronics'), description: 'Wireless earbuds' },
  { id: 12, title: 'AirPods Max', price: 549, image: 'https://images.unsplash.com/photo-1625245488600-f03fef636a3c?w=400', category: 'Electronics', affiliateLink: createSearchLink('AirPods Max', 'static-electronics'), description: 'Over-ear headphones' },
  { id: 13, title: 'Samsung Galaxy Tab S9', price: 849, image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400', category: 'Electronics', affiliateLink: createSearchLink('Galaxy Tab S9', 'static-electronics'), description: 'Android tablet' },
  { id: 14, title: 'Dyson V15 Detect', price: 699, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400', category: 'Electronics', affiliateLink: createSearchLink('Dyson V15', 'static-electronics'), description: 'Cordless vacuum' },
  { id: 15, title: 'Kindle Paperwhite', price: 139, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', category: 'Electronics', affiliateLink: createSearchLink('Kindle Paperwhite', 'static-electronics'), description: 'E-reader' },
  { id: 16, title: 'PlayStation VR2', price: 549, image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400', category: 'Electronics', affiliateLink: createSearchLink('PlayStation VR2', 'static-electronics'), description: 'VR headset' },
  { id: 17, title: 'Mac Mini M2 Pro', price: 1299, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', category: 'Electronics', affiliateLink: createSearchLink('Mac Mini', 'static-electronics'), description: 'Desktop computer' },
  { id: 18, title: 'iMac 24" M3', price: 1299, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', category: 'Electronics', affiliateLink: createSearchLink('iMac', 'static-electronics'), description: 'All-in-one PC' },
  { id: 19, title: 'Xbox Series X', price: 499, image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400', category: 'Gaming', affiliateLink: createSearchLink('Xbox Series X', 'static-gaming'), description: 'Gaming console' },
  { id: 20, title: 'Xbox Series S', price: 349, image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400', category: 'Gaming', affiliateLink: createSearchLink('Xbox Series S', 'static-gaming'), description: 'Digital console' },
  { id: 21, title: 'Nintendo Switch Lite', price: 199, image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400', category: 'Gaming', affiliateLink: createSearchLink('Switch Lite', 'static-gaming'), description: 'Portable console' },
  { id: 22, title: 'Steam Deck', price: 399, image: 'https://images.unsplash.com/photo-1640955014216-75201056c829?w=400', category: 'Gaming', affiliateLink: createSearchLink('Steam Deck', 'static-gaming'), description: 'PC gaming handheld' },
  { id: 23, title: 'Nike Air Max 270', price: 89, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', category: 'Sneakers', affiliateLink: createSearchLink('Nike Air Max 270', 'static-sneakers'), description: 'Running shoes' },
  { id: 24, title: 'Adidas Ultraboost', price: 129, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400', category: 'Sneakers', affiliateLink: createSearchLink('Adidas Ultraboost', 'static-sneakers'), description: 'Premium runners' },
  { id: 25, title: 'Nike Dunk Low', price: 110, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400', category: 'Sneakers', affiliateLink: createSearchLink('Nike Dunk Low', 'static-sneakers'), description: 'Street style' },
  { id: 26, title: 'New Balance 550', price: 110, image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400', category: 'Sneakers', affiliateLink: createSearchLink('New Balance 550', 'static-sneakers'), description: 'Retro basketball' },
  { id: 27, title: 'Air Jordan 1', price: 180, image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400', category: 'Sneakers', affiliateLink: createSearchLink('Air Jordan 1', 'static-sneakers'), description: 'Iconic sneakers' },
  { id: 28, title: 'Nike Air Force 1', price: 110, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', category: 'Sneakers', affiliateLink: createSearchLink('Air Force 1', 'static-sneakers'), description: 'Classic sneakers' },
  { id: 29, title: 'Amazon Echo Dot', price: 49, image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400', category: 'Smart Home', affiliateLink: createSearchLink('Echo Dot', 'static-smart-home'), description: 'Smart speaker' },
  { id: 30, title: 'Amazon Echo Show', price: 139, image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400', category: 'Smart Home', affiliateLink: createSearchLink('Echo Show', 'static-smart-home'), description: 'Smart display' },
  { id: 31, title: 'Apple HomePod', price: 299, image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400', category: 'Smart Home', affiliateLink: createSearchLink('HomePod', 'static-smart-home'), description: 'Apple speaker' },
  { id: 32, title: 'Ring Doorbell', price: 99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', category: 'Smart Home', affiliateLink: createSearchLink('Ring Doorbell', 'static-smart-home'), description: 'Video doorbell' },
  { id: 33, title: 'Philips Hue', price: 199, image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400', category: 'Smart Home', affiliateLink: createSearchLink('Philips Hue', 'static-smart-home'), description: 'Smart bulbs' },
  { id: 34, title: 'Dyson Airwrap', price: 599, image: 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=400', category: 'Beauty', affiliateLink: createSearchLink('Dyson Airwrap', 'static-beauty'), description: 'Hair styling' },
  { id: 35, title: 'Oral-B iO', price: 249, image: 'https://images.unsplash.com/photo-1559650656-5ab4b2bf3d7f?w=400', category: 'Beauty', affiliateLink: createSearchLink('Oral-B iO', 'static-beauty'), description: 'Smart toothbrush' },
  { id: 36, title: 'Foreo Luna 3', price: 199, image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400', category: 'Beauty', affiliateLink: createSearchLink('Foreo Luna', 'static-beauty'), description: 'Facial cleanser' },
  { id: 37, title: 'Dyson Supersonic', price: 399, image: 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=400', category: 'Beauty', affiliateLink: createSearchLink('Dyson Supersonic', 'static-beauty'), description: 'Hair dryer' },
  { id: 38, title: 'Pokemon Cards', price: 150, image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=400', category: 'Collectibles', affiliateLink: createSearchLink('Pokemon Cards', 'static-collectibles'), description: 'Trading cards' },
  { id: 39, title: 'Funko Pop', price: 15, image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400', category: 'Collectibles', affiliateLink: createSearchLink('Funko Pop', 'static-collectibles'), description: 'Collectible figures' },
  { id: 40, title: 'Vintage Jerseys', price: 75, image: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=400', category: 'Collectibles', affiliateLink: createSearchLink('Vintage Jersey', 'static-collectibles'), description: 'Sports jerseys' },
  { id: 41, title: 'Rare Coins', price: 250, image: 'https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?w=400', category: 'Collectibles', affiliateLink: createSearchLink('Rare Coins', 'static-collectibles'), description: 'Collectible coins' },
  { id: 42, title: 'Roomba Robot Vacuum', price: 349, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', category: 'Home', affiliateLink: createSearchLink('Roomba', 'static-home'), description: 'Robot vacuum' },
  { id: 43, title: 'Nespresso Machine', price: 199, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', category: 'Home', affiliateLink: createSearchLink('Nespresso', 'static-home'), description: 'Coffee maker' },
  { id: 44, title: 'Vitamix Blender', price: 349, image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400', category: 'Home', affiliateLink: createSearchLink('Vitamix', 'static-home'), description: 'Professional blender' },
  { id: 45, title: 'Instant Pot', price: 89, image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400', category: 'Home', affiliateLink: createSearchLink('Instant Pot', 'static-home'), description: 'Multi-cooker' },
  { id: 46, title: 'Peloton Bike', price: 1445, image: 'https://images.unsplash.com/photo-1591741535018-3b0cc59f7f7f?w=400', category: 'Fitness', affiliateLink: createSearchLink('Peloton', 'static-fitness'), description: 'Exercise bike' },
  { id: 47, title: 'Yoga Mat', price: 78, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', category: 'Fitness', affiliateLink: createSearchLink('Yoga Mat', 'static-fitness'), description: 'Premium mat' },
  { id: 48, title: 'Dumbbells Set', price: 199, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', category: 'Fitness', affiliateLink: createSearchLink('Dumbbells', 'static-fitness'), description: 'Weight set' },
  { id: 49, title: 'Garmin Watch', price: 399, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400', category: 'Fitness', affiliateLink: createSearchLink('Garmin Watch', 'static-fitness'), description: 'Fitness tracker' },
  { id: 50, title: 'Furbo Dog Camera', price: 199, image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', category: 'Pet Supplies', affiliateLink: createSearchLink('Furbo', 'static-pet-supplies'), description: 'Dog camera' },
  { id: 51, title: 'Auto Pet Feeder', price: 129, image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', category: 'Pet Supplies', affiliateLink: createSearchLink('Pet Feeder', 'static-pet-supplies'), description: 'Automatic feeder' },
  { id: 52, title: 'Dog Bed', price: 79, image: 'https://images.unsplash.com/photo-1541781777621-6b7bd1b70a3d?w=400', category: 'Pet Supplies', affiliateLink: createSearchLink('Dog Bed', 'static-pet-supplies'), description: 'Pet bed' },
  { id: 53, title: 'Baby Stroller', price: 299, image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400', category: 'Baby', affiliateLink: createSearchLink('Baby Stroller', 'static-baby'), description: 'Travel stroller' },
  { id: 54, title: 'Car Seat', price: 249, image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400', category: 'Baby', affiliateLink: createSearchLink('Car Seat', 'static-baby'), description: 'Safety seat' },
  { id: 55, title: 'Baby Monitor', price: 149, image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400', category: 'Baby', affiliateLink: createSearchLink('Baby Monitor', 'static-baby'), description: 'Video monitor' },
  { id: 56, title: 'Kids Tablet', price: 129, image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400', category: 'Baby', affiliateLink: createSearchLink('Kids Tablet', 'static-baby'), description: 'Learning tablet' },
  { id: 57, title: 'Dash Cam', price: 99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', category: 'Auto', affiliateLink: createSearchLink('Dash Cam', 'static-auto'), description: 'Car camera' },
  { id: 58, title: 'Jump Starter', price: 79, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', category: 'Auto', affiliateLink: createSearchLink('Jump Starter', 'static-auto'), description: 'Car battery' },
  { id: 59, title: 'Standing Desk', price: 399, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400', category: 'Office', affiliateLink: createSearchLink('Standing Desk', 'static-office'), description: 'Electric desk' },
  { id: 60, title: 'Office Chair', price: 299, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400', category: 'Office', affiliateLink: createSearchLink('Office Chair', 'static-office'), description: 'Ergonomic chair' },
  { id: 61, title: 'Monitor Stand', price: 79, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', category: 'Office', affiliateLink: createSearchLink('Monitor Stand', 'static-office'), description: 'Dual mount' },
  { id: 62, title: 'Wireless Keyboard', price: 99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', category: 'Office', affiliateLink: createSearchLink('Wireless Keyboard', 'static-office'), description: 'Keyboard mouse' }
];

export const categories: Category[] = [
  { id: 1, name: 'All Products', icon: '🛍️', slug: 'all' },

  // Existing Saleh Store merchandising categories.
  { id: 2, name: 'Electronics', icon: '💻', slug: 'electronics' },
  { id: 3, name: 'Gaming', icon: '🎮', slug: 'gaming' },
  { id: 4, name: 'Sneakers', icon: '👟', slug: 'sneakers' },
  { id: 5, name: 'Smart Home', icon: '🏠', slug: 'smart-home' },
  { id: 6, name: 'Beauty', icon: '💄', slug: 'beauty' },
  { id: 7, name: 'Collectibles', icon: '🎯', slug: 'collectibles' },
  { id: 8, name: 'Home', icon: '🛋️', slug: 'home' },
  { id: 9, name: 'Fitness', icon: '💪', slug: 'fitness' },
  { id: 10, name: 'Pet Supplies', icon: '🐕', slug: 'pet-supplies' },
  { id: 11, name: 'Baby', icon: '👶', slug: 'baby' },
  { id: 12, name: 'Auto', icon: '🚗', slug: 'auto' },
  { id: 13, name: 'Office', icon: '💼', slug: 'office' },

  // eBay's current broad marketplace taxonomy, kept as searchable landing pages.
  { id: 20, name: 'eBay Motors', icon: '🚘', slug: 'ebay-motors' },
  { id: 21, name: 'Consumer Electronics', icon: '📱', slug: 'consumer-electronics' },
  { id: 22, name: 'Collectibles & Art', icon: '🖼️', slug: 'collectibles-art' },
  { id: 23, name: 'Home & Garden', icon: '🏡', slug: 'home-garden' },
  { id: 24, name: 'Clothing, Shoes & Accessories', icon: '👗', slug: 'clothing-shoes-accessories' },
  { id: 25, name: 'Toys & Hobbies', icon: '🧸', slug: 'toys-hobbies' },
  { id: 26, name: 'Sporting Goods', icon: '🏀', slug: 'sporting-goods' },
  { id: 27, name: 'Books, Movies & Music', icon: '📚', slug: 'books-movies-music' },
  { id: 28, name: 'Health & Beauty', icon: '🧴', slug: 'health-beauty' },
  { id: 29, name: 'Business & Industrial', icon: '🏭', slug: 'business-industrial' },
  { id: 30, name: 'Jewelry & Watches', icon: '💎', slug: 'jewelry-watches' },
  { id: 31, name: 'Baby Essentials', icon: '🍼', slug: 'baby-essentials' },
  { id: 32, name: 'Pet Supplies & Accessories', icon: '🐾', slug: 'pet-supplies-ebay' },
  { id: 33, name: 'Tickets & Travel', icon: '✈️', slug: 'tickets-travel' },
  { id: 34, name: 'Everything Else', icon: '🧩', slug: 'everything-else' },
  { id: 36, name: 'Gift Cards & Coupons', icon: '🎁', slug: 'gift-cards-coupons' },

  // High-volume searchable category hubs from eBay's marketplace taxonomy.
  { id: 40, name: 'Computers, Tablets & Networking', icon: '🖥️', slug: 'computers-tablets-networking' },
  { id: 41, name: 'Cell Phones & Accessories', icon: '📲', slug: 'cell-phones-accessories' },
  { id: 42, name: 'Video Games & Consoles', icon: '🎮', slug: 'video-games-consoles' },
  { id: 43, name: 'Cameras & Photo', icon: '📷', slug: 'cameras-photo' },
  { id: 44, name: 'TV, Video & Home Audio', icon: '📺', slug: 'tv-video-home-audio' },
  { id: 45, name: 'Portable Audio & Headphones', icon: '🎧', slug: 'portable-audio-headphones' },
  { id: 46, name: 'Vehicle Parts & Accessories', icon: '🔧', slug: 'vehicle-parts-accessories' },
  { id: 47, name: 'Vehicle Electronics & GPS', icon: '🛰️', slug: 'vehicle-electronics-gps' },
  { id: 48, name: 'Surveillance & Smart Home Electronics', icon: '🔐', slug: 'surveillance-smart-home-electronics' },
  { id: 49, name: 'Virtual Reality', icon: '🥽', slug: 'virtual-reality' },
  { id: 50, name: 'Coins & Paper Money', icon: '🪙', slug: 'coins-paper-money' },
  { id: 51, name: 'Antiques', icon: '🏺', slug: 'antiques' },
  { id: 52, name: 'Art', icon: '🎨', slug: 'art' },
  { id: 53, name: 'Crafts', icon: '🧵', slug: 'crafts' },
  { id: 54, name: 'Pottery & Glass', icon: '🏺', slug: 'pottery-glass' },
  { id: 55, name: 'Stamps', icon: '📮', slug: 'stamps' },
  { id: 56, name: 'Entertainment Memorabilia', icon: '🎬', slug: 'entertainment-memorabilia' },
  { id: 57, name: 'Dolls & Bears', icon: '🧸', slug: 'dolls-bears' },
  { id: 58, name: 'Musical Instruments & Gear', icon: '🎸', slug: 'musical-instruments-gear' },
  { id: 59, name: 'Sports Mem, Cards & Fan Shop', icon: '🏆', slug: 'sports-mem-cards-fan-shop' },
  { id: 60, name: 'Books & Magazines', icon: '📖', slug: 'books-magazines' },
  { id: 61, name: 'Travel', icon: '🧳', slug: 'travel' },
  { id: 62, name: 'Video Game Accessories', icon: '🕹️', slug: 'video-game-accessories' },
];

// Affiliate constants are re-exported at the top of this file.
