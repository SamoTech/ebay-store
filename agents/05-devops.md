# 🚀 DevOps Agent

## Role
Deployment, CI/CD, infrastructure, monitoring, and environment management

## Responsibilities
- ✅ Setup and maintain CI/CD pipelines
- ✅ Manage deployments (Vercel)
- ✅ Configure environment variables
- ✅ Monitor application health
- ✅ Setup error tracking
- ✅ Performance monitoring

## AI Prompt Template

```
You are a DevOps AI Agent for the DealsHub project.

Infrastructure:
- Hosting: Vercel
- Repository: GitHub (SamoTech/ebay-store)
- CI/CD: GitHub Actions + Vercel Auto-Deploy
- Monitoring: Vercel Analytics, Sentry (planned)
- Database: TBD (PostgreSQL on Vercel/Supabase)

Your responsibilities:
1. Ensure smooth deployments
2. Maintain environment configurations
3. Monitor application performance
4. Setup alerting for errors
5. Optimize build times
6. Manage secrets securely

Deployment Checklist:
☐ Environment variables configured
☐ Build succeeds locally
☐ Tests pass
☐ No console errors
☐ TypeScript compiles
☐ Production build optimized
☐ Domain configured
☐ SSL certificate active
```

## Deployment Guide

### Vercel Configuration

**File:** `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

### Environment Variables

**Required for Production:**

```bash
# Vercel Dashboard → Settings → Environment Variables

# Web3Forms (Newsletter)
WEB3FORMS_ACCESS_KEY=82cf49f9-69e0-4082-84eb-bf8aa798179c

# eBay Partner Network
EBAY_APP_ID=your_app_id_here
EBAY_CERT_ID=your_cert_id_here
EBAY_CAMPAIGN_ID=your_campaign_id_here

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Database (when ready)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Error Tracking (optional)
SENTRY_DSN=https://xxx@sentry.io/xxx
```

**Setup Script:**
```bash
#!/bin/bash
# setup-env.sh

echo "Setting up environment variables..."

vercel env add WEB3FORMS_ACCESS_KEY production
vercel env add EBAY_APP_ID production
vercel env add NEXT_PUBLIC_GA_ID production

echo "✅ Environment variables configured!"
```

### GitHub Actions CI/CD

**File:** `.github/workflows/ci.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run tests
        run: npm run test
      
      - name: Build
        run: npm run build
        env:
          WEB3FORMS_ACCESS_KEY: ${{ secrets.WEB3FORMS_ACCESS_KEY }}
          EBAY_APP_ID: ${{ secrets.EBAY_APP_ID }}
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Monitoring Setup

**1. Vercel Analytics**
```typescript
// Already integrated via Next.js
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**2. Error Tracking (Sentry)**

**File:** `sentry.client.config.ts`
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // Filter out known errors
    if (event.exception) {
      const message = event.exception.values?.[0]?.value;
      if (message?.includes('ResizeObserver')) {
        return null; // Ignore browser quirks
      }
    }
    return event;
  },
});
```

**3. Performance Monitoring**

**File:** `middleware.ts`
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const start = Date.now();
  const response = NextResponse.next();
  
  // Add performance headers
  response.headers.set('X-Response-Time', `${Date.now() - start}ms`);
  
  // Log slow requests
  const duration = Date.now() - start;
  if (duration > 1000) {
    console.warn(`Slow request: ${request.url} (${duration}ms)`);
  }
  
  return response;
}
```

### Health Check Endpoint

**File:** `app/api/health/route.ts`
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV,
  };
  
  // Check external services
  const checks = {
    web3forms: await checkWeb3Forms(),
    ebay: await checkEbayAPI(),
  };
  
  const allHealthy = Object.values(checks).every(v => v);
  
  return NextResponse.json(
    { ...health, services: checks },
    { status: allHealthy ? 200 : 503 }
  );
}

async function checkWeb3Forms() {
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'HEAD',
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function checkEbayAPI() {
  // Add eBay API health check
  return true;
}
```

## Deployment Workflow

### Development Flow
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes
# ...

# 3. Test locally
npm run dev
npm run test
npm run build

# 4. Commit and push
git add .
git commit -m "✨ Add new feature"
git push origin feature/new-feature

# 5. Create Pull Request
# Vercel creates preview deployment automatically

# 6. After review, merge to main
# Vercel deploys to production automatically
```

### Rollback Procedure
```bash
# Quick rollback via Vercel
vercel rollback

# Or via Git
git revert HEAD
git push origin main
```

## Monitoring Dashboards

### Daily Health Check
```
🏥 System Health - Feb 16, 2026

✅ Deployment: Success
✅ Uptime: 99.9%
✅ Response Time: 245ms avg
✅ Error Rate: 0.02%
⚠️ Memory Usage: 82% (monitor)

🚀 Latest Deploy:
Commit: 5c55980
Time: 2 hours ago
Status: Live
```

### Alert Configuration
```yaml
# alerts.yml
alerts:
  - name: High Error Rate
    condition: error_rate > 1%
    action: notify_team
    
  - name: Slow Response
    condition: avg_response_time > 1000ms
    action: notify_devops
    
  - name: Deployment Failed
    condition: build_status == 'failed'
    action: notify_all
```

## Backup & Recovery

### Database Backup (When implemented)
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.sql"

pg_dump $DATABASE_URL > $BACKUP_FILE
aws s3 cp $BACKUP_FILE s3://dealshub-backups/

echo "✅ Backup completed: $BACKUP_FILE"
```

## Communication

**Deploy Notifications:**
```
🚀 Deployment Started
Branch: main
Commit: 5c55980 "✨ Add newsletter form"
Environment: Production
ETA: 2 minutes

---

✅ Deployment Successful!
URL: https://dealshub.vercel.app
Time: 1m 34s
Status: All checks passed
```

**Incident Alerts:**
```
🚨 ALERT: High Error Rate
Service: Newsletter API
Error Rate: 5.2%
Time: Last 5 minutes
Action: Investigating...
```
