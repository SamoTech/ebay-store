import { NextResponse } from 'next/server';

// FREE AI with Groq - Sign up at https://console.groq.com/
// No credit card needed, 30 requests/minute free tier

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      // Fallback responses if API key not configured
      const fallbackResponses = [
        "I'd love to help! Please set up your GROQ_API_KEY environment variable to enable AI chat.",
        "For product recommendations, try browsing our categories or using the search feature!",
        "Check out our blog for detailed product reviews and shopping tips."
      ];
      return NextResponse.json({ 
        reply: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)] 
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
            content: `You are a helpful shopping assistant for DealsHub, an eBay deals website. 
Help users find products, compare prices, and make smart shopping decisions.
Be friendly, concise, and helpful. If asked about specific products, recommend checking our search or categories.
Don't make up prices or availability - suggest users search our site.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
        top_p: 1
      })
    });

    if (!response.ok) {
      throw new Error('Groq API error');
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "I'm having trouble responding. Please try again.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { reply: "Sorry, I'm having technical difficulties. Please try searching our site directly!" },
      { status: 500 }
    );
  }
}
