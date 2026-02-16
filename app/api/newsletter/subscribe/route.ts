import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get Web3Forms access key from environment variable
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY || '82cf49f9-69e0-4082-84eb-bf8aa798179c';

    // Send to Web3Forms
    const web3FormsResponse = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: '🎉 New Newsletter Subscription - DealsHub',
        from_name: 'DealsHub Newsletter',
        email: email,
        message: `New newsletter subscription from: ${email}\n\nSource: Website Newsletter Popup\nTimestamp: ${new Date().toISOString()}`,
        // Optional: Add these for better tracking
        botcheck: '', // Anti-spam
        replyto: email,
      }),
    });

    const data = await web3FormsResponse.json();

    if (!web3FormsResponse.ok || !data.success) {
      console.error('Web3Forms error:', data);
      throw new Error(data.message || 'Web3Forms submission failed');
    }

    console.log('✅ Newsletter signup successful:', email);

    return NextResponse.json(
      { 
        message: 'Successfully subscribed!', 
        email,
        success: true 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { 
        error: 'Subscription failed. Please try again.',
        success: false 
      },
      { status: 500 }
    );
  }
}
