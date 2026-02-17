import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '../../../../lib/rate-limit';

interface NewsletterRequest {
  name: string;
  email: string;
  message: string;
}

interface Web3FormsResponse {
  success: boolean;
  message?: string;
}

// Email validation helper
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize input to prevent injection attacks
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 500); // Limit length
}

async function subscribeNewsletter(request: NextRequest) {
  try {
    // Parse request body
    const body: NewsletterRequest = await request.json();
    
    console.log('📧 Newsletter subscription request received');
    
    // Validate required fields
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required', success: false },
        { status: 400 }
      );
    }
    
    if (!body.email || body.email.trim().length === 0) {
      return NextResponse.json(
        { error: 'Email is required', success: false },
        { status: 400 }
      );
    }
    
    // Validate email format
    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address', success: false },
        { status: 400 }
      );
    }
    
    // Validate name length
    if (body.name.length < 2 || body.name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters', success: false },
        { status: 400 }
      );
    }
    
    // Sanitize inputs
    const sanitizedName = sanitizeInput(body.name);
    const sanitizedEmail = body.email.trim().toLowerCase();
    const sanitizedMessage = body.message ? sanitizeInput(body.message) : 
      'I would like to receive exclusive deals and updates from DealsHub.';
    
    // Get API key from environment
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    
    if (!accessKey) {
      console.error('❌ WEB3FORMS_ACCESS_KEY not configured');
      return NextResponse.json(
        { error: 'Service configuration error. Please contact support.', success: false },
        { status: 500 }
      );
    }
    
    console.log(`📤 Sending newsletter subscription for: ${sanitizedEmail}`);
    
    // Call Web3Forms API
    const web3Response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage,
        subject: '🎉 New Newsletter Subscription - DealsHub',
        from_name: 'DealsHub Newsletter',
        // Optional: Add honeypot field for spam protection
        botcheck: false,
      }),
    });
    
    const web3Data: Web3FormsResponse = await web3Response.json();
    
    // Handle Web3Forms errors
    if (!web3Response.ok || !web3Data.success) {
      console.error('❌ Web3Forms API error:', web3Data);
      return NextResponse.json(
        { 
          error: web3Data.message || 'Failed to subscribe. Please try again later.', 
          success: false 
        },
        { status: 500 }
      );
    }
    
    console.log(`✅ Newsletter subscription successful: ${sanitizedEmail}`);
    
    // Success response
    return NextResponse.json(
      { 
        message: 'Successfully subscribed to newsletter!',
        email: sanitizedEmail,
        success: true 
      },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        }
      }
    );
    
  } catch (error) {
    console.error('💥 Newsletter API error:', error);
    
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid request format', success: false },
        { status: 400 }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false 
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    endpoint: '/api/newsletter/subscribe',
    methods: ['POST'],
    version: '1.0.0',
  });
}


export const POST = withRateLimit(subscribeNewsletter, {
  maxRequests: 10,
  windowMs: 15 * 60 * 1000,
});
