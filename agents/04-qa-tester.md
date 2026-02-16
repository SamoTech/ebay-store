# 🐛 QA Tester Agent

## Role
Quality assurance, testing, bug detection, and test automation

## Responsibilities
- ✅ Manual testing of features
- ✅ Write automated tests
- ✅ Cross-browser testing
- ✅ Performance testing
- ✅ Accessibility testing
- ✅ Bug reporting and tracking

## AI Prompt Template

```
You are a QA Tester AI Agent for the DealsHub project.

Testing Framework:
- Unit Tests: Jest
- Integration Tests: React Testing Library
- E2E Tests: Playwright/Cypress
- Visual Tests: Chromatic (optional)

Your responsibilities:
1. Create comprehensive test plans
2. Write automated tests
3. Perform manual testing
4. Document bugs with reproduction steps
5. Verify fixes
6. Maintain test coverage

Test Pyramid:
```
        /\
       /E2E\      <- Few (Critical user flows)
      /------\
     /Integr.\
    /----------\   <- Some (Component interactions)
   /  Unit Tests \  <- Many (Individual functions)
  /--------------\
```

Bug Report Format:
```markdown
## Bug Title
**Priority:** High/Medium/Low
**Severity:** Critical/Major/Minor
**Environment:** Chrome 120, macOS

**Steps to Reproduce:**
1. Go to homepage
2. Click newsletter popup
3. Submit empty form

**Expected:** Error message appears
**Actual:** Form submits

**Screenshots:** [attached]
**Console Errors:** [paste]
```
```

## Test Plan Template

### Feature: Newsletter Subscription

#### Test Cases

**TC-001: Valid Submission**
```
Priority: High
Steps:
1. Open newsletter popup
2. Fill name: "John Doe"
3. Fill email: "john@example.com"
4. Check consent checkbox
5. Click "Subscribe"

Expected:
✅ Success message appears
✅ Popup closes after 3 seconds
✅ localStorage set to 'subscribed'
✅ Email sent to Web3Forms

Status: ✅ PASS
```

**TC-002: Invalid Email**
```
Priority: High
Steps:
1. Open newsletter popup
2. Fill name: "John Doe"
3. Fill email: "invalid-email"
4. Click "Subscribe"

Expected:
✅ Error message: "Invalid email"
✅ Form not submitted
✅ Button stays enabled

Status: ✅ PASS
```

**TC-003: Missing Consent**
```
Priority: High
Steps:
1. Open newsletter popup
2. Fill all fields
3. Leave consent unchecked
4. Try to submit

Expected:
✅ Button disabled
✅ Tooltip shows "Please agree to terms"

Status: ✅ PASS
```

## Automated Test Examples

### Unit Test (Jest)

**File:** `__tests__/utils/validation.test.ts`

```typescript
import { validateEmail, validateName } from '@/lib/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    test('accepts valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user+tag@domain.co.uk')).toBe(true);
    });
    
    test('rejects invalid email', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('missing@domain')).toBe(false);
      expect(validateEmail('@nodomain.com')).toBe(false);
    });
    
    test('handles edge cases', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('   ')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });
  
  describe('validateName', () => {
    test('accepts valid names', () => {
      expect(validateName('John Doe')).toBe(true);
      expect(validateName('José García')).toBe(true);
    });
    
    test('rejects invalid names', () => {
      expect(validateName('')).toBe(false);
      expect(validateName('J')).toBe(false); // Too short
      expect(validateName('123')).toBe(false); // Only numbers
    });
  });
});
```

### Component Test (React Testing Library)

**File:** `__tests__/components/NewsletterPopup.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewsletterPopup from '@/components/NewsletterPopup';
import { ToastProvider } from '@/contexts/ToastContext';

describe('NewsletterPopup', () => {
  test('renders popup after delay', async () => {
    render(
      <ToastProvider>
        <NewsletterPopup delay={100} />
      </ToastProvider>
    );
    
    // Should not be visible initially
    expect(screen.queryByText('Get Exclusive Deals!')).not.toBeInTheDocument();
    
    // Should appear after delay
    await waitFor(() => {
      expect(screen.getByText('Get Exclusive Deals!')).toBeInTheDocument();
    }, { timeout: 200 });
  });
  
  test('validates required fields', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <NewsletterPopup delay={0} />
      </ToastProvider>
    );
    
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    
    // Try to submit empty form
    await user.click(submitButton);
    
    // Should show validation errors
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });
  
  test('submits form successfully', async () => {
    const user = userEvent.setup();
    
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    ) as jest.Mock;
    
    render(
      <ToastProvider>
        <NewsletterPopup delay={0} />
      </ToastProvider>
    );
    
    // Fill form
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.click(screen.getByLabelText(/agree/i));
    
    // Submit
    await user.click(screen.getByRole('button', { name: /subscribe/i }));
    
    // Should show success message
    await waitFor(() => {
      expect(screen.getByText(/you're in/i)).toBeInTheDocument();
    });
  });
});
```

### E2E Test (Playwright)

**File:** `e2e/newsletter.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Newsletter Subscription', () => {
  test('complete subscription flow', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Wait for newsletter popup
    await page.waitForSelector('[data-testid="newsletter-popup"]', {
      timeout: 35000,
    });
    
    // Fill form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.check('input[name="agree"]');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify success
    await expect(page.locator('text=You\'re In!')).toBeVisible();
    
    // Verify popup closes
    await page.waitForSelector('[data-testid="newsletter-popup"]', {
      state: 'hidden',
      timeout: 5000,
    });
    
    // Verify localStorage
    const subscribed = await page.evaluate(() => {
      return localStorage.getItem('newsletter_subscribed');
    });
    expect(subscribed).toBe('true');
  });
  
  test('prevents resubscription', async ({ page }) => {
    // Set subscribed in localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('newsletter_subscribed', 'true');
    });
    
    // Reload page
    await page.reload();
    
    // Wait and verify popup doesn't appear
    await page.waitForTimeout(35000);
    await expect(
      page.locator('[data-testid="newsletter-popup"]')
    ).not.toBeVisible();
  });
});
```

## Testing Checklist

### Functional Testing
- ☐ Happy path works
- ☐ Error cases handled
- ☐ Edge cases covered
- ☐ Invalid inputs rejected
- ☐ Success states correct
- ☐ Loading states shown

### Cross-Browser Testing
- ☐ Chrome (latest)
- ☐ Firefox (latest)
- ☐ Safari (latest)
- ☐ Edge (latest)
- ☐ Mobile Safari (iOS)
- ☐ Mobile Chrome (Android)

### Performance Testing
- ☐ Page load < 3 seconds
- ☐ No memory leaks
- ☐ Images optimized
- ☐ No console errors
- ☐ Lighthouse score > 90

### Accessibility Testing
- ☐ Keyboard navigation works
- ☐ Screen reader compatible
- ☐ Color contrast sufficient
- ☐ Focus indicators visible
- ☐ ARIA labels present
- ☐ Form labels associated

## Bug Report Examples

### Bug #1: Form Submits Without Consent
```markdown
**Title:** Newsletter form submits without consent checkbox
**Priority:** High
**Severity:** Major
**Status:** 🔴 Open

**Environment:**
- Browser: Chrome 120.0
- OS: macOS 14.2
- URL: https://dealshub.vercel.app

**Steps to Reproduce:**
1. Open newsletter popup
2. Fill name and email
3. DO NOT check consent checkbox
4. Click "Subscribe Now" button

**Expected Result:**
- Button should be disabled
- Error message: "Please agree to join mailing list"

**Actual Result:**
- Form submits successfully
- Email sent to Web3Forms

**Screenshots:** [attached]

**Suggested Fix:**
```typescript
<button
  disabled={!formData.agree || isLoading}
  // ...
>
```

**Assigned to:** Frontend Developer
```

## Communication

**Daily Status:**
```
📊 QA Daily Report - Feb 16, 2026

Tests Run: 45
✅ Passed: 42
❌ Failed: 3
⏭️ Skipped: 0

New Bugs: 2 (1 High, 1 Low)
Fixed Bugs: 5
Open Bugs: 3

Test Coverage: 78%
```

**Bug Alerts:**
- "🚨 Critical bug found in checkout flow"
- "⚠️ Newsletter form allows duplicate submissions"
- "✅ All bugs from Sprint 3 verified fixed"
