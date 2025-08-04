import fs from 'fs';
import path from 'path';

interface InstagramPost {
  id: string;
  type: string;
  caption: string;
  hashtags: string[];
  url: string;
  displayUrl: string;
  images?: string[];
  videoUrl?: string;
  likesCount: number;
  timestamp: string;
  ownerFullName: string;
  ownerUsername: string;
}

interface ProductInfo {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  tags: string[];
  instagramUrl: string;
}

function extractPriceFromText(text: string): number | null {
  const priceMatch = text.match(/\$(\d+)/);
  return priceMatch ? parseInt(priceMatch[1]) : null;
}

function extractProductCategory(caption: string): string {
  const categories = {
    'bob': 'Short Wigs',
    'long': 'Long Wigs',
    'curly': 'Curly Wigs',
    'straight': 'Straight Wigs',
    'lace': 'Lace Front Wigs',
    'closure': 'Closures',
    'frontal': 'Frontals',
    'bundle': 'Bundles',
    'wig': 'Premium Wigs'
  };

  const lowerCaption = caption.toLowerCase();
  for (const [keyword, category] of Object.entries(categories)) {
    if (lowerCaption.includes(keyword)) {
      return category;
    }
  }
  return 'Premium Wigs';
}

function extractProductName(caption: string): string {
  const lines = caption.split('\n');
  let name = lines[0].slice(0, 50);
  
  // Clean up common patterns
  name = name.replace(/Transform your look/i, '');
  name = name.replace(/Ladies please/i, '');
  name = name.replace(/🔥|✨|💫|👑/g, '');
  name = name.trim();
  
  if (name.length < 10) {
    // Extract from hashtags or generate from category
    const category = extractProductCategory(caption);
    name = `Premium ${category}`;
  }
  
  return name;
}

async function parseInstagramData() {
  const dataPath = 'C:\\Users\\Dell\\Downloads\\dataset_instagram-scraper_2025-08-04_07-17-22-805.json';
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const posts: InstagramPost[] = JSON.parse(rawData);
  
  const products: ProductInfo[] = [];
  const uniqueProducts = new Map<string, ProductInfo>();
  
  for (const post of posts) {
    if (!post.caption) continue;
    
    const price = extractPriceFromText(post.caption) || 250; // Default price $250
    const category = extractProductCategory(post.caption);
    const name = extractProductName(post.caption);
    
    const productInfo: ProductInfo = {
      name,
      description: post.caption.slice(0, 500),
      price,
      images: post.images?.length ? post.images : [post.displayUrl],
      category,
      tags: post.hashtags.filter(tag => tag !== 'truthhair.zw'),
      instagramUrl: post.url
    };
    
    // Use a combination of name and price as key to avoid duplicates
    const key = `${name}-${price}`;
    if (!uniqueProducts.has(key)) {
      uniqueProducts.set(key, productInfo);
    }
  }
  
  // Convert to array
  const productArray = Array.from(uniqueProducts.values());
  
  // Save extracted products
  const outputPath = path.join(process.cwd(), 'data', 'instagram-products.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(productArray, null, 2));
  
  console.log(`Extracted ${productArray.length} unique products from Instagram data`);
  
  // Also extract business info
  const businessInfo = {
    name: 'Truth Hair',
    address: '228 Second Street Extension, Avondale, Harare, Zimbabwe 26300',
    instagram: '@truthhair.zw',
    instagramUrl: 'https://www.instagram.com/truthhair.zw',
    ownerFullName: posts[0]?.ownerFullName || 'Truth Hair',
    totalPosts: posts.length,
    latestPost: posts[0]?.timestamp
  };
  
  const businessInfoPath = path.join(process.cwd(), 'data', 'business-info.json');
  fs.writeFileSync(businessInfoPath, JSON.stringify(businessInfo, null, 2));
  
  return { products: productArray, businessInfo };
}

// Run if executed directly
if (require.main === module) {
  parseInstagramData().then(result => {
    console.log('Instagram data parsed successfully');
    console.log(`Found ${result.products.length} products`);
    console.log('Business info:', result.businessInfo);
  }).catch(console.error);
}

export { parseInstagramData, extractPriceFromText, extractProductCategory, extractProductName };