# 🤖 Automatic Daily Updates

This project includes a GitHub Actions workflow that automatically updates the website content every day.

## What Gets Updated Daily

- **Timestamp**: Shows when products were last refreshed
- **Featured Products**: Rotates to display different products each day
- **Trending Category**: Highlights a different category daily
- **Fresh Content**: Keeps the site looking active and up-to-date

## Setup Instructions

### 1. Enable GitHub Actions
The workflow is already configured in `.github/workflows/daily-update.yml`. It will start running automatically once pushed to GitHub.

### 2. Schedule
The workflow runs at **6:00 AM UTC every day**. You can modify this in the workflow file:
```yaml
on:
  schedule:
    - cron: '0 6 * * *'  # Minute Hour Day Month DayOfWeek
```

### 3. Manual Trigger
You can also run the workflow manually:
1. Go to GitHub repository → Actions tab
2. Select "Daily Auto Update" workflow
3. Click "Run workflow"

### 4. Vercel Auto-Deploy (Optional)
To automatically deploy to Vercel after each update, add these secrets to your GitHub repository:

**Go to:** Settings → Secrets and variables → Actions → New repository secret

| Secret Name | How to Get It |
|------------|---------------|
| `VERCEL_PROJECT_ID` | From Vercel project settings → General → Project ID |
| `VERCEL_DEPLOY_TOKEN` | From Vercel project settings → Git → Deploy Hooks |

**To create a Deploy Hook in Vercel:**
1. Go to your Vercel project dashboard
2. Settings → Git → Deploy Hooks
3. Create hook named "GitHub Actions Daily Update"
4. Copy the URL and extract the token (last part of the URL)

### 5. How It Works

```
GitHub Actions (Daily at 6 AM)
    ↓
Runs scripts/daily-update.js
    ↓
Updates products.ts with:
  - New timestamp
  - Rotated featured products
  - Updated trending indicators
    ↓
Commits changes to GitHub
    ↓
Triggers Vercel redeployment
    ↓
Website updated with fresh content! 🎉
```

## Customization

### Change Update Time
Edit `.github/workflows/daily-update.yml`:
```yaml
# Run at 9:00 AM UTC instead
cron: '0 9 * * *'
```

### Change Number of Featured Products
Edit `scripts/daily-update.js`:
```javascript
const FEATURED_COUNT = 8; // Change this number
```

### Add More Updates
You can extend `scripts/daily-update.js` to:
- Fetch real-time prices from eBay API
- Update blog posts
- Change promotional banners
- Update SEO keywords

## Monitoring

Check the Actions tab in your GitHub repository to see:
- ✅ Successful updates
- ❌ Failed runs
- 📊 Execution logs

## Disable Automatic Updates

To stop automatic updates:
1. Go to GitHub → Actions tab
2. Select "Daily Auto Update" workflow
3. Click "..." → Disable workflow

Or delete the file: `.github/workflows/daily-update.yml`
