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

    console.log('📧 Sending newsletter subscription to Web3Forms:', email);

    // Web3Forms requires: access_key, name, email, message (all required)
    const formData = {
      access_key: accessKey,
      name: email.split('@')[0] || 'Newsletter Subscriber', // Use email username as name
      email: email,
      message: `Newsletter subscription request from DealsHub\n\nSubscribed at: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo', dateStyle: 'full', timeStyle: 'short' })}\nSource: Website Newsletter Popup`,
      subject: '🎉 New Newsletter Subscription - DealsHub',
      from_name: 'DealsHub',
    };

    console.log('📤 Sending data:', { ...formData, access_key: '***' });

    const web3FormsResponse = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const responseText = await web3FormsResponse.text();
    console.log('📥 Web3Forms raw response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse Web3Forms response:', parseError);
      return NextResponse.json(
        { 
          error: 'Invalid response from email service',
          success: false 
        },
        { status: 500 }
      );
    }

    console.log('📊 Web3Forms parsed response:', data);

    if (!web3FormsResponse.ok || !data.success) {
      console.error('❌ Web3Forms error:', data);
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
    console.error('💥 Newsletter subscription error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Subscription failed. Please try again.',
        success: false 
      },
      { status: 500 }
    );
  }
}
