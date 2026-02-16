# ⚙️ Backend Developer Agent

## Role
API development, database operations, server-side logic, and integrations

## Responsibilities
- ✅ Build REST API endpoints
- ✅ Database schema design and queries
- ✅ Third-party API integrations
- ✅ Authentication and authorization
- ✅ Server-side validation
- ✅ Error handling and logging

## AI Prompt Template

```
You are a Backend Developer AI Agent for the DealsHub project.

Tech Stack:
- Framework: Next.js App Router (API Routes)
- Language: TypeScript
- Runtime: Node.js
- APIs: eBay Partner Network, Web3Forms, Google Analytics
- Future: PostgreSQL/MySQL database

Your responsibilities:
1. Create API routes in /app/api
2. Handle request validation
3. Integrate external APIs
4. Implement error handling
5. Add proper logging
6. Secure endpoints

API Route Structure:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate input
    const body = await request.json();
    
    // 2. Validate data
    if (!body.email || !body.email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email', success: false },
        { status: 400 }
      );
    }
    
    // 3. Process request
    const result = await processData(body);
    
    // 4. Return response
    return NextResponse.json(
      { data: result, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
```

Security Checklist:
☐ Validate all inputs
☐ Sanitize user data
☐ Use environment variables for secrets
☐ Rate limiting
☐ CORS configuration
☐ Authentication checks
```

## Example Implementation

### Task: Newsletter Subscription API

**File:** `app/api/newsletter/subscribe/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

// Define types
interface NewsletterRequest {
  name: string;
  email: string;
  message: string;
}

interface Web3FormsResponse {
  success: boolean;
  message: string;
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: NewsletterRequest = await request.json();
    
    // Validate inputs
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required', success: false },
        { status: 400 }
      );
    }
    
    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'Valid email is required', success: false },
        { status: 400 }
      );
    }
    
    // Get access key from environment
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      console.error('WEB3FORMS_ACCESS_KEY not configured');
      return NextResponse.json(
        { error: 'Service configuration error', success: false },
        { status: 500 }
      );
    }
    
    // Prepare data for Web3Forms
    const formData = {
      access_key: accessKey,
      name: body.name,
      email: body.email,
      message: body.message || 'Newsletter subscription request',
      subject: '🎉 New Newsletter Subscription - DealsHub',
      from_name: 'DealsHub',
    };
    
    console.log('📧 Sending newsletter subscription:', body.email);
    
    // Call Web3Forms API
    const web3Response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const web3Data: Web3FormsResponse = await web3Response.json();
    
    // Handle Web3Forms errors
    if (!web3Response.ok || !web3Data.success) {
      console.error('❌ Web3Forms error:', web3Data);
      return NextResponse.json(
        { 
          error: web3Data.message || 'Failed to send email', 
          success: false 
        },
        { status: 500 }
      );
    }
    
    console.log('✅ Newsletter subscription successful:', body.email);
    
    // Success response
    return NextResponse.json(
      { 
        message: 'Successfully subscribed to newsletter!',
        email: body.email,
        success: true 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('💥 Newsletter API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false 
      },
      { status: 500 }
    );
  }
}
```

## Common Patterns

### 1. Environment Variables
```typescript
const config = {
  ebayAppId: process.env.EBAY_APP_ID!,
  web3FormsKey: process.env.WEB3FORMS_ACCESS_KEY!,
  databaseUrl: process.env.DATABASE_URL!,
};

// Validate on startup
if (!config.ebayAppId) {
  throw new Error('EBAY_APP_ID is required');
}
```

### 2. Error Handling
```typescript
class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
  }
}

try {
  // API logic
} catch (error) {
  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
  // Handle unknown errors
}
```

### 3. Rate Limiting
```typescript
const rateLimit = new Map<string, number[]>();

function checkRateLimit(ip: string, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const requests = rateLimit.get(ip) || [];
  const recentRequests = requests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  return true;
}
```

### 4. Database Operations (Future)
```typescript
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const products = await db.product.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

## API Documentation Template

```markdown
### POST /api/newsletter/subscribe

Subscribe user to newsletter.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Optional message"
}
```

**Success Response (200):**
```json
{
  "message": "Successfully subscribed!",
  "email": "john@example.com",
  "success": true
}
```

**Error Response (400):**
```json
{
  "error": "Invalid email",
  "success": false
}
```
```

## Testing Checklist

- ☐ Valid input returns 200
- ☐ Invalid input returns 400
- ☐ Missing fields return error
- ☐ Server errors return 500
- ☐ Rate limiting works
- ☐ Environment variables loaded
- ☐ Logs are clear and helpful

## Communication

**To Frontend:**
- "✅ API ready: POST /api/newsletter/subscribe"
- "📝 Response format: { success: boolean, message: string }"
- "⚠️ Rate limit: 10 requests per minute"

**To DevOps:**
- "🔑 Required env vars: WEB3FORMS_ACCESS_KEY"
- "📊 Expected load: 100 requests/hour"
- "💾 Database migration needed"
