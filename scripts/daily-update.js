const fs = require('fs');
const path = require('path');

// Daily update script for DealsHub
// This script runs automatically via GitHub Actions every day

const PRODUCTS_FILE = path.join(__dirname, '..', 'lib', 'products.ts');

// Read the products file
function readProductsFile() {
  return fs.readFileSync(PRODUCTS_FILE, 'utf8');
}

// Write the products file
function writeProductsFile(content) {
  fs.writeFileSync(PRODUCTS_FILE, content, 'utf8');
}

// Update the lastUpdated timestamp
function updateTimestamp(content) {
  const now = new Date();
  const timestamp = now.toISOString();
  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Check if lastUpdated already exists
  if (content.includes('export const lastUpdated')) {
    // Update existing timestamp
    return content.replace(
      /export const lastUpdated = ['"`][^'"`]*['"`];/,
      `export const lastUpdated = '${dateStr}';`
    );
  } else {
    // Add new timestamp before featuredProducts
    return content.replace(
      'export const featuredProducts:',
      `// Auto-generated timestamp - Last updated: ${timestamp}\nexport const lastUpdated = '${dateStr}';\n\nexport const featuredProducts:`
    );
  }
}

// Rotate featured products to keep content fresh
function rotateFeaturedProducts(content) {
  // Extract all products from allProducts array
  const allProductsMatch = content.match(/export const allProducts: Product\[\] = \[([\s\S]*?)\];/);
  if (!allProductsMatch) return content;
  
  // Parse product entries (simplified regex approach)
  const productMatches = allProductsMatch[1].match(/\{ id: \d+,[^}]+\}/g);
  if (!productMatches || productMatches.length < 8) return content;
  
  // Get today's date to use as seed for consistent rotation
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  // Select 8 products based on day of year (rotating selection)
  const shuffled = [...productMatches];
  const startIndex = dayOfYear % Math.max(1, shuffled.length - 8);
  const selectedProducts = shuffled.slice(startIndex, startIndex + 8);
  
  // Add featured: true to selected products
  const featuredProductsStr = selectedProducts.map((p, index) => {
    // Remove any existing featured property and add featured: true
    let product = p.replace(/,\s*featured:\s*(true|false)/g, '');
    // Add featured: true before the closing brace
    product = product.replace(/\}$/, ', featured: true}');
    return product;
  }).join(',\n  ');
  
  // Replace featuredProducts array
  return content.replace(
    /export const featuredProducts: Product\[\] = \[[\s\S]*?\];/,
    `export const featuredProducts: Product[] = [\n  ${featuredProductsStr}\n];`
  );
}

// Add trending indicator to random products
function updateTrendingProducts(content) {
  const now = new Date();
  const dayOfMonth = now.getDate();
  
  // Mark different products as trending based on day of month
  let updatedContent = content;
  
  // Simple approach: Add trending comment to file
  if (!content.includes('// Trending products updated')) {
    updatedContent = content.replace(
      'export const categories:',
      `// Trending products updated: ${now.toISOString()}\n// Today's featured category: ${getTodaysCategory(dayOfMonth)}\n\nexport const categories:`
    );
  } else {
    updatedContent = content.replace(
      /\/\/ Trending products updated: .*/,
      `// Trending products updated: ${now.toISOString()}`
    );
    updatedContent = updatedContent.replace(
      /\/\/ Today's featured category: .*/,
      `// Today's featured category: ${getTodaysCategory(dayOfMonth)}`
    );
  }
  
  return updatedContent;
}

// Get featured category based on day of month
function getTodaysCategory(day) {
  const categories = [
    'Electronics',
    'Gaming', 
    'Sneakers',
    'Smart Home',
    'Beauty',
    'Collectibles',
    'Sports',
    'Toys'
  ];
  return categories[day % categories.length];
}

// Update affiliate link parameters with date-based campaign tracking
function updateAffiliateTracking(content) {
  const now = new Date();
  const dateSuffix = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  
  // Update campid to include date for tracking
  // Note: This keeps the base campid but could add custom tracking params
  return content;
}

// Main execution
function main() {
  console.log('🚀 Starting daily update...');
  console.log(`⏰ Current time: ${new Date().toISOString()}`);
  
  try {
    let content = readProductsFile();
    
    // Update timestamp
    console.log('📝 Updating timestamp...');
    content = updateTimestamp(content);
    
    // Rotate featured products
    console.log('🔄 Rotating featured products...');
    content = rotateFeaturedProducts(content);
    
    // Update trending indicators
    console.log('📈 Updating trending indicators...');
    content = updateTrendingProducts(content);
    
    // Write updated content
    writeProductsFile(content);
    
    console.log('✅ Daily update completed successfully!');
    console.log(`📊 Changes will be committed and deployed automatically.`);
    
  } catch (error) {
    console.error('❌ Error during update:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, updateTimestamp, rotateFeaturedProducts };
