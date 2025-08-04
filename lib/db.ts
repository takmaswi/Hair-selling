import { Product, Category } from '@/types/database';
import { D1Client } from './d1-client';

// For local development, we use file-based storage
// In production with Cloudflare Workers, D1 will be injected

// Path to the products JSON file
const PRODUCTS_FILE = 'database/products.json';

// Helper function to read products from file (server-side only)
function readProductsFromFile(): Product[] {
  // Only read from file on server-side
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), PRODUCTS_FILE);
      
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        const products = JSON.parse(data);
        // Convert date strings back to Date objects
        return products.map((p: any) => ({
          ...p,
          created_at: new Date(p.created_at),
          updated_at: new Date(p.updated_at)
        }));
      }
    } catch (error) {
      console.error('Error reading products file:', error);
    }
  }
  // Return empty array if on client-side or if file doesn't exist
  return [];
}

// Helper function to write products to file (server-side only)
function writeProductsToFile(products: Product[]): void {
  // Only write to file on server-side
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), PRODUCTS_FILE);
      
      // Ensure database directory exists
      const dbDir = path.dirname(filePath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      
      // Write products to file
      fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error('Error writing products file:', error);
    }
  }
}

// Initialize products from file
let products: Product[] = readProductsFromFile();

const categories: Category[] = [
  { id: 'cat_human_hair', name: 'Human Hair Wigs', slug: 'human-hair-wigs', description: 'Premium 100% human hair wigs', created_at: new Date(), updated_at: new Date() },
  { id: 'cat_synthetic', name: 'Synthetic Wigs', slug: 'synthetic-wigs', description: 'High-quality synthetic fiber wigs', created_at: new Date(), updated_at: new Date() },
  { id: 'cat_lace_front', name: 'Lace Front Wigs', slug: 'lace-front-wigs', description: 'Natural hairline lace front wigs', created_at: new Date(), updated_at: new Date() },
  { id: 'cat_full_lace', name: 'Full Lace Wigs', slug: 'full-lace-wigs', description: 'Versatile full lace construction', created_at: new Date(), updated_at: new Date() },
  { id: 'cat_closures', name: 'Closures & Frontals', slug: 'closures-frontals', description: 'Hair closures and frontals', created_at: new Date(), updated_at: new Date() },
  { id: 'cat_bundles', name: 'Hair Bundles', slug: 'hair-bundles', description: 'Virgin hair bundles and extensions', created_at: new Date(), updated_at: new Date() },
  { id: 'cat_360_lace', name: '360 Lace Wigs', slug: '360-lace-wigs', description: '360 degree lace wigs', created_at: new Date(), updated_at: new Date() },
  { id: 'cat_u_part', name: 'U-Part Wigs', slug: 'u-part-wigs', description: 'U-part wigs for natural blending', created_at: new Date(), updated_at: new Date() }
];

// Mock database for development - data persists in memory during dev session
export const db = {
  products: {
    async findAll(filters?: any): Promise<Product[]> {
      // Reload products from file to get latest data
      if (typeof window === 'undefined') {
        products = readProductsFromFile();
      }
      
      let results = [...products];
      
      if (filters?.is_active !== undefined) {
        results = results.filter(p => p.is_active === filters.is_active);
      }
      
      if (filters?.status) {
        results = results.filter(p => p.status === filters.status);
      }
      
      if (filters?.category_id) {
        results = results.filter(p => p.category_id === filters.category_id);
      }
      
      if (filters?.featured !== undefined) {
        results = results.filter(p => p.featured === filters.featured);
      }
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        results = results.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Price range filter
      if (filters?.minPrice !== undefined) {
        results = results.filter(p => p.price >= filters.minPrice);
      }
      
      if (filters?.maxPrice !== undefined) {
        results = results.filter(p => p.price <= filters.maxPrice);
      }
      
      // Color filter
      if (filters?.color) {
        results = results.filter(p => p.color === filters.color);
      }
      
      // Length filter (check if any inch value is in range)
      if (filters?.minLength || filters?.maxLength) {
        results = results.filter(p => {
          if (!p.inches || p.inches.length === 0) return false;
          return p.inches.some(inch => {
            const val = parseInt(inch);
            if (filters.minLength && val < filters.minLength) return false;
            if (filters.maxLength && val > filters.maxLength) return false;
            return true;
          });
        });
      }
      
      return results;
    },
    
    async findById(id: string): Promise<Product | null> {
      return products.find(p => p.id === id) || null;
    },
    
    async create(data: Partial<Product>): Promise<Product> {
      const newProduct: Product = {
        id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: data.name || '',
        slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, '-') || '',
        description: data.description || '',
        price: data.price || 0,
        compare_at_price: data.compare_at_price,
        sku: data.sku || '',
        hair_type: data.hair_type || 'HUMAN_HAIR' as any,
        quality: data.quality || 'STANDARD' as any,
        inches: data.inches || [],
        density: data.density,
        texture: data.texture,
        origin: data.origin,
        color: data.color,
        cap_construction: data.cap_construction,
        cap_size: data.cap_size || 'Medium',
        lace_type: data.lace_type,
        parting_space: data.parting_space,
        baby_hair: data.baby_hair || false,
        pre_plucked: data.pre_plucked || false,
        bleached_knots: data.bleached_knots || false,
        is_active: data.is_active !== undefined ? data.is_active : true,
        stock: data.stock || 0,
        status: data.status || 'ACTIVE' as any,
        featured: data.featured || false,
        category_id: data.category_id || 'cat_human_hair',
        seo_title: data.seo_title,
        seo_description: data.seo_description,
        tags: data.tags || [],
        created_at: new Date(),
        updated_at: new Date()
      };
      
      products.push(newProduct);
      
      // Persist to file
      writeProductsToFile(products);
      
      return newProduct;
    },
    
    async update(id: string, data: Partial<Product>): Promise<Product | null> {
      const index = products.findIndex(p => p.id === id);
      if (index === -1) return null;
      
      products[index] = {
        ...products[index],
        ...data,
        updated_at: new Date()
      };
      
      // Persist to file
      writeProductsToFile(products);
      
      return products[index];
    },
    
    async delete(id: string): Promise<boolean> {
      const index = products.findIndex(p => p.id === id);
      if (index === -1) return false;
      
      products.splice(index, 1);
      
      // Persist to file
      writeProductsToFile(products);
      
      return true;
    }
  },
  
  categories: {
    async findAll(): Promise<Category[]> {
      return categories;
    },
    
    async findById(id: string): Promise<Category | null> {
      return categories.find(c => c.id === id) || null;
    }
  }
};