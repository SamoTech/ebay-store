import { NextResponse } from 'next/server';
import { searchEbayProducts } from '@/lib/ebay-api';
import type { Product } from '@/lib/products';

const GROQ_MODEL = 'openai/gpt-oss-20b';

function extractSearchQuery(message: string): string {
  return message
    .trim()
    .replace(/^\s*(find|search|show|look for|looking for|buy|want|need|recommend|recommend me)\s+/i, '')
    .replace(/^\s*(a|an|the)\s+(good|great|best|cheap|cheapest|budget|deal|deals?)\s+(deal|deals?)?\s*/i, '')
    .replace(/^\s*(good|great|best|cheap|cheapest|budget)\s+deals?\s+(for|on)\s+/i, '')
    .replace(/^\s*(deal|deals?)\s+(for|on)\s+/i, '')
    .replace(/\b(good price|best price|lowest price|low price|cheap|cheapest|budget|affordable)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function looksLikeProductSearch(message: string): boolean {
  const value = message.trim();
  if (!value) return false;

  const general = /^(hi|hello|hey|help|thanks|thank you|who are you|what can you do|good morning|good evening)\b/i;
  if (general.test(value)) return false;

  return /\b(find|search|show|looking for|look for|buy|want|need|recommend|deal|deals|price|cheap|cheapest|best|product|products|phone|phones|laptop|laptops|tablet|tablets|headphones|earbuds|watch|watches|console|gaming|sneakers|camera|cameras|tv|television|monitor|keyboard|mouse)\b/i.test(value);
}

function hasPriceIntent(message: string): boolean {
  return /\\b(good price|best price|cheap|cheapest|lowest price|low price|budget|affordable|deal|deals)\\b/i.test(message);
}

function sortProductsForIntent(products: Product[], message: string): Product[] {
  if (!hasPriceIntent(message)) return products;
  return [...products].sort((a, b) => a.price - b.price);
}

function hasPriceIntent(message: string): boolean {
  return /\b(good price|best price|cheap|cheapest|lowest price|low price|budget|affordable|deal|deals)\b/i.test(message);
}

function sortProductsForIntent(products: Product[], message: string): Product[] {
  if (!hasPriceIntent(message)) return products;
  return [...products].sort((a, b) => a.price - b.price);
}

function productContext(products: Product[]): string {
  return products.map((product, index) => {
    const details = [
      `#${index + 1}`,
      product.title,
      `Price: ${product.price} ${product.currency || 'USD'}`,
      product.condition ? `Condition: ${product.condition}` : '',
      product.shipping ? `Shipping: ${product.shipping}` : '',
    ].filter(Boolean);

    return details.join(' | ');
  }).join('\n');
}

async function generateReply(
  groqApiKey: string,
  userMessage: string,
  products: Product[],
): Promise<string> {
  const context = products.length
    ? `LIVE EBAY RESULTS FROM SALEH STORE:\n${productContext(products)}`
    : 'No live eBay products were found for this request.';

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are the Shopping Assistant for Saleh Store, an eBay affiliate shopping site.

Use the supplied live eBay results when they exist.
- Never invent products, prices, availability, discounts, conditions, or shipping.
- Do not claim a product is the cheapest or best unless the supplied results support that comparison.
- Keep the answer concise, normally under 70 words.
- When live products are supplied, give only a short introduction; the UI renders the individual product cards.
- Never repeat individual product names, prices, conditions, or shipping in your response.
- Never use bullets or a product list in the response.
- If the results were sorted by price, say that they are shown from lowest price first.
- If no products were found, give useful general shopping guidance without inventing listings.
- Do not output URLs; the UI adds the tracked affiliate links.`,
        },
        {
          role: 'user',
          content: `User request: ${userMessage.trim()}\n\n${context}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 180,
      top_p: 1,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Groq API error:', response.status, errorData);

    if (response.status === 401 || response.status === 403) {
      return products.length
        ? 'I found matching live listings. The product links are shown below.'
        : 'The shopping assistant is temporarily unavailable. Please try again shortly.';
    }

    if (response.status === 429) {
      return products.length
        ? 'I found matching live listings. Check the products below.'
        : 'I’m getting a lot of questions right now. Try again in a moment.';
    }

    return products.length
      ? 'I found matching live listings. Check the products below.'
      : 'I found no live listings for that request. Try a more specific product name.';
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content;

  return typeof reply === 'string' && reply.trim()
    ? reply.trim()
    : products.length
      ? 'I found matching live listings. Check the products below.'
      : 'Could you be more specific about the product you are looking for?';
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({
        reply: "Please ask me what product or deal you're looking for.",
        products: [],
      });
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      console.error('GROQ_API_KEY not configured');
      return NextResponse.json({
        reply: 'The shopping assistant is currently being configured. You can still browse our live products.',
        products: [],
      });
    }

    const userMessage = message.trim();
    let products: Product[] = [];
    let sortedByPrice = false;

    if (looksLikeProductSearch(userMessage)) {
      const query = extractSearchQuery(userMessage);
      if (query.length >= 2) {
        products = await searchEbayProducts(query, 6);
        if (hasPriceIntent(userMessage)) {
          products = sortProductsForIntent(products, userMessage);
          sortedByPrice = products.length > 1;
        }
      }
    }

    const reply = await generateReply(groqApiKey, userMessage, products);

    return NextResponse.json({
      reply,
      products: products.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        currency: product.currency || 'USD',
        image: product.image,
        condition: product.condition,
        shipping: product.shipping,
        affiliateLink: product.affiliateLink,
        isLive: product.isLive === true,
      })),
    });
  } catch (error) {
    console.error('Chat error:', error);

    return NextResponse.json({
      reply: 'Oops! I’m having technical difficulties. Try searching our products directly.',
      products: [],
    });
  }
}
