import { NextRequest, NextResponse } from 'next/server';

// Vercel Cron Job Handler
// This runs daily at 6 AM UTC via vercel.json cron configuration

export const dynamic = 'force-dynamic';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  affiliateLink: string;
  description: string;
  featured?: boolean;
}

// Sample product rotation logic
function rotateFeaturedProducts(allProducts: Product[]): Product[] {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Select 8 products based on day of year
  const startIndex = dayOfYear % Math.max(1, allProducts.length - 8);
  const selected = allProducts.slice(startIndex, startIndex + 8);
  
  return selected.map(p => ({ ...p, featured: true }));
}

export async function GET(request: NextRequest) {
  try {
    // Verify this is called by Vercel Cron (optional security check)
    const authHeader = request.headers.get('authorization');
    const isVercelCron = request.headers.get('x-vercel-cron') === '1';
    
    // Also allow manual trigger with secret
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const isAuthorized = isVercelCron || secret === process.env.CRON_SECRET;
    
    if (!isAuthorized && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🚀 Starting daily update via Vercel Cron...');
    
    // Get GitHub token from environment
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      throw new Error('GITHUB_TOKEN not configured');
    }

    const owner = 'SamoTech'; // Your GitHub username
    const repo = 'ebay-store'; // Your repo name
    const branch = 'main';

    // 1. Get current products.ts content
    const getFileResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/lib/products.ts?ref=${branch}`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!getFileResponse.ok) {
      throw new Error(`Failed to fetch file: ${getFileResponse.status}`);
    }

    const fileData = await getFileResponse.json();
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf8');
    const sha = fileData.sha;

    // 2. Update the content
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let updatedContent = currentContent;

    // Update timestamp
    if (updatedContent.includes('export const lastUpdated')) {
      updatedContent = updatedContent.replace(
        /export const lastUpdated = ['"`][^'"`]*['"`];/,
        `export const lastUpdated = '${dateStr}';`
      );
    } else {
      updatedContent = updatedContent.replace(
        'export const featuredProducts:',
        `export const lastUpdated = '${dateStr}';\n\nexport const featuredProducts:`
      );
    }

    // Update trending comment
    const featuredCategory = ['Electronics', 'Gaming', 'Sneakers', 'Smart Home', 'Beauty', 'Collectibles'][now.getDate() % 6];
    
    if (updatedContent.includes('// Trending products updated')) {
      updatedContent = updatedContent.replace(
        /\/\/ Trending products updated: .*/,
        `// Trending products updated: ${now.toISOString()}`
      );
      updatedContent = updatedContent.replace(
        /\/\/ Today's featured category: .*/,
        `// Today's featured category: ${featuredCategory}`
      );
    } else {
      updatedContent = updatedContent.replace(
        'export const categories:',
        `// Trending products updated: ${now.toISOString()}\n// Today's featured category: ${featuredCategory}\n\nexport const categories:`
      );
    }

    // 3. Commit the changes via GitHub API
    const updateResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/lib/products.ts`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Auto-update: Daily refresh - ${dateStr}`,
          content: Buffer.from(updatedContent).toString('base64'),
          sha: sha,
          branch: branch,
        }),
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(`Failed to update file: ${errorData.message}`);
    }

    console.log('✅ File updated successfully');

    // 4. Trigger redeployment via Vercel Deploy Hook
    const deployHook = process.env.VERCEL_DEPLOY_HOOK;
    if (deployHook) {
      await fetch(deployHook, { method: 'POST' });
      console.log('🚀 Deployment triggered');
    }

    return NextResponse.json({
      success: true,
      message: 'Daily update completed',
      timestamp: now.toISOString(),
      featuredCategory: featuredCategory,
    });

  } catch (error) {
    console.error('❌ Error in daily update:', error);
    return NextResponse.json(
      { error: 'Update failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}
