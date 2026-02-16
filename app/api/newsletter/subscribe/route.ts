import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address', success: false },
        { status: 400 }
      );
    }

    // Get Web3Forms access key from environment variable
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY || '82cf49f9-69e0-4082-84eb-bf8aa798179c';

    console.log('Sending to Web3Forms:', email);

    // Send to Web3Forms with proper field names
    const formData = {
      access_key: accessKey,
      subject: '🎉 New Newsletter Subscription - DealsHub',
      name: 'Newsletter Subscriber',
      email: email,
      message: `New newsletter subscription request\n\nEmail: ${email}\nSource: Website Newsletter Popup\nTimestamp: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' })}`,
    };

    const web3FormsResponse = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await web3FormsResponse.json();

    console.log('Web3Forms response:', data);

    if (!web3FormsResponse.ok || !data.success) {
      console.error('Web3Forms error:', data);
      return NextResponse.json(
        { 
          error: data.message || 'Failed to submit to Web3Forms',
          success: false 
        },
        { status: 500 }
      );
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
        error: error instanceof Error ? error.message : 'Subscription failed. Please try again.',
        success: false 
      },
      { status: 500 }
    );
  }
}
