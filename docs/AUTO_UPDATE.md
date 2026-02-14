# 🤖 Automatic Daily Updates

This project uses **Vercel Cron Jobs** to automatically update the website content every day. No GitHub Actions required!

## What Gets Updated Daily

- **Timestamp**: Shows when products were last refreshed
- **Featured Products**: Rotates to display different products each day
- **Trending Category**: Highlights a different category daily
- **Fresh Content**: Keeps the site looking active and up-to-date

## Setup Instructions

### 1. Configure Vercel Environment Variables

Go to your Vercel project dashboard → Settings → Environment Variables

Add these variables:

| Variable Name | Value | How to Get It |
|--------------|-------|---------------|
| `GITHUB_TOKEN` | Your token | GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token with `repo` scope |
| `VERCEL_DEPLOY_HOOK` | Deploy hook URL | Vercel → Project → Settings → Git → Deploy Hooks → Create hook |
| `CRON_SECRET` | Random string | Generate a random string (for manual trigger security) |

**Important:** After adding environment variables, redeploy your project!

### 2. How to Create GitHub Token
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: ✅ `repo` (Full control of private repositories)
4. Generate and copy the token
5. Add to Vercel environment variables as `GITHUB_TOKEN`

### 3. How to Create Vercel Deploy Hook
1. Go to Vercel → Your Project → Settings → Git
2. Scroll to "Deploy Hooks"
3. Create hook:
   - Name: `Daily Auto Update`
   - Branch: `main`
4. Copy the URL and add to Vercel as `VERCEL_DEPLOY_HOOK`

### 4. Schedule
The cron job runs at **6:00 AM UTC every day**. Modify in `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/daily-update",
      "schedule": "0 6 * * *"
    }
  ]
}
```

Time format: `Minute Hour Day Month DayOfWeek`

### 5. How It Works

```
Vercel Cron (Daily at 6 AM UTC)
    ↓
Calls /api/daily-update
    ↓
Updates products.ts via GitHub API:
  - New timestamp
  - Updated trending category
  - Fresh content indicators
    ↓
Commits changes to GitHub
    ↓
Triggers Vercel redeployment
    ↓
Website updated with fresh content! 🎉
```

## Manual Trigger

You can manually trigger the update by visiting:
```
https://your-domain.com/api/daily-update?secret=YOUR_CRON_SECRET
```

Replace `YOUR_CRON_SECRET` with the value you set in environment variables.

## Monitoring

### Check Vercel Cron Logs:
1. Go to Vercel → Your Project → Logs
2. Filter by "Cron" or look for `/api/daily-update` requests

### Check GitHub Commits:
1. Go to your GitHub repository
2. Look for commits with message: "Auto-update: Daily refresh - [date]"

### Check Recent Updates:
Visit your website and look for the `lastUpdated` timestamp in the footer or product section.

## Customization

### Change Update Time
Edit `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/daily-update",
      "schedule": "0 9 * * *"  // 9 AM UTC instead
    }
  ]
}
```

Then commit and push the changes.

### Change Featured Products Logic
Edit `app/api/daily-update/route.ts`:
```typescript
// Modify the rotateFeaturedProducts function
const FEATURED_COUNT = 8; // Change this number
```

### Add More Updates
You can extend `app/api/daily-update/route.ts` to:
- Fetch real-time prices from eBay API
- Update blog posts
- Change promotional banners
- Modify other files via GitHub API

## Disable Automatic Updates

To stop automatic updates, either:

**Option 1:** Delete or rename `vercel.json`
```bash
git rm vercel.json
git commit -m "Disable auto-updates"
git push
```

**Option 2:** Remove the cron configuration from `vercel.json`:
```json
{
  "crons": []
}
```

**Option 3:** Remove environment variables from Vercel

## Troubleshooting

### Updates not running?
- Check Vercel Logs for errors
- Verify environment variables are set correctly
- Ensure GitHub token has `repo` permissions
- Check that the cron schedule is valid

### Not deploying after update?
- Verify `VERCEL_DEPLOY_HOOK` URL is correct
- Check that the deploy hook is created for the correct branch
- Look at Vercel deployment logs

### "Unauthorized" error?
- The CRON_SECRET must match when manually triggering
- GitHub token might be expired - generate a new one

## Alternative: External Cron Service

If you prefer not to use Vercel Cron Jobs, you can use external services:

1. **cron-job.org** (Free)
2. **EasyCron** (Free tier available)
3. **UptimeRobot** (Has cron feature)

Set them to call:
```
https://your-domain.com/api/daily-update?secret=YOUR_CRON_SECRET
```

Then remove the `vercel.json` cron configuration.
