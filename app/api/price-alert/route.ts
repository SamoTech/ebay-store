import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, productId, productTitle, currentPrice, targetPrice, productImage, affiliateLink } = data;

    // Store alert in localStorage (in production, use a database like Supabase)
    if (typeof window !== 'undefined') {
      const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
      alerts.push({
        id: Date.now(),
        email,
        productId,
        productTitle,
        currentPrice,
        targetPrice,
        productImage,
        affiliateLink,
        createdAt: new Date().toISOString(),
        status: 'active'
      });
      localStorage.setItem('priceAlerts', JSON.stringify(alerts));
    }

    // Send confirmation email using Web3Forms (FREE - 250 emails/month)
    // Sign up at https://web3forms.com/ to get your access key
    const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY;
    
    if (web3formsKey) {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: web3formsKey,
          subject: `Price Alert Set: ${productTitle}`,
          from_name: 'DealsHub',
          email: email,
          message: `
            ✅ Price Alert Confirmed!
            
            Product: ${productTitle}
            Current Price: $${currentPrice}
            Target Price: $${targetPrice}
            You'll Save: $${(currentPrice - targetPrice).toFixed(2)}
            
            We'll notify you when the price drops below $${targetPrice}.
            
            View Product: ${affiliateLink}
          `
        })
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Price alert created successfully' 
    });
  } catch (error) {
    console.error('Price alert error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create price alert' },
      { status: 500 }
    );
  }
}
