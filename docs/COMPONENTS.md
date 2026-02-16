# Component Documentation

## 🧩 Component Library

### Overview

DealsHub uses 19 reusable React components built with TypeScript, Tailwind CSS, and Next.js 16 best practices.

---

## 🚨 Error Handling

### `<ErrorBoundary>`

**Purpose**: Catch JavaScript errors anywhere in the component tree.

**Props**:
```typescript
interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}
```

**Usage**:
```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'

<ErrorBoundary
  fallback={<CustomError />}
  onError={(error, info) => logToSentry(error, info)}
>
  <YourComponent />
</ErrorBoundary>
```

**Features**:
- Graceful error handling
- Custom fallback UI
- Error logging integration
- Try Again functionality

---

### `<PageErrorBoundary>`

**Purpose**: Full-page error boundary with consistent styling.

**Usage**:
```tsx
import { PageErrorBoundary } from '@/components/ErrorBoundary'

<PageErrorBoundary>
  <YourPage />
</PageErrorBoundary>
```

---

### `<ComponentErrorBoundary>`

**Purpose**: Component-level error boundary for isolated failures.

**Props**:
```typescript
interface Props {
  children: ReactNode
  componentName?: string
}
```

**Usage**:
```tsx
<ComponentErrorBoundary componentName="ProductCard">
  <ProductCard product={product} />
</ComponentErrorBoundary>
```

---

## 🏪 Layout Components

### `<Header>`

**Purpose**: Site-wide navigation header.

**Features**:
- Logo and branding
- Category navigation
- Search bar integration
- Mobile menu
- Dark mode toggle
- Favorites counter

**Usage**:
```tsx
import Header from '@/components/Header'

<Header />
```

**Accessibility**:
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus trap in mobile menu
- Skip to content link

---

### `<Footer>`

**Purpose**: Site-wide footer with links and information.

**Features**:
- Quick links
- Category links
- Legal links
- Social media icons
- Newsletter signup
- Copyright information

**Usage**:
```tsx
import Footer from '@/components/Footer'

<Footer />
```

---

## 🛒 Product Components

### `<ProductCard>`

**Purpose**: Display product summary in grid/list views.

**Props**:
```typescript
interface Props {
  product: Product
  priority?: boolean
}

interface Product {
  id: string | number
  title: string
  price: number
  currency: string
  image: string
  url: string
  description?: string
  category: string
  condition?: 'New' | 'Used' | 'Refurbished'
  shipping?: string
  originalPrice?: number
}
```

**Usage**:
```tsx
import ProductCard from '@/components/ProductCard'

<ProductCard product={product} priority={false} />
```

**Features**:
- Product image with blur placeholder
- Price display with discount
- Favorite button
- Condition badge
- Shipping info
- Responsive design

---

### `<ProductPageClient>`

**Purpose**: Client-side product page interactions.

**Features**:
- Image gallery
- Add to favorites
- Share functionality
- Price tracking
- Related products

---

### `<RelatedProducts>`

**Purpose**: Show similar or related products.

**Props**:
```typescript
interface Props {
  currentProduct: Product
  maxItems?: number
}
```

**Usage**:
```tsx
<RelatedProducts currentProduct={product} maxItems={4} />
```

---

## 🔍 Search Components

### `<SearchBar>`

**Purpose**: Global product search with autocomplete.

**Features**:
- Real-time search
- Autocomplete suggestions
- Search history
- Voice search integration
- Keyboard shortcuts (Cmd+K)

**Usage**:
```tsx
import SearchBar from '@/components/SearchBar'

<SearchBar />
```

**Accessibility**:
- `role="search"`
- `aria-label="Search products"`
- `aria-expanded` for dropdown
- `aria-live` for results

---

### `<VoiceSearch>`

**Purpose**: Voice-activated search.

**Props**:
```typescript
interface Props {
  onResult: (transcript: string) => void
}
```

**Usage**:
```tsx
<VoiceSearch onResult={(text) => handleSearch(text)} />
```

---

### `<FilterSidebar>`

**Purpose**: Product filtering and sorting.

**Features**:
- Price range filter
- Category filter
- Condition filter
- Sort options
- Reset filters

---

## 💬 Social Components

### `<SocialShare>`

**Purpose**: Share products on social media.

**Props**:
```typescript
interface Props {
  url: string
  title: string
  description?: string
  hashtags?: string[]
}
```

**Usage**:
```tsx
<SocialShare
  url="https://example.com/product/123"
  title="Check out this deal!"
  description="Amazing product at great price"
  hashtags={['DealsHub', 'eBayDeals']}
/>
```

**Platforms**:
- Twitter/X
- Facebook
- LinkedIn
- WhatsApp
- Reddit
- Email
- Copy link

---

### `<ShareButton>`

**Purpose**: Simple share button with native share API fallback.

**Usage**:
```tsx
import ShareButton from '@/components/ShareButton'

<ShareButton url={productUrl} title={productTitle} />
```

---

## 📊 Analytics Components

### `<GoogleAnalytics>`

**Purpose**: Google Analytics 4 integration.

**Usage**:
```tsx
import GoogleAnalytics from '@/components/GoogleAnalytics'

<GoogleAnalytics />
```

**Environment**:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🌐 Navigation Components

### `<CategoryPageClient>`

**Purpose**: Client-side category page with filtering.

**Features**:
- Product grid
- Filter sidebar
- Pagination
- Sort options
- Loading states

---

## 🔔 Notification Components

### Toast System

**Context**: `ToastContext`

**Usage**:
```tsx
import { useToast } from '@/contexts/ToastContext'

const { showToast } = useToast()

showToast('Product added to favorites!', 'success')
showToast('An error occurred', 'error')
showToast('Please log in', 'warning')
showToast('Item saved', 'info')
```

---

## ⭐ Special Features

### `<DealOfTheDay>`

**Purpose**: Highlight today's best deal.

**Features**:
- Countdown timer
- Prominent CTA
- Animated background
- Auto-rotates daily

---

### `<TrustBadges>`

**Purpose**: Display trust signals.

**Features**:
- Secure checkout
- Money-back guarantee
- Fast shipping
- Customer support

---

### `<Chatbot>`

**Purpose**: AI shopping assistant.

**Features**:
- Product recommendations
- Price comparisons
- Shopping help
- Deal alerts

---

### `<PriceAlertForm>`

**Purpose**: Set price drop alerts.

**Props**:
```typescript
interface Props {
  productId: string
  currentPrice: number
}
```

---

## 🎨 Loading States

### `<ProductSkeleton>`

**Purpose**: Loading placeholder for product cards.

**Usage**:
```tsx
import ProductSkeleton from '@/components/ProductSkeleton'

<ProductSkeleton />
```

---

### `<BlogSkeleton>`

**Purpose**: Loading placeholder for blog posts.

**Usage**:
```tsx
import BlogSkeleton from '@/components/BlogSkeleton'

<BlogSkeleton />
```

---

## 🎯 Best Practices

### Component Structure

```tsx
/**
 * Component Description
 * 
 * @example
 * <ComponentName prop1="value" prop2={123} />
 */
'use client' // Only if needed

import { ... } from '...'

interface Props {
  // Props with JSDoc comments
}

export default function ComponentName({ prop1, prop2 }: Props) {
  // Component logic
  
  return (
    // JSX
  )
}
```

### Naming Conventions

- **Components**: PascalCase (`ProductCard.tsx`)
- **Props interfaces**: `Props` or `ComponentNameProps`
- **Hooks**: camelCase starting with `use` (`useProducts`)
- **Utils**: camelCase (`formatPrice`)

### Accessibility

- Always include `alt` text for images
- Use semantic HTML (`<nav>`, `<main>`, `<article>`)
- Add ARIA labels where needed
- Ensure keyboard navigation
- Test with screen readers

---

**Last Updated**: February 16, 2026  
**Components**: 19 total  
**Test Coverage**: 65%+ ✅
