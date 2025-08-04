/**
 * Product Model
 * Database operations for products
 */

import { D1Client, generateId, parseJsonField, stringifyJsonField } from '../d1-client';
import type { 
  Product, 
  ProductImage, 
  ProductVariant, 
  CreateProductDto, 
  UpdateProductDto,
  ProductFilter,
  PaginationParams,
  PaginatedResponse
} from '@/types/database';

export class ProductModel {
  constructor(private db: D1Client) {}

  /**
   * Get all products with optional filtering and pagination
   */
  async findMany(
    filter?: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Product>> {
    let whereConditions: string[] = ['1=1'];
    let params: any[] = [];
    let paramIndex = 1;

    // Build WHERE conditions
    if (filter) {
      if (filter.category) {
        whereConditions.push(`category_id = ?${paramIndex++}`);
        params.push(filter.category);
      }
      if (filter.minPrice !== undefined) {
        whereConditions.push(`price >= ?${paramIndex++}`);
        params.push(filter.minPrice);
      }
      if (filter.maxPrice !== undefined) {
        whereConditions.push(`price <= ?${paramIndex++}`);
        params.push(filter.maxPrice);
      }
      if (filter.status) {
        whereConditions.push(`status = ?${paramIndex++}`);
        params.push(filter.status);
      }
      if (filter.featured !== undefined) {
        whereConditions.push(`featured = ?${paramIndex++}`);
        params.push(filter.featured ? 1 : 0);
      }
      if (filter.search) {
        whereConditions.push(`(name LIKE ?${paramIndex++} OR description LIKE ?${paramIndex++})`);
        params.push(`%${filter.search}%`, `%${filter.search}%`);
      }
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM products 
      WHERE ${whereConditions.join(' AND ')}
    `;
    const countResult = await this.db.queryFirst<{ total: number }>(countQuery, params);
    const total = countResult?.total || 0;

    // Build main query with pagination
    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 20;
    const offset = (page - 1) * pageSize;
    const sortBy = pagination?.sortBy || 'created_at';
    const sortOrder = pagination?.sortOrder || 'desc';

    const query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY p.${sortBy} ${sortOrder}
      LIMIT ?${paramIndex++} OFFSET ?${paramIndex++}
    `;
    params.push(pageSize, offset);

    const products = await this.db.query<any>(query, params);

    // Parse JSON fields and format data
    const formattedProducts = products.map(p => ({
      ...p,
      featured: Boolean(p.featured),
      tags: parseJsonField<string[]>(p.tags) || [],
      category: p.category_name ? {
        id: p.category_id,
        name: p.category_name,
        slug: p.category_slug
      } : undefined
    }));

    return {
      data: formattedProducts,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  /**
   * Get a single product by ID or slug
   */
  async findOne(idOrSlug: string): Promise<Product | null> {
    const query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? OR p.slug = ?
    `;
    
    const product = await this.db.queryFirst<any>(query, [idOrSlug, idOrSlug]);
    
    if (!product) return null;

    // Get images
    const images = await this.db.query<ProductImage>(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order',
      [product.id]
    );

    // Get variants
    const variants = await this.db.query<ProductVariant>(
      'SELECT * FROM product_variants WHERE product_id = ?',
      [product.id]
    );

    // Format and return
    return {
      ...product,
      featured: Boolean(product.featured),
      tags: parseJsonField<string[]>(product.tags) || [],
      category: {
        id: product.category_id,
        name: product.category_name,
        slug: product.category_slug
      },
      images,
      variants: variants.map(v => ({
        ...v,
        images: parseJsonField<string[]>(v.images) || []
      }))
    };
  }

  /**
   * Create a new product
   */
  async create(data: CreateProductDto): Promise<Product> {
    const id = generateId('prod');
    const now = new Date().toISOString();

    const query = `
      INSERT INTO products (
        id, name, slug, description, price, compare_at_price,
        sku, status, featured, category_id, seo_title, 
        seo_description, tags, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      id,
      data.name,
      data.slug,
      data.description,
      data.price,
      data.compare_at_price || null,
      data.sku,
      data.status || 'ACTIVE',
      data.featured ? 1 : 0,
      data.category_id,
      data.seo_title || null,
      data.seo_description || null,
      data.tags ? stringifyJsonField(data.tags) : null,
      now,
      now
    ];

    await this.db.execute(query, params);
    
    const created = await this.findOne(id);
    if (!created) throw new Error('Failed to create product');
    
    return created;
  }

  /**
   * Update a product
   */
  async update(id: string, data: UpdateProductDto): Promise<Product> {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Build UPDATE statement dynamically
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?${paramIndex++}`);
        if (key === 'tags' && Array.isArray(value)) {
          params.push(stringifyJsonField(value));
        } else if (key === 'featured') {
          params.push(value ? 1 : 0);
        } else {
          params.push(value);
        }
      }
    });

    if (updates.length === 0) {
      const existing = await this.findOne(id);
      if (!existing) throw new Error('Product not found');
      return existing;
    }

    updates.push(`updated_at = ?${paramIndex++}`);
    params.push(new Date().toISOString());
    params.push(id);

    const query = `
      UPDATE products 
      SET ${updates.join(', ')}
      WHERE id = ?${paramIndex}
    `;

    await this.db.execute(query, params);
    
    const updated = await this.findOne(id);
    if (!updated) throw new Error('Product not found');
    
    return updated;
  }

  /**
   * Delete a product
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.db.execute(
      'DELETE FROM products WHERE id = ?',
      [id]
    );
    return result.meta.changes > 0;
  }

  /**
   * Add product image
   */
  async addImage(
    productId: string, 
    url: string, 
    alt?: string, 
    order?: number
  ): Promise<ProductImage> {
    const id = generateId('img');
    const query = `
      INSERT INTO product_images (id, product_id, url, alt, display_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    await this.db.execute(query, [
      id,
      productId,
      url,
      alt || null,
      order || 0,
      new Date().toISOString()
    ]);

    return {
      id,
      product_id: productId,
      url,
      alt: alt || null,
      display_order: order || 0,
      created_at: new Date()
    };
  }

  /**
   * Add product variant
   */
  async addVariant(
    productId: string,
    variant: Omit<ProductVariant, 'id' | 'product_id' | 'created_at' | 'updated_at'>
  ): Promise<ProductVariant> {
    const id = generateId('var');
    const now = new Date().toISOString();
    
    const query = `
      INSERT INTO product_variants (
        id, product_id, name, sku, price, stock,
        color, length, density, texture, images,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.execute(query, [
      id,
      productId,
      variant.name,
      variant.sku,
      variant.price,
      variant.stock,
      variant.color || null,
      variant.length || null,
      variant.density || null,
      variant.texture || null,
      variant.images ? stringifyJsonField(variant.images) : null,
      now,
      now
    ]);

    return {
      id,
      product_id: productId,
      ...variant,
      created_at: new Date(),
      updated_at: new Date()
    };
  }

  /**
   * Get featured products
   */
  async getFeatured(limit: number = 6): Promise<Product[]> {
    const query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.featured = 1 AND p.status = 'ACTIVE'
      ORDER BY p.created_at DESC
      LIMIT ?
    `;

    const products = await this.db.query<any>(query, [limit]);

    // Get images for each product
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await this.db.query<ProductImage>(
          'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order LIMIT 2',
          [product.id]
        );

        return {
          ...product,
          featured: true,
          tags: parseJsonField<string[]>(product.tags) || [],
          category: {
            id: product.category_id,
            name: product.category_name,
            slug: product.category_slug
          },
          images
        };
      })
    );

    return productsWithImages;
  }

  /**
   * Get related products
   */
  async getRelated(productId: string, limit: number = 4): Promise<Product[]> {
    // First get the product's category
    const product = await this.db.queryFirst<{ category_id: string }>(
      'SELECT category_id FROM products WHERE id = ?',
      [productId]
    );

    if (!product) return [];

    const query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ? AND p.id != ? AND p.status = 'ACTIVE'
      ORDER BY RANDOM()
      LIMIT ?
    `;

    const products = await this.db.query<any>(query, [
      product.category_id,
      productId,
      limit
    ]);

    // Get images for each product
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await this.db.query<ProductImage>(
          'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order LIMIT 1',
          [product.id]
        );

        return {
          ...product,
          featured: Boolean(product.featured),
          tags: parseJsonField<string[]>(product.tags) || [],
          category: {
            id: product.category_id,
            name: product.category_name,
            slug: product.category_slug
          },
          images
        };
      })
    );

    return productsWithImages;
  }
}