const CAMPID = '5338903178';
const SITEID = '0';
const MKRID = '711-53200-19255-0';

function createSearchLink(keyword) {
  const kw = encodeURIComponent(keyword);
  return `https://www.ebay.com/sch/i.html?_nkw=${kw}&mkcid=1&mkrid=${MKRID}&siteid=${SITEID}&campid=${CAMPID}`;
}

function createItemLink(itemId) {
  return `https://www.ebay.com/itm/${itemId}?mkcid=1&mkrid=${MKRID}&siteid=${SITEID}&campid=${CAMPID}`;
}

// Featured Products - These show on homepage
export const featuredProducts = [
  {
    id: 1,
    title: 'Apple MacBook Pro 14" M3 Pro',
    price: 1999.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    category: 'Electronics',
    affiliateLink: createSearchLink('MacBook Pro M3'),
    description: 'Powerful laptop for professionals',
    featured: true
  },
  {
    id: 2,
    title: 'iPhone 15 Pro Max 256GB',
    price: 1199.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
    category: 'Electronics',
    affiliateLink: createSearchLink('iPhone 15 Pro Max'),
    description: 'Latest iPhone model',
    featured: true
  },
  {
    id: 3,
    title: 'Samsung Galaxy S24 Ultra',
    price: 1299.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
    category: 'Electronics',
    affiliateLink: createSearchLink('Samsung Galaxy S24 Ultra'),
    description: 'Samsung flagship phone',
    featured: true
  },
  {
    id: 4,
    title: 'PlayStation 5 Console',
    price: 499.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
    category: 'Gaming',
    affiliateLink: createSearchLink('PlayStation 5'),
    description: 'Next-gen gaming console',
    featured: true
  },
  {
    id: 5,
    title: 'Sony WH-1000XM5 Headphones',
    price: 299.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
    category: 'Electronics',
    affiliateLink: createSearchLink('Sony WH-1000XM5'),
    description: 'Premium noise-canceling headphones',
    featured: true
  },
  {
    id: 6,
    title: 'Air Jordan 4 Retro Bred Reimagined',
    price: 350.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400',
    category: 'Sneakers',
    affiliateLink: createSearchLink('Air Jordan 4 Retro'),
    description: 'Top selling sneaker on eBay',
    featured: true
  },
  {
    id: 7,
    title: 'Nintendo Switch OLED',
    price: 349.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400',
    category: 'Gaming',
    affiliateLink: createSearchLink('Nintendo Switch OLED'),
    description: 'Handheld gaming console',
    featured: true
  },
  {
    id: 8,
    title: 'Apple Watch Series 9',
    price: 399.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400',
    category: 'Electronics',
    affiliateLink: createSearchLink('Apple Watch Series 9'),
    description: 'Smart watch with health features',
    featured: true
  }
];

// All products database - add more here easily
export const allProducts = [
  // Electronics
  ...featuredProducts,
  {
    id: 9,
    title: 'Xbox Series X',
    price: 499.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400',
    category: 'Gaming',
    affiliateLink: createSearchLink('Xbox Series X'),
    description: 'Powerful gaming console',
    featured: false
  },
  {
    id: 10,
    title: 'Amazon Echo Dot (5th Gen)',
    price: 49.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400',
    category: 'Smart Home',
    affiliateLink: createSearchLink('Amazon Echo Dot 5th Generation'),
    description: 'Smart speaker with Alexa',
    featured: false
  },
  {
    id: 11,
    title: 'Nike Air Max 270',
    price: 89.99,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    category: 'Sneakers',
    affiliateLink: createSearchLink('Nike Air Max 270'),
    description: 'Comfortable running shoes',
    featured: false
  },
  {
    id: 12,
    title: 'Adidas Ultraboost',
    price: 129.99,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    category: 'Sneakers',
    affiliateLink: createSearchLink('Adidas Ultraboost'),
    description: 'Premium running shoes',
    featured: false
  },
  {
    id: 13,
    title: 'Apple HomePod',
    price: 299.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400',
    category: 'Smart Home',
    affiliateLink: createSearchLink('Apple HomePod'),
    description: 'Smart speaker with Siri',
    featured: false
  },
  {
    id: 14,
    title: 'Ring Video Doorbell',
    price: 99.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    category: 'Smart Home',
    affiliateLink: createSearchLink('Ring Video Doorbell'),
    description: 'Smart doorbell camera',
    featured: false
  },
  {
    id: 15,
    title: 'Dyson Airwrap Complete',
    price: 599.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=400',
    category: 'Beauty',
    affiliateLink: createSearchLink('Dyson Airwrap'),
    description: 'Multi-style hair tool',
    featured: false
  },
  {
    id: 16,
    title: 'Nike Dunk Low',
    price: 110.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
    category: 'Sneakers',
    affiliateLink: createSearchLink('Nike Dunk Low'),
    description: 'Classic street style sneaker',
    featured: false
  },
  {
    id: 17,
    title: 'Philips Hue Smart Bulbs',
    price: 49.99,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400',
    category: 'Smart Home',
    affiliateLink: createSearchLink('Philips Hue Smart Bulbs'),
    description: 'Color smart LED bulbs',
    featured: false
  },
  {
    id: 18,
    title: 'Oral-B iO Electric Toothbrush',
    price: 199.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1559650656-5ab4b2bf3d7f?w=400',
    category: 'Beauty',
    affiliateLink: createSearchLink('Oral-B iO Electric Toothbrush'),
    description: 'Smart electric toothbrush',
    featured: false
  },
  {
    id: 19,
    title: 'Foreo Luna 3',
    price: 199.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400',
    category: 'Beauty',
    affiliateLink: createSearchLink('Foreo Luna 3'),
    description: 'Facial cleansing device',
    featured: false
  },
  {
    id: 20,
    title: 'Pokemon Cards Vintage Collection',
    price: 150.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=400',
    category: 'Collectibles',
    affiliateLink: createSearchLink('Pokemon Cards Vintage'),
    description: 'Vintage Pokemon trading cards',
    featured: false
  },
  {
    id: 21,
    title: 'Sports Jerseys - Vintage',
    price: 75.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=400',
    category: 'Collectibles',
    affiliateLink: createSearchLink('Vintage Sports Jersey'),
    description: 'Vintage sports jerseys',
    featured: false
  },
  {
    id: 22,
    title: 'Funko Pop Figures',
    price: 15.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400',
    category: 'Collectibles',
    affiliateLink: createSearchLink('Funko Pop Figures'),
    description: 'Collectible vinyl figures',
    featured: false
  },
  {
    id: 23,
    title: 'Rare Coins Collection',
    price: 250.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?w=400',
    category: 'Collectibles',
    affiliateLink: createSearchLink('Rare Coins Collection'),
    description: 'Rare collectible coins',
    featured: false
  },
  {
    id: 24,
    title: 'DermaPlaning Tool',
    price: 25.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400',
    category: 'Beauty',
    affiliateLink: createSearchLink('DermaPlaning Tool'),
    description: 'Exfoliation skincare tool',
    featured: false
  }
];

// Easy way to add new products - just copy this format:
/*
{
  id: 25,
  title: 'Product Name',
  price: 99.00,
  currency: 'USD',
  image: 'https://images.unsplash.com/photo-xxx?w=400',
  category: 'Category Name',
  affiliateLink: createSearchLink('Product Name to Search'),
  description: 'Product description',
  featured: false
},
*/

export const categories = [
  { id: 1, name: 'All Products', icon: '🛍️', slug: 'all' },
  { id: 2, name: 'Electronics', icon: '💻', slug: 'electronics' },
  { id: 3, name: 'Gaming', icon: '🎮', slug: 'gaming' },
  { id: 4, name: 'Sneakers', icon: '👟', slug: 'sneakers' },
  { id: 5, name: 'Smart Home', icon: '🏠', slug: 'smart-home' },
  { id: 6, name: 'Beauty', icon: '💄', slug: 'beauty' },
  { id: 7, name: 'Collectibles', icon: '🎯', slug: 'collectibles' },
];

export { createSearchLink, createItemLink, CAMPID, SITEID, MKRID };
