import { NextRequest, NextResponse } from 'next/server';

// TODO: Connect to your email service provider
// Mailchimp: https://mailchimp.com/developer/marketing/api/
// ConvertKit: https://developers.convertkit.com/
// SendGrid: https://docs.sendgrid.com/
// Brevo (Sendinblue): https://developers.brevo.com/

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

    // TODO: Add to your email service
    // Example for Mailchimp:
    /*
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER; // e.g., us1
    const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;

    const response = await fetch(
      `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          tags: ['website_popup'],
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Mailchimp API error');
    }
    */

    // For now, just log and return success
    console.log('Newsletter signup:', email);

    // TODO: Store in database
    // await db.newsletterSubscribers.create({ email, source: 'popup', createdAt: new Date() });

    return NextResponse.json(
      { message: 'Successfully subscribed!', email },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Subscription failed. Please try again.' },
      { status: 500 }
    );
  }
}
