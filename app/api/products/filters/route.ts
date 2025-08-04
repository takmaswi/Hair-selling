import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get all products and categories
    const products = await db.products.findAll({ is_active: true, status: 'ACTIVE' });
    const categories = await db.categories.findAll();
    
    // Get categories with product counts
    const categoriesWithCounts = categories.map(cat => {
      const productCount = products.filter(p => p.category_id === cat.id).length;
      return {
        id: cat.slug,
        name: cat.name,
        count: productCount
      };
    }).filter(cat => cat.count > 0);

    // Get price range
    const prices = products.map(p => p.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;

    // Get unique colors (mock data for now)
    const colors = [
      { id: 'natural-black', name: 'Natural Black', hex: '#000000' },
      { id: 'dark-brown', name: 'Dark Brown', hex: '#3B2F2F' },
      { id: 'medium-brown', name: 'Medium Brown', hex: '#6F4E37' },
      { id: 'light-brown', name: 'Light Brown', hex: '#987654' },
      { id: 'blonde', name: 'Blonde', hex: '#FAD02E' },
      { id: 'burgundy', name: 'Burgundy', hex: '#800020' }
    ];

    // Get unique lengths based on inches data
    const allInches = new Set<string>();
    products.forEach(p => {
      if (p.inches && Array.isArray(p.inches)) {
        p.inches.forEach(inch => allInches.add(inch));
      }
    });
    
    const lengths = [];
    if (Array.from(allInches).some(i => parseInt(i) <= 12)) {
      lengths.push({ id: 'short', name: 'Short (8"-12")', range: [8, 12] });
    }
    if (Array.from(allInches).some(i => parseInt(i) >= 14 && parseInt(i) <= 18)) {
      lengths.push({ id: 'medium', name: 'Medium (14"-18")', range: [14, 18] });
    }
    if (Array.from(allInches).some(i => parseInt(i) >= 20 && parseInt(i) <= 24)) {
      lengths.push({ id: 'long', name: 'Long (20"-24")', range: [20, 24] });
    }
    if (Array.from(allInches).some(i => parseInt(i) >= 26)) {
      lengths.push({ id: 'extra-long', name: 'Extra Long (26"+)', range: [26, 32] });
    }

    const filters = {
      categories: categoriesWithCounts,
      colors,
      lengths,
      priceRange: {
        min: minPrice,
        max: maxPrice
      }
    };

    return NextResponse.json(filters);
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filters' },
      { status: 500 }
    );
  }
}

// Helper function to map color names to hex values
function getColorHex(colorName: string): string {
  const colorMap: Record<string, string> = {
    'natural black': '#000000',
    'dark brown': '#3B2F2F',
    'medium brown': '#6F4E37',
    'light brown': '#987654',
    'blonde': '#FAD02E',
    'burgundy': '#800020',
    'black': '#000000',
    'brown': '#6F4E37'
  }
  
  return colorMap[colorName.toLowerCase()] || '#666666'
}

// Helper function to map length names to ranges
function getLengthRange(lengthName: string): [number, number] {
  const lengthMap: Record<string, [number, number]> = {
    'short': [8, 12],
    'medium': [14, 18],
    'long': [20, 24],
    'extra long': [26, 32],
    'extra-long': [26, 32]
  }
  
  return lengthMap[lengthName.toLowerCase()] || [12, 16]
}