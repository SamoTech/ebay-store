import { NextResponse } from 'next/server';

// FREE AI with Groq - Sign up at https://console.groq.com/
// No credit card needed, 30 requests/minute free tier

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ 
        reply: "Please ask me a question! I'm here to help you find great deals and products." 
      });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      console.error('GROQ_API_KEY not configured');
      return NextResponse.json({ 
        reply: "I'm currently being set up. Try browsing our categories or using search to find products!" 
      });
    }

    // Call Groq API (FREE)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',  // Fast & FREE
        messages: [
          {
            role: 'system',
            content: `You are a helpful shopping assistant for DealsHub, an eBay affiliate deals website.

Your role:
- Help users find products and deals
- Answer questions about shopping, products, and deals
- Be friendly, concise, and helpful
- Provide practical shopping advice

Our categories: Electronics, Gaming, Sneakers, Smart Home, Beauty, Collectibles

Guidelines:
- Keep responses under 100 words
- Don't make up specific prices or product availability
- Suggest users search our site or browse categories
- Focus on general advice and tips
- Be enthusiastic about deals and savings!

Example topics you can help with:
- Finding specific types of products ("I'm looking for a gaming laptop")
- Shopping tips ("How do I find the best deals?")
- Product recommendations ("What's a good budget phone?")
- eBay shopping advice
- Deal alerts and price tracking`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
        top_p: 1,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API error:', response.status, errorData);
      
      // Provide helpful fallback based on error
      if (response.status === 429) {
        return NextResponse.json({ 
          reply: "I'm getting a lot of questions right now! Try again in a moment, or browse our site directly." 
        });
      }
      
      return NextResponse.json({ 
        reply: "I'm having a brief issue. Meanwhile, try searching our site or browsing categories!" 
      });
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content;

    if (!reply) {
      console.error('No reply from Groq API');
      return NextResponse.json({ 
        reply: "Let me think... Could you rephrase your question? Or try searching our products directly!" 
      });
    }

    return NextResponse.json({ reply: reply.trim() });
    
  } catch (error) {
    console.error('Chat error:', error);
    
    // User-friendly error messages
    return NextResponse.json({ 
      reply: "Oops! I'm having technical difficulties. Try browsing our deals or using the search feature!" 
    });
  }
}
