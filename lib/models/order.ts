/**
 * Order Model
 * Database operations for orders
 */

import { D1Client, generateId, stringifyJsonField, parseJsonField } from '../d1-client';
import type { 
  Order, 
  OrderItem,
  OrderStatus,
  CreateOrderDto,
  OrderFilter,
  PaginationParams,
  PaginatedResponse,
  Address
} from '@/types/database';

export class OrderModel {
  constructor(private db: D1Client) {}

  /**
   * Find order by ID
   */
  async findById(id: string): Promise<Order | null> {
    const order = await this.db.queryFirst<any>(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (!order) return null;

    // Get order items
    const items = await this.db.query<OrderItem>(
      `SELECT oi.*, p.name as product_name, p.slug as product_slug,
              pv.name as variant_name
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       LEFT JOIN product_variants pv ON oi.variant_id = pv.id
       WHERE oi.order_id = ?`,
      [id]
    );

    return {
      ...order,
      shipping_address: parseJsonField<Address>(order.shipping_address) || {} as Address,
      billing_address: parseJsonField<Address>(order.billing_address) || {} as Address,
      items
    };
  }

  /**
   * Find order by order number
   */
  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const order = await this.db.queryFirst<any>(
      'SELECT * FROM orders WHERE order_number = ?',
      [orderNumber]
    );

    if (!order) return null;

    return this.findById(order.id);
  }

  /**
   * Get orders with filtering and pagination
   */
  async findMany(
    filter?: OrderFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Order>> {
    let whereConditions: string[] = ['1=1'];
    let params: any[] = [];
    let paramIndex = 1;

    // Build WHERE conditions
    if (filter) {
      if (filter.status) {
        whereConditions.push(`status = ?${paramIndex++}`);
        params.push(filter.status);
      }
      if (filter.userId) {
        whereConditions.push(`user_id = ?${paramIndex++}`);
        params.push(filter.userId);
      }
      if (filter.dateFrom) {
        whereConditions.push(`created_at >= ?${paramIndex++}`);
        params.push(filter.dateFrom.toISOString());
      }
      if (filter.dateTo) {
        whereConditions.push(`created_at <= ?${paramIndex++}`);
        params.push(filter.dateTo.toISOString());
      }
      if (filter.search) {
        whereConditions.push(`(order_number LIKE ?${paramIndex++} OR email LIKE ?${paramIndex++})`);
        params.push(`%${filter.search}%`, `%${filter.search}%`);
      }
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM orders 
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
      SELECT * FROM orders
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ?${paramIndex++} OFFSET ?${paramIndex++}
    `;
    params.push(pageSize, offset);

    const orders = await this.db.query<any>(query, params);

    // Parse JSON fields
    const formattedOrders = orders.map(order => ({
      ...order,
      shipping_address: parseJsonField<Address>(order.shipping_address) || {} as Address,
      billing_address: parseJsonField<Address>(order.billing_address) || {} as Address
    }));

    return {
      data: formattedOrders,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  /**
   * Create a new order
   */
  async create(data: CreateOrderDto): Promise<Order> {
    const id = generateId('order');
    const orderNumber = this.generateOrderNumber();
    const now = new Date().toISOString();

    // Calculate totals
    const subtotal = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.15; // 15% tax rate (configurable)
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    // Start transaction
    const statements = [];

    // Insert order
    statements.push({
      sql: `INSERT INTO orders (
        id, order_number, user_id, email, phone, status,
        subtotal, tax, shipping, discount, total,
        shipping_address, billing_address, payment_method,
        notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params: [
        id,
        orderNumber,
        data.user_id || null,
        data.email,
        data.phone || null,
        'PENDING',
        subtotal,
        tax,
        shipping,
        0,
        total,
        stringifyJsonField(data.shipping_address),
        stringifyJsonField(data.billing_address),
        data.payment_method || null,
        data.notes || null,
        now,
        now
      ]
    });

    // Insert order items
    for (const item of data.items) {
      const itemId = generateId('item');
      const itemTotal = item.price * item.quantity;
      
      statements.push({
        sql: `INSERT INTO order_items (
          id, order_id, product_id, variant_id,
          quantity, price, total, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          itemId,
          id,
          item.product_id,
          item.variant_id || null,
          item.quantity,
          item.price,
          itemTotal,
          now
        ]
      });

      // Update product variant stock if applicable
      if (item.variant_id) {
        statements.push({
          sql: 'UPDATE product_variants SET stock = stock - ? WHERE id = ?',
          params: [item.quantity, item.variant_id]
        });
      }
    }

    // Execute transaction
    await this.db.transaction(statements);

    // Return created order
    const created = await this.findById(id);
    if (!created) throw new Error('Failed to create order');
    
    return created;
  }

  /**
   * Update order status
   */
  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    await this.db.execute(
      'UPDATE orders SET status = ?, updated_at = ? WHERE id = ?',
      [status, new Date().toISOString(), id]
    );

    const updated = await this.findById(id);
    if (!updated) throw new Error('Order not found');
    
    return updated;
  }

  /**
   * Update tracking number
   */
  async updateTracking(id: string, trackingNumber: string): Promise<Order> {
    await this.db.execute(
      'UPDATE orders SET tracking_number = ?, status = ?, updated_at = ? WHERE id = ?',
      [trackingNumber, 'SHIPPED', new Date().toISOString(), id]
    );

    const updated = await this.findById(id);
    if (!updated) throw new Error('Order not found');
    
    return updated;
  }

  /**
   * Get user's orders
   */
  async getUserOrders(userId: string, limit: number = 10): Promise<Order[]> {
    const orders = await this.db.query<any>(
      `SELECT * FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [userId, limit]
    );

    // Parse JSON fields and get items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await this.db.query<OrderItem>(
          'SELECT * FROM order_items WHERE order_id = ?',
          [order.id]
        );

        return {
          ...order,
          shipping_address: parseJsonField<Address>(order.shipping_address) || {} as Address,
          billing_address: parseJsonField<Address>(order.billing_address) || {} as Address,
          items
        };
      })
    );

    return ordersWithItems;
  }

  /**
   * Cancel order
   */
  async cancel(id: string): Promise<Order> {
    // Get order to check if it can be cancelled
    const order = await this.findById(id);
    if (!order) throw new Error('Order not found');
    
    if (!['PENDING', 'PROCESSING'].includes(order.status)) {
      throw new Error('Order cannot be cancelled');
    }

    // Restore stock for each item
    const statements = [];
    
    if (order.items) {
      for (const item of order.items) {
        if (item.variant_id) {
          statements.push({
            sql: 'UPDATE product_variants SET stock = stock + ? WHERE id = ?',
            params: [item.quantity, item.variant_id]
          });
        }
      }
    }

    // Update order status
    statements.push({
      sql: 'UPDATE orders SET status = ?, updated_at = ? WHERE id = ?',
      params: ['CANCELLED', new Date().toISOString(), id]
    });

    // Execute transaction
    await this.db.transaction(statements);

    return this.updateStatus(id, 'CANCELLED');
  }

  /**
   * Get order statistics
   */
  async getStatistics(userId?: string): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    pendingOrders: number;
  }> {
    let whereClause = '';
    const params: any[] = [];
    
    if (userId) {
      whereClause = 'WHERE user_id = ?';
      params.push(userId);
    }

    const stats = await this.db.queryFirst<any>(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total) as total_revenue,
        AVG(total) as average_order_value,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending_orders
      FROM orders
      ${whereClause}
    `, params);

    return {
      totalOrders: stats?.total_orders || 0,
      totalRevenue: stats?.total_revenue || 0,
      averageOrderValue: stats?.average_order_value || 0,
      pendingOrders: stats?.pending_orders || 0
    };
  }

  /**
   * Generate unique order number
   */
  private generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TH${year}${month}${day}${random}`;
  }
}