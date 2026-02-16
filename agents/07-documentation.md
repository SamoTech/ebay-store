# 📚 Documentation Agent

## Role
Create and maintain comprehensive documentation for code, APIs, and user guides

## Responsibilities
- ✅ Write clear README files
- ✅ Document API endpoints
- ✅ Create code comments
- ✅ Maintain changelog
- ✅ Write user guides
- ✅ Update technical specs

## AI Prompt Template

```
You are a Documentation AI Agent for the DealsHub project.

Documentation Types:
1. Code Documentation (JSDoc, comments)
2. API Documentation (endpoints, parameters)
3. User Documentation (guides, tutorials)
4. Technical Documentation (architecture, setup)
5. Process Documentation (workflows, conventions)

Your responsibilities:
1. Keep all documentation up-to-date
2. Write clear and concise explanations
3. Include examples and use cases
4. Maintain consistency across docs
5. Document breaking changes

Documentation Standards:
- Use clear, simple language
- Include code examples
- Add screenshots/diagrams where helpful
- Keep README.md current
- Update CHANGELOG.md for releases
- Document all public APIs
```

## Documentation Templates

### 1. README.md Structure

```markdown
# Project Name

[Brief description - one sentence]

![Preview](./docs/preview.png)

## 🌟 Features

- Feature 1 with icon
- Feature 2 with icon
- Feature 3 with icon

## 🚀 Quick Start

### Prerequisites
```bash
- Node.js 18+
- npm or yarn
```

### Installation
```bash
git clone https://github.com/user/repo.git
cd repo
npm install
cp .env.example .env.local
# Add your API keys
npm run dev
```

## 📖 Documentation

- [API Documentation](./docs/API.md)
- [Development Guide](./docs/DEVELOPMENT.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🛠️ Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **Deployment:** Vercel

## 📁 Project Structure

```
├── app/
│   ├── api/          # API routes
│   ├── (routes)/     # Page routes
│   └── layout.tsx    # Root layout
├── components/       # React components
├── lib/             # Utilities
├── public/          # Static files
└── types/           # TypeScript types
```

## 🔧 Configuration

See [Configuration Guide](./docs/CONFIGURATION.md)

## 🧪 Testing

```bash
npm run test           # Run tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

## 📦 Deployment

See [Deployment Guide](./docs/DEPLOYMENT.md)

## 🤝 Contributing

Contributions welcome! See [Contributing Guide](./CONTRIBUTING.md)

## 📄 License

MIT © [Year] [Author]

## 🙏 Acknowledgments

- Thanks to contributors
- Inspiration sources
```

---

### 2. API Documentation

**File:** `docs/API.md`

```markdown
# API Documentation

## Base URL

```
https://dealshub.vercel.app/api
```

## Authentication

Currently, no authentication required for public endpoints.

---

## Endpoints

### Newsletter Subscription

Subscribe a user to the newsletter.

**Endpoint:** `POST /api/newsletter/subscribe`

**Request Body:**
```json
{
  "name": "string",        // Required, 2-100 characters
  "email": "string",       // Required, valid email format
  "message": "string"      // Optional, max 500 characters
}
```

**Success Response (200):**
```json
{
  "message": "Successfully subscribed to newsletter!",
  "email": "user@example.com",
  "success": true
}
```

**Error Response (400):**
```json
{
  "error": "Invalid email address",
  "success": false
}
```

**Error Response (500):**
```json
{
  "error": "Internal server error",
  "success": false
}
```

**Rate Limit:** 10 requests per minute per IP

**Example:**
```javascript
const response = await fetch('/api/newsletter/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'I want to receive deals!'
  })
});

const data = await response.json();
if (data.success) {
  console.log('Subscribed!');
}
```

**cURL Example:**
```bash
curl -X POST https://dealshub.vercel.app/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I want deals!"
  }'
```

---

### Products

Get list of products.

**Endpoint:** `GET /api/products`

**Query Parameters:**
- `category` (optional): Filter by category
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Example:**
```
GET /api/products?category=electronics&page=1&limit=20
```

**Success Response (200):**
```json
{
  "products": [
    {
      "id": 1,
      "title": "Product Name",
      "price": 99.99,
      "category": "electronics",
      "image": "https://...",
      "url": "https://ebay.com/..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized |
| 404 | Not Found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Rate Limiting

All endpoints are rate-limited to prevent abuse:

- **Public endpoints:** 100 requests per hour
- **Newsletter:** 10 requests per hour per email

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```
```

---

### 3. Component Documentation (JSDoc)

```typescript
/**
 * Newsletter subscription popup component
 * 
 * Displays after a configurable delay or on exit intent.
 * Collects user email for newsletter subscription.
 * 
 * @component
 * @example
 * ```tsx
 * <NewsletterPopup delay={30000} />
 * ```
 */
interface NewsletterPopupProps {
  /**
   * Delay in milliseconds before showing popup
   * @default 30000
   */
  delay?: number;
}

/**
 * Newsletter subscription form component
 * 
 * Features:
 * - Email validation
 * - Consent checkbox
 * - Loading states
 * - Error handling
 * - Success animation
 * 
 * @param {NewsletterPopupProps} props - Component props
 * @returns {JSX.Element | null} Popup element or null if not visible
 * 
 * @example
 * ```tsx
 * // Show after 30 seconds
 * <NewsletterPopup delay={30000} />
 * 
 * // Show immediately (for testing)
 * <NewsletterPopup delay={0} />
 * ```
 */
export default function NewsletterPopup({ 
  delay = 30000 
}: NewsletterPopupProps) {
  // Implementation
}

/**
 * Validates email format
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 * 
 * @example
 * ```typescript
 * validateEmail('user@example.com') // true
 * validateEmail('invalid') // false
 * ```
 */
function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

---

### 4. CHANGELOG.md

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Nothing yet

## [1.2.0] - 2026-02-16

### Added
- Newsletter subscription popup with Web3Forms integration
- Exit-intent detection for newsletter popup
- Consent checkbox for GDPR compliance
- Toast notifications for user feedback
- Analytics tracking for newsletter events

### Changed
- Updated Next.js to 16.1.6
- Improved mobile responsiveness
- Enhanced error messages

### Fixed
- Newsletter API JSON parsing error
- Form validation on Safari
- Memory leak in product list

### Security
- Added input sanitization
- Implemented rate limiting
- Updated dependencies for security patches

## [1.1.0] - 2026-02-01

### Added
- Product favoriting feature
- Recently viewed products
- Dark mode support

### Fixed
- Image loading on slow connections
- Price formatting for international currencies

## [1.0.0] - 2026-01-15

### Added
- Initial release
- eBay product integration
- Category browsing
- Product search
- Affiliate link tracking
- Google Analytics integration

[Unreleased]: https://github.com/user/repo/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/user/repo/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/user/repo/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/user/repo/releases/tag/v1.0.0
```

---

### 5. Development Guide

**File:** `docs/DEVELOPMENT.md`

```markdown
# Development Guide

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Git

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/SamoTech/ebay-store.git
   cd ebay-store
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Add your API keys to `.env.local`:
   ```env
   WEB3FORMS_ACCESS_KEY=your_key_here
   EBAY_APP_ID=your_app_id_here
   NEXT_PUBLIC_GA_ID=your_ga_id_here
   ```

5. Run development server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:3000

## Project Structure

```
ebay-store/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── newsletter/    # Newsletter endpoints
│   │   └── track/         # Analytics endpoint
│   ├── (routes)/          # Page routes
│   │   ├── page.tsx       # Homepage
│   │   └── blog/          # Blog pages
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── NewsletterPopup.tsx
│   ├── ProductCard.tsx
│   └── ...               
├── contexts/              # React contexts
│   ├── ToastContext.tsx
│   └── FavoritesContext.tsx
├── lib/                   # Utilities
│   ├── analytics.ts       # Analytics helper
│   ├── validation.ts      # Validation functions
│   └── ebay.ts           # eBay API client
├── types/                 # TypeScript types
│   └── index.ts
├── public/                # Static files
│   ├── images/
│   └── icons/
└── docs/                  # Documentation
    ├── API.md
    ├── DEPLOYMENT.md
    └── DEVELOPMENT.md
```

## Coding Standards

### TypeScript

- Always define types for props and state
- Use interfaces over types when possible
- Avoid `any` type

```typescript
// ✅ Good
interface Props {
  title: string;
  count: number;
}

// ❌ Bad
function Component(props: any) {
  // ...
}
```

### React Components

- Use functional components with hooks
- One component per file
- Use meaningful component names

```typescript
// ✅ Good
export default function ProductCard({ product }: Props) {
  return <div>...</div>;
}

// ❌ Bad
export default function PC({ p }: any) {
  return <div>...</div>;
}
```

### Styling

- Use Tailwind CSS classes
- Avoid inline styles
- Use design system tokens

```tsx
// ✅ Good
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
  Click me
</button>

// ❌ Bad
<button style={{ padding: '8px 16px', background: '#0066cc' }}>
  Click me
</button>
```

## Testing

### Running Tests

```bash
# All tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

### Writing Tests

```typescript
import { render, screen } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  test('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Git Workflow

### Branch Naming

```
feature/description   # New features
bugfix/description    # Bug fixes
hotfix/description    # Urgent fixes
chore/description     # Maintenance
```

### Commit Messages

Follow Conventional Commits:

```
feat: add newsletter popup
fix: resolve API error
docs: update README
style: format code
refactor: improve validation logic
test: add newsletter tests
chore: update dependencies
```

### Pull Request Process

1. Create feature branch
2. Make changes
3. Write tests
4. Update documentation
5. Create PR
6. Wait for review
7. Address feedback
8. Merge

## Debugging

### Client-Side

```typescript
// Use console.log (removed in production)
console.log('Debug:', data);

// Use React DevTools
// Browser extension for component inspection
```

### Server-Side

```typescript
// API routes
console.log('API called:', request.url);

// Check Vercel logs
// Dashboard → Deployments → Logs
```

## Common Issues

### Issue: Module not found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Type errors

```bash
# Run type check
npm run type-check
```

### Issue: Build fails

```bash
# Check for ESLint errors
npm run lint

# Fix automatically
npm run lint:fix
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
```

---

## Documentation Maintenance

### Weekly Tasks
- [ ] Update README if features added
- [ ] Update API docs if endpoints changed
- [ ] Update CHANGELOG for releases
- [ ] Review and fix broken links
- [ ] Update screenshots if UI changed

### Per Release
- [ ] Update version numbers
- [ ] Write release notes
- [ ] Update migration guides
- [ ] Tag documentation version

## Communication

**Documentation Updates:**
```
📚 Documentation Updated

Changes:
- Added API docs for new endpoint
- Updated README with new features
- Added troubleshooting guide

Files:
- docs/API.md
- README.md
- docs/TROUBLESHOOTING.md
```
