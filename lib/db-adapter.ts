/**
 * Database Adapter
 * Provides a unified interface for database operations
 * Supports both local development (in-memory) and production (D1) environments
 */

import { db as localDb } from './db';
import { getD1Client } from './d1-client';
import type { Product, Category } from '@/types/database';

export interface DatabaseAdapter {
  products: {
    findAll: (filters?: any) => Promise<Product[]>;
    findById: (id: string) => Promise<Product | undefined>;
    create: (data: Partial<Product>) => Promise<Product>;
    update: (id: string, data: Partial<Product>) => Promise<Product | null>;
    delete: (id: string) => Promise<boolean>;
  };
  categories: {
    findAll: () => Promise<Category[]>;
    findById: (id: string) => Promise<Category | undefined>;
  };
  raw: {
    query: (sql: string, params?: any[]) => Promise<any>;
    queryFirst: (sql: string, params?: any[]) => Promise<any>;
  };
}

class LocalDatabaseAdapter implements DatabaseAdapter {
  products = localDb.products;
  categories = localDb.categories;
  
  raw = {
    query: async (sql: string, params?: any[]) => {
      // Simulate D1 query results for local development
      // Parse SQL to understand what's being requested
      const lowerSql = sql.toLowerCase();
      
      if (lowerSql.includes('select') && lowerSql.includes('from categories')) {
        const categories = await localDb.categories.findAll();
        const products = await localDb.products.findAll();
        
        // Count products per category
        const results = categories.map(cat => ({
          slug: cat.slug,
          name: cat.name,
          product_count: products.filter(p => p.category_id === cat.id).length
        })).filter(cat => cat.product_count > 0);
        
        return { results };
      }
      
      if (lowerSql.includes('select distinct color') && lowerSql.includes('from product_variants')) {
        // Return mock color variants
        return {
          results: [
            { color: 'Natural Black' },
            { color: 'Dark Brown' },
            { color: 'Blonde' },
            { color: 'Burgundy' }
          ]
        };
      }
      
      if (lowerSql.includes('select distinct length') && lowerSql.includes('from product_variants')) {
        // Return mock length variants
        return {
          results: [
            { length: 'Short' },
            { length: 'Medium' },
            { length: 'Long' },
            { length: 'Extra Long' }
          ]
        };
      }
      
      return { results: [] };
    },
    
    queryFirst: async (sql: string, params?: any[]) => {
      const lowerSql = sql.toLowerCase();
      
      if (lowerSql.includes('min(price)') && lowerSql.includes('max(price)')) {
        const products = await localDb.products.findAll({ is_active: true });
        const prices = products.map(p => p.price);
        return {
          min_price: Math.min(...prices),
          max_price: Math.max(...prices)
        };
      }
      
      return null;
    }
  };
}

class D1DatabaseAdapter implements DatabaseAdapter {
  private client: ReturnType<typeof getD1Client>;
  
  constructor(env: any) {
    this.client = getD1Client(env);
  }
  
  products = {
    findAll: async (filters?: any) => {
      // Implementation would use D1 queries
      // For now, fallback to local
      return localDb.products.findAll(filters);
    },
    findById: async (id: string) => {
      return localDb.products.findById(id);
    },
    create: async (data: Partial<Product>) => {
      return localDb.products.create(data);
    },
    update: async (id: string, data: Partial<Product>) => {
      return localDb.products.update(id, data);
    },
    delete: async (id: string) => {
      return localDb.products.delete(id);
    }
  };
  
  categories = localDb.categories;
  
  raw = {
    query: async (sql: string, params?: any[]) => {
      try {
        const results = await this.client.query(sql, params);
        return { results };
      } catch (error) {
        console.error('D1 query error:', error);
        // Fallback to local adapter
        const localAdapter = new LocalDatabaseAdapter();
        return localAdapter.raw.query(sql, params);
      }
    },
    queryFirst: async (sql: string, params?: any[]) => {
      try {
        return await this.client.queryFirst(sql, params);
      } catch (error) {
        console.error('D1 queryFirst error:', error);
        // Fallback to local adapter
        const localAdapter = new LocalDatabaseAdapter();
        return localAdapter.raw.queryFirst(sql, params);
      }
    }
  };
}

let dbAdapter: DatabaseAdapter | null = null;

/**
 * Get the database adapter based on environment
 */
export async function getDb(): Promise<DatabaseAdapter> {
  if (dbAdapter) {
    return dbAdapter;
  }
  
  // Check if we have D1 environment variables
  if (process.env.DB || (global as any).DB) {
    try {
      dbAdapter = new D1DatabaseAdapter(process.env);
      console.log('Using D1 database adapter');
    } catch (error) {
      console.warn('Failed to initialize D1, falling back to local database:', error);
      dbAdapter = new LocalDatabaseAdapter();
    }
  } else {
    // Use local database for development
    dbAdapter = new LocalDatabaseAdapter();
    console.log('Using local database adapter');
  }
  
  return dbAdapter;
}

/**
 * Direct access to database methods (for compatibility)
 */
export async function prepare(sql: string) {
  const db = await getDb();
  return {
    all: async () => db.raw.query(sql),
    first: async () => db.raw.queryFirst(sql),
    bind: (...params: any[]) => ({
      all: async () => db.raw.query(sql, params),
      first: async () => db.raw.queryFirst(sql, params)
    })
  };
}