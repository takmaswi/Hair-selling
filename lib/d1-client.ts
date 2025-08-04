import { Product, Category } from '@/types/database';

// D1 Database client for Cloudflare Workers
// This will be used in production with actual D1 bindings

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(columnName?: string): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  error?: string;
  meta?: any;
}

// Helper function to parse JSON fields
function parseProduct(row: any): Product {
  return {
    ...row,
    inches: row.inches ? JSON.parse(row.inches) : [],
    tags: row.tags ? JSON.parse(row.tags) : [],
    is_active: row.is_active === 1,
    featured: row.featured === 1,
    baby_hair: row.baby_hair === 1,
    pre_plucked: row.pre_plucked === 1,
    bleached_knots: row.bleached_knots === 1,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at)
  };
}

// D1 Database operations
export class D1Client {
  private db: D1Database | null = null;

  constructor(db?: D1Database) {
    this.db = db || null;
  }

  // Products operations
  async getProducts(filters?: any): Promise<Product[]> {
    if (!this.db) throw new Error('D1 database not initialized');

    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];
    
    if (filters?.is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.is_active ? 1 : 0);
    }
    
    if (filters?.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }
    
    if (filters?.category_id) {
      query += ' AND category_id = ?';
      params.push(filters.category_id);
    }
    
    if (filters?.featured !== undefined) {
      query += ' AND featured = ?';
      params.push(filters.featured ? 1 : 0);
    }
    
    if (filters?.search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern);
    }
    
    // Add filters for color, length, price range
    if (filters?.color) {
      query += ' AND color = ?';
      params.push(filters.color);
    }
    
    if (filters?.minPrice !== undefined) {
      query += ' AND price >= ?';
      params.push(filters.minPrice);
    }
    
    if (filters?.maxPrice !== undefined) {
      query += ' AND price <= ?';
      params.push(filters.maxPrice);
    }
    
    if (filters?.texture) {
      query += ' AND texture = ?';
      params.push(filters.texture);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const stmt = this.db.prepare(query).bind(...params);
    const result = await stmt.all<any>();
    
    if (!result.results) return [];
    
    return result.results.map(parseProduct);
  }

  async getProductById(id: string): Promise<Product | null> {
    if (!this.db) throw new Error('D1 database not initialized');

    const stmt = this.db.prepare('SELECT * FROM products WHERE id = ?').bind(id);
    const product = await stmt.first<any>();
    
    if (!product) return null;
    
    return parseProduct(product);
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    if (!this.db) throw new Error('D1 database not initialized');

    const id = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      INSERT INTO products (
        id, name, slug, description, price, compare_at_price, sku,
        hair_type, quality, inches, density, texture, origin, color,
        cap_construction, cap_size, lace_type, parting_space,
        baby_hair, pre_plucked, bleached_knots,
        is_active, stock, status, featured, category_id,
        seo_title, seo_description, tags, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      data.name || '',
      data.slug || data.name?.toLowerCase().replace(/\s+/g, '-') || '',
      data.description || '',
      data.price || 0,
      data.compare_at_price || null,
      data.sku || '',
      data.hair_type || 'HUMAN_HAIR',
      data.quality || 'STANDARD',
      JSON.stringify(data.inches || []),
      data.density || '130%',
      data.texture || 'Straight',
      data.origin || 'Brazilian',
      data.color || null,
      data.cap_construction || null,
      data.cap_size || 'Medium',
      data.lace_type || null,
      data.parting_space || null,
      data.baby_hair ? 1 : 0,
      data.pre_plucked ? 1 : 0,
      data.bleached_knots ? 1 : 0,
      data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1,
      data.stock || 0,
      data.status || 'ACTIVE',
      data.featured ? 1 : 0,
      data.category_id || 'cat_human_hair',
      data.seo_title || null,
      data.seo_description || null,
      JSON.stringify(data.tags || []),
      now,
      now
    );
    
    await stmt.run();
    const created = await this.getProductById(id);
    if (!created) throw new Error('Failed to create product');
    return created;
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
    if (!this.db) throw new Error('D1 database not initialized');

    const existing = await this.getProductById(id);
    if (!existing) return null;
    
    const updates: string[] = [];
    const params: any[] = [];
    
    const fields = [
      'name', 'slug', 'description', 'price', 'compare_at_price', 'sku',
      'hair_type', 'quality', 'density', 'texture', 'origin', 'color',
      'cap_construction', 'cap_size', 'lace_type', 'parting_space',
      'stock', 'status', 'category_id', 'seo_title', 'seo_description'
    ];
    
    fields.forEach(field => {
      if (data[field as keyof Product] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(data[field as keyof Product]);
      }
    });
    
    if (data.inches !== undefined) {
      updates.push('inches = ?');
      params.push(JSON.stringify(data.inches));
    }
    
    if (data.tags !== undefined) {
      updates.push('tags = ?');
      params.push(JSON.stringify(data.tags));
    }
    
    ['is_active', 'featured', 'baby_hair', 'pre_plucked', 'bleached_knots'].forEach(field => {
      if (data[field as keyof Product] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(data[field as keyof Product] ? 1 : 0);
      }
    });
    
    if (updates.length === 0) return existing;
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);
    
    const stmt = this.db.prepare(
      `UPDATE products SET ${updates.join(', ')} WHERE id = ?`
    ).bind(...params);
    
    await stmt.run();
    return await this.getProductById(id);
  }

  async deleteProduct(id: string): Promise<boolean> {
    if (!this.db) throw new Error('D1 database not initialized');

    const stmt = this.db.prepare('DELETE FROM products WHERE id = ?').bind(id);
    const result = await stmt.run();
    return result.success;
  }

  // Categories operations
  async getCategories(): Promise<Category[]> {
    if (!this.db) throw new Error('D1 database not initialized');

    const stmt = this.db.prepare('SELECT * FROM categories ORDER BY name');
    const result = await stmt.all<any>();
    
    if (!result.results) return [];
    
    return result.results.map(c => ({
      ...c,
      created_at: new Date(c.created_at),
      updated_at: new Date(c.updated_at)
    }));
  }

  async getCategoryById(id: string): Promise<Category | null> {
    if (!this.db) throw new Error('D1 database not initialized');

    const stmt = this.db.prepare('SELECT * FROM categories WHERE id = ?').bind(id);
    const category = await stmt.first<any>();
    
    if (!category) return null;
    
    return {
      ...category,
      created_at: new Date(category.created_at),
      updated_at: new Date(category.updated_at)
    };
  }
}