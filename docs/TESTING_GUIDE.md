# 🧪 Testing Guide

## Overview

This project uses **Jest** and **React Testing Library** for testing. Tests are critical for ensuring code quality, preventing regressions, and enabling confident refactoring.

---

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

All testing dependencies are included in `package.json`.

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## 📊 Coverage Requirements

We maintain **80%+ code coverage** for:
- Statements
- Branches
- Functions
- Lines

### Check Coverage

```bash
npm run test:coverage
```

Coverage reports are generated in:
- `coverage/lcov-report/index.html` (HTML report)
- `coverage/lcov.info` (for CI tools)

---

## 📝 Writing Tests

### File Structure

```
__tests__/
├── api/
│   └── newsletter/
│       └── subscribe.test.ts
├── components/
│   └── NewsletterPopup.test.tsx
└── lib/
    ├── rate-limit.test.ts
    └── env.test.ts
```

### Naming Convention

- Test files: `*.test.ts` or `*.test.tsx`
- Spec files: `*.spec.ts` or `*.spec.tsx`
- Place tests in `__tests__` directory

---

## 🛠️ API Route Testing

### Example: Newsletter API Test

```typescript
import { POST } from '@/app/api/newsletter/subscribe/route';
import { NextRequest } from 'next/server';

describe('/api/newsletter/subscribe', () => {
  test('successfully subscribes with valid data', async () => {
    const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
```

### Mocking fetch

```typescript
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;
mockFetch.mockResolvedValueOnce({
  ok: true,
  json: async () => ({ success: true }),
});
```

---

## ⚖️ Component Testing

### Example: Newsletter Popup Test

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewsletterPopup from '@/components/NewsletterPopup';

describe('NewsletterPopup', () => {
  test('renders popup after delay', async () => {
    render(<NewsletterPopup delay={100} />);
    
    // Should not be visible initially
    expect(screen.queryByTestId('newsletter-popup')).not.toBeInTheDocument();
    
    // Wait for popup to appear
    await waitFor(
      () => {
        expect(screen.getByTestId('newsletter-popup')).toBeInTheDocument();
      },
      { timeout: 200 }
    );
  });

  test('submits form successfully', async () => {
    const user = userEvent.setup();
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    ) as jest.Mock;
    
    render(<NewsletterPopup delay={0} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('newsletter-popup')).toBeInTheDocument();
    });
    
    // Fill form
    await user.type(screen.getByTestId('newsletter-name'), 'John Doe');
    await user.type(screen.getByTestId('newsletter-email'), 'john@example.com');
    await user.click(screen.getByTestId('newsletter-consent'));
    
    // Submit
    await user.click(screen.getByTestId('newsletter-submit'));
    
    // Verify success
    await waitFor(() => {
      expect(screen.getByText(/You're In!/i)).toBeInTheDocument();
    });
  });
});
```

---

## 💡 Best Practices

### 1. Use data-testid Attributes

```tsx
<button data-testid="submit-button">
  Submit
</button>
```

```typescript
const button = screen.getByTestId('submit-button');
```

### 2. Test User Behavior, Not Implementation

✅ **Good:**
```typescript
await user.click(screen.getByRole('button', { name: /submit/i }));
expect(screen.getByText(/success/i)).toBeInTheDocument();
```

❌ **Bad:**
```typescript
expect(component.state.isSubmitting).toBe(false);
```

### 3. Use waitFor for Async Operations

```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### 4. Clean Up After Tests

```typescript
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
```

### 5. Mock External Dependencies

```typescript
jest.mock('@/lib/analytics', () => ({
  trackEvent: jest.fn(),
}));
```

---

## 🐛 Debugging Tests

### 1. Use screen.debug()

```typescript
import { screen } from '@testing-library/react';

screen.debug(); // Prints current DOM
```

### 2. Run Single Test

```bash
npm test -- subscribe.test.ts
```

### 3. Run Tests in Watch Mode

```bash
npm run test:watch
```

Press `p` to filter by filename pattern.

### 4. Increase Test Timeout

```typescript
test('slow test', async () => {
  // test code
}, 30000); // 30 seconds
```

---

## 📊 Coverage Tips

### View Coverage Report

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

### Exclude Files from Coverage

In `jest.config.js`:

```javascript
collectCoverageFrom: [
  'components/**/*.{js,jsx,ts,tsx}',
  '!**/*.d.ts',
  '!**/node_modules/**',
],
```

### Focus on Critical Paths

 Priority files for testing:
- API routes (100% coverage)
- Forms and user inputs (100% coverage)
- Authentication logic (100% coverage)
- Payment flows (100% coverage)
- Utility functions (90%+ coverage)

---

## 🚀 CI/CD Integration

### Local Pre-commit Check

```bash
# Run before committing
npm test && npm run lint && npm run build
```

### GitHub Actions

Tests run automatically on:
- Every push to `main` or `develop`
- Every pull request

See `.github/workflows/ci.yml` for configuration.

---

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)

---

## ❓ Common Issues

### Issue: "Cannot find module"

**Solution:** Check path aliases in `jest.config.js`

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

### Issue: "localStorage is not defined"

**Solution:** Mock is in `jest.setup.js`

```javascript
global.localStorage = localStorageMock;
```

### Issue: "window.matchMedia is not a function"

**Solution:** Mock is in `jest.setup.js`

---

## ✅ Checklist Before PR

- [ ] All tests pass (`npm test`)
- [ ] Coverage >80% (`npm run test:coverage`)
- [ ] No console errors in tests
- [ ] Added tests for new features
- [ ] Updated existing tests if behavior changed
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)

---

**Happy Testing! 🧪**
