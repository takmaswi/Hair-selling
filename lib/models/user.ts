/**
 * User Model
 * Database operations for users
 */

import { D1Client, generateId } from '../d1-client';
import type { 
  User, 
  CreateUserDto, 
  UpdateUserDto,
  AuthUser,
  LoginCredentials,
  RegisterData 
} from '@/types/database';
import bcrypt from 'bcryptjs';

export class UserModel {
  constructor(private db: D1Client) {}

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return await this.db.queryFirst<User>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.db.queryFirst<User>(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
  }

  /**
   * Find user by referral code
   */
  async findByReferralCode(code: string): Promise<User | null> {
    return await this.db.queryFirst<User>(
      'SELECT * FROM users WHERE referral_code = ?',
      [code]
    );
  }

  /**
   * Create a new user
   */
  async create(data: CreateUserDto): Promise<User> {
    const id = generateId('user');
    const now = new Date().toISOString();
    
    // Generate referral code
    const referralCode = this.generateReferralCode();
    
    // Hash password if provided
    let hashedPassword = null;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const query = `
      INSERT INTO users (
        id, email, password, name, phone, role,
        referral_code, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.execute(query, [
      id,
      data.email.toLowerCase(),
      hashedPassword,
      data.name || null,
      data.phone || null,
      data.role || 'CUSTOMER',
      referralCode,
      now,
      now
    ]);

    const created = await this.findById(id);
    if (!created) throw new Error('Failed to create user');
    
    return created;
  }

  /**
   * Update user
   */
  async update(id: string, data: UpdateUserDto): Promise<User> {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?${paramIndex++}`);
        params.push(value);
      }
    });

    if (updates.length === 0) {
      const existing = await this.findById(id);
      if (!existing) throw new Error('User not found');
      return existing;
    }

    updates.push(`updated_at = ?${paramIndex++}`);
    params.push(new Date().toISOString());
    params.push(id);

    const query = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = ?${paramIndex}
    `;

    await this.db.execute(query, params);
    
    const updated = await this.findById(id);
    if (!updated) throw new Error('User not found');
    
    return updated;
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.db.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.meta.changes > 0;
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthUser> {
    // Check if user already exists
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    // Create user
    const user = await this.create({
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      role: 'CUSTOMER'
    });

    // Create loyalty points account
    await this.createLoyaltyAccount(user.id);

    return this.toAuthUser(user);
  }

  /**
   * Authenticate user with email and password
   */
  async authenticate(credentials: LoginCredentials): Promise<AuthUser | null> {
    const user = await this.findByEmail(credentials.email);
    
    if (!user || !user.password) {
      return null;
    }

    const isValid = await bcrypt.compare(credentials.password, user.password);
    
    if (!isValid) {
      return null;
    }

    return this.toAuthUser(user);
  }

  /**
   * Verify user email
   */
  async verifyEmail(userId: string): Promise<void> {
    await this.db.execute(
      'UPDATE users SET email_verified = ? WHERE id = ?',
      [new Date().toISOString(), userId]
    );
  }

  /**
   * Update password
   */
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.db.execute(
      'UPDATE users SET password = ?, updated_at = ? WHERE id = ?',
      [hashedPassword, new Date().toISOString(), userId]
    );
  }

  /**
   * Create loyalty points account for user
   */
  async createLoyaltyAccount(userId: string): Promise<void> {
    const id = generateId('loyalty');
    const now = new Date().toISOString();
    
    await this.db.execute(
      `INSERT INTO loyalty_points (id, user_id, points, lifetime, tier, created_at, updated_at)
       VALUES (?, ?, 0, 0, 'Bronze', ?, ?)`,
      [id, userId, now, now]
    );
  }

  /**
   * Get user's loyalty points
   */
  async getLoyaltyPoints(userId: string): Promise<{ points: number; tier: string } | null> {
    return await this.db.queryFirst<{ points: number; tier: string }>(
      'SELECT points, tier FROM loyalty_points WHERE user_id = ?',
      [userId]
    );
  }

  /**
   * Add loyalty points
   */
  async addLoyaltyPoints(userId: string, points: number): Promise<void> {
    await this.db.execute(
      `UPDATE loyalty_points 
       SET points = points + ?, lifetime = lifetime + ?, updated_at = ?
       WHERE user_id = ?`,
      [points, points, new Date().toISOString(), userId]
    );

    // Update tier based on lifetime points
    await this.updateLoyaltyTier(userId);
  }

  /**
   * Update loyalty tier based on lifetime points
   */
  private async updateLoyaltyTier(userId: string): Promise<void> {
    const result = await this.db.queryFirst<{ lifetime: number }>(
      'SELECT lifetime FROM loyalty_points WHERE user_id = ?',
      [userId]
    );

    if (!result) return;

    let tier = 'Bronze';
    if (result.lifetime >= 5000) tier = 'Platinum';
    else if (result.lifetime >= 2000) tier = 'Gold';
    else if (result.lifetime >= 500) tier = 'Silver';

    await this.db.execute(
      'UPDATE loyalty_points SET tier = ? WHERE user_id = ?',
      [tier, userId]
    );
  }

  /**
   * Generate unique referral code
   */
  private generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Convert User to AuthUser
   */
  private toAuthUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      role: user.role,
      image: user.image || undefined
    };
  }

  /**
   * Get all users (admin only)
   */
  async findAll(limit: number = 50, offset: number = 0): Promise<User[]> {
    return await this.db.query<User>(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
  }

  /**
   * Count total users
   */
  async count(): Promise<number> {
    const result = await this.db.queryFirst<{ total: number }>(
      'SELECT COUNT(*) as total FROM users'
    );
    return result?.total || 0;
  }
}