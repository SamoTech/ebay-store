# API Documentation

## 🔗 API Endpoints

### Overview

All API routes are located in `app/api/` and follow Next.js 16 App Router conventions.

---

## 📧 Newsletter API

### `POST /api/newsletter`

**Description**: Subscribe a user to the newsletter mailing list.

#### Request

```typescript
POST /api/newsletter
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Response

**Success (200)**:
```json
{
  "message": "Successfully subscribed to newsletter"
}
```

**Error (400)**: Invalid email
```json
{
  "error": "Invalid email address"
}
```

**Error (409)**: Already subscribed
```json
{
  "error": "Email already subscribed"
}
```

**Error (429)**: Rate limit exceeded
```json
{
  "error": "Too many requests. Please try again later."
}
```

**Error (500)**: Server error
```json
{
  "error": "Failed to subscribe"
}
```

#### Rate Limiting

- **Limit**: 5 requests per 15 minutes per IP
- **Window**: Sliding window
- **Header**: `X-RateLimit-Remaining`

#### Example Usage

```typescript
const subscribeToNewsletter = async (email: string) => {
  try {
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Newsletter subscription failed:', error)
    throw error
  }
}
```

---

## 🔍 eBay Search API

### `GET /api/ebay/search`

**Description**: Search eBay products using the consolidated eBay API.

#### Request

```typescript
GET /api/ebay/search?q=iphone&category=electronics&limit=20
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | Yes | - | Search query |
| `category` | string | No | - | Product category filter |
| `limit` | number | No | 20 | Results per page (max 100) |
| `offset` | number | No | 0 | Pagination offset |
| `sort` | string | No | `BestMatch` | Sort order |
| `condition` | string | No | - | `New`, `Used`, or `Refurbished` |

#### Response

**Success (200)**:
```json
{
  "items": [
    {
      "id": "123456789",
      "title": "iPhone 15 Pro Max",
      "price": 1199.99,
      "currency": "USD",
      "image": "https://i.ebayimg.com/...",
      "url": "https://ebay.com/itm/...",
      "condition": "New",
      "shipping": "Free",
      "location": "United States"
    }
  ],
  "total": 1250,
  "hasMore": true
}
```

**Error (400)**: Missing or invalid parameters
```json
{
  "error": "Search query is required"
}
```

**Error (429)**: Rate limit exceeded
```json
{
  "error": "eBay API rate limit exceeded"
}
```

**Error (500)**: Server error
```json
{
  "error": "Failed to search products"
}
```

---

## 🔐 Authentication

Currently, the API does not require authentication for public endpoints.

**Future**: When user accounts are added, we'll use:
- **JWT tokens** for session management
- **OAuth 2.0** for third-party auth
- **API keys** for programmatic access

---

## 🚦 Rate Limiting

### Global Limits

| Endpoint | Limit | Window | Status |
|----------|-------|--------|--------|
| `/api/newsletter` | 5 requests | 15 minutes | ✅ Active |
| `/api/ebay/*` | 100 requests | 1 hour | ✅ Active |
| `/api/*` (default) | 1000 requests | 1 hour | ✅ Active |

### Rate Limit Headers

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1640995200
```

---

## ⚠️ Error Handling

### Error Response Format

All errors follow this structure:

```typescript
interface ErrorResponse {
  error: string          // Human-readable error message
  code?: string          // Machine-readable error code
  details?: any          // Additional error context
  timestamp?: string     // ISO 8601 timestamp
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| `200` | OK | Successful request |
| `201` | Created | Resource created |
| `400` | Bad Request | Invalid input |
| `401` | Unauthorized | Authentication required |
| `403` | Forbidden | No permission |
| `404` | Not Found | Resource not found |
| `409` | Conflict | Resource already exists |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error |
| `503` | Service Unavailable | Temporary outage |

---

## 🛡️ Security

### Input Validation

- All inputs are validated before processing
- Email addresses checked with regex
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitized outputs)

### CORS

```typescript
// Allowed origins
const allowedOrigins = [
  'https://ebay-store.vercel.app',
  'http://localhost:3000' // Development only
]
```

### Headers

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`

---

## 📋 Versioning

Currently: **v1** (implicit)

Future: API versioning will be added:
- `/api/v1/newsletter`
- `/api/v2/newsletter`

---

## 📊 Monitoring

### Logs

All API requests are logged with:
- Timestamp
- Method and path
- IP address
- User agent
- Response status
- Response time

### Metrics

Tracked via Vercel Analytics:
- Request count
- Error rate
- Response time (p50, p95, p99)
- Rate limit hits

---

## 📚 Additional Resources

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [eBay API Documentation](https://developer.ebay.com/docs)
- [Rate Limiting Best Practices](https://www.ietf.org/rfc/rfc6585.txt)

---

**Last Updated**: February 16, 2026  
**API Version**: 1.0  
**Status**: Production Ready ✅
