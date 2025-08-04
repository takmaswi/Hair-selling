/**
 * Database Types and Interfaces
 * Type definitions for all database models
 */

// Enums
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}

export enum HairType {
  HUMAN_HAIR = 'HUMAN_HAIR',
  SYNTHETIC = 'SYNTHETIC',
  BLEND = 'BLEND',
  HEAT_FRIENDLY = 'HEAT_FRIENDLY'
}

export enum QualityLevel {
  PREMIUM = 'PREMIUM',
  STANDARD = 'STANDARD',
  LUXURY = 'LUXURY',
  BASIC = 'BASIC'
}

export enum TagCategory {
  COLOR = 'COLOR',
  STYLE = 'STYLE',
  FEATURE = 'FEATURE',
  LENGTH = 'LENGTH',
  TEXTURE = 'TEXTURE',
  ORIGIN = 'ORIGIN'
}

// User types
export interface User {
  id: string;
  email: string;
  email_verified?: Date | null;
  password?: string | null;
  name?: string | null;
  image?: string | null;
  role: UserRole;
  phone?: string | null;
  referral_code?: string | null;
  referred_by?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Account {
  id: string;
  user_id: string;
  type: string;
  provider: string;
  provider_account_id: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
}

export interface Session {
  id: string;
  session_token: string;
  user_id: string;
  expires: Date;
}

// Product types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parent_id?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number | null;
  sku: string;
  
  // Hair-specific fields
  hair_type: HairType;
  quality: QualityLevel;
  inches?: string[] | null; // Array of length options like ["12", "14", "16"]
  density?: string | null;
  texture?: string | null;
  origin?: string | null;
  color?: string | null;
  
  // Cap/Construction fields
  cap_construction?: string | null;
  cap_size?: string | null;
  lace_type?: string | null;
  parting_space?: string | null;
  
  // Features
  baby_hair?: boolean;
  pre_plucked?: boolean;
  bleached_knots?: boolean;
  
  // Status fields
  is_active: boolean;
  stock: number;
  status: ProductStatus;
  featured: boolean;
  
  // Category and SEO
  category_id: string;
  seo_title?: string | null;
  seo_description?: string | null;
  tags?: string[] | null;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  
  // Relations
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
  reviews?: Review[];
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  display_order: number;
  product_id: string;
  created_at: Date;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  color?: string | null;
  length?: string | null;
  density?: string | null;
  texture?: string | null;
  images?: string[] | null;
  created_at: Date;
  updated_at: Date;
}

// Order types
export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  email: string;
  phone?: string | null;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shipping_address: Address;
  billing_address: Address;
  payment_method?: string | null;
  payment_intent_id?: string | null;
  notes?: string | null;
  tracking_number?: string | null;
  created_at: Date;
  updated_at: Date;
  // Relations
  user?: User;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string | null;
  quantity: number;
  price: number;
  total: number;
  created_at: Date;
  // Relations
  product?: Product;
  variant?: ProductVariant;
}

// Cart types
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  variant_id?: string | null;
  quantity: number;
  created_at: Date;
  updated_at: Date;
  // Relations
  product?: Product;
  variant?: ProductVariant;
}

// Review types
export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  images?: string[] | null;
  helpful: number;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
  // Relations
  user?: User;
  product?: Product;
}

// Wishlist types
export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: Date;
  // Relations
  product?: Product;
}

// Appointment types
export interface Appointment {
  id: string;
  user_id: string;
  type: string;
  date: Date;
  duration: number;
  status: string;
  notes?: string | null;
  meeting_link?: string | null;
  reminder_sent: boolean;
  created_at: Date;
  updated_at: Date;
  // Relations
  user?: User;
}

// Loyalty types
export interface LoyaltyPoints {
  id: string;
  user_id: string;
  points: number;
  lifetime: number;
  tier: string;
  created_at: Date;
  updated_at: Date;
  // Relations
  user?: User;
}

// Address types
export interface Address {
  id: string;
  user_id?: string;
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string | null;
  is_default?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Newsletter types
export interface Newsletter {
  id: string;
  email: string;
  subscribed: boolean;
  created_at: Date;
  updated_at: Date;
}

// Helper types for API responses
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filter and query types
export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  length?: string;
  texture?: string;
  hair_type?: HairType;
  quality?: QualityLevel;
  density?: string;
  origin?: string;
  status?: ProductStatus;
  featured?: boolean;
  is_active?: boolean;
  search?: string;
}

export interface OrderFilter {
  status?: OrderStatus;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Create/Update DTOs
export interface CreateUserDto {
  email: string;
  password?: string;
  name?: string;
  phone?: string;
  role?: UserRole;
}

export interface UpdateUserDto {
  name?: string;
  phone?: string;
  image?: string;
}

export interface CreateProductDto {
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  sku: string;
  category_id: string;
  hair_type: HairType;
  quality: QualityLevel;
  inches?: string[];
  density?: string;
  texture?: string;
  origin?: string;
  is_active?: boolean;
  stock?: number;
  status?: ProductStatus;
  featured?: boolean;
  seo_title?: string;
  seo_description?: string;
  tags?: string[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface CreateOrderDto {
  user_id?: string;
  email: string;
  phone?: string;
  items: Array<{
    product_id: string;
    variant_id?: string;
    quantity: number;
    price: number;
  }>;
  shipping_address: Address;
  billing_address: Address;
  payment_method?: string;
  notes?: string;
}

export interface CreateReviewDto {
  product_id: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
}

// Authentication types
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  image?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name?: string;
  phone?: string;
}

// Tag types for product management
export interface Tag {
  id: string;
  name: string;
  category: TagCategory;
  slug: string;
}

// Admin Dashboard specific types
export interface ProductWithDetails extends Product {
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  totalReviews?: number;
  averageRating?: number;
}

export interface AdminProductFilter extends ProductFilter {
  sortBy?: 'name' | 'price' | 'created_at' | 'stock' | 'featured';
  sortOrder?: 'asc' | 'desc';
}

// Predefined tag options for admin dashboard
export const PREDEFINED_TAGS: Record<TagCategory, Tag[]> = {
  [TagCategory.COLOR]: [
    { id: 'black', name: 'Black', category: TagCategory.COLOR, slug: 'black' },
    { id: 'brown', name: 'Brown', category: TagCategory.COLOR, slug: 'brown' },
    { id: 'blonde', name: 'Blonde', category: TagCategory.COLOR, slug: 'blonde' },
    { id: 'red', name: 'Red', category: TagCategory.COLOR, slug: 'red' },
    { id: 'gray', name: 'Gray', category: TagCategory.COLOR, slug: 'gray' },
    { id: 'ombre', name: 'Ombre', category: TagCategory.COLOR, slug: 'ombre' },
    { id: 'highlighted', name: 'Highlighted', category: TagCategory.COLOR, slug: 'highlighted' },
  ],
  [TagCategory.STYLE]: [
    { id: 'straight', name: 'Straight', category: TagCategory.STYLE, slug: 'straight' },
    { id: 'wavy', name: 'Wavy', category: TagCategory.STYLE, slug: 'wavy' },
    { id: 'curly', name: 'Curly', category: TagCategory.STYLE, slug: 'curly' },
    { id: 'kinky', name: 'Kinky', category: TagCategory.STYLE, slug: 'kinky' },
    { id: 'body-wave', name: 'Body Wave', category: TagCategory.STYLE, slug: 'body-wave' },
    { id: 'deep-wave', name: 'Deep Wave', category: TagCategory.STYLE, slug: 'deep-wave' },
    { id: 'bob', name: 'Bob', category: TagCategory.STYLE, slug: 'bob' },
  ],
  [TagCategory.FEATURE]: [
    { id: 'lace-front', name: 'Lace Front', category: TagCategory.FEATURE, slug: 'lace-front' },
    { id: 'full-lace', name: 'Full Lace', category: TagCategory.FEATURE, slug: 'full-lace' },
    { id: 'pre-plucked', name: 'Pre-Plucked', category: TagCategory.FEATURE, slug: 'pre-plucked' },
    { id: 'baby-hair', name: 'Baby Hair', category: TagCategory.FEATURE, slug: 'baby-hair' },
    { id: 'glueless', name: 'Glueless', category: TagCategory.FEATURE, slug: 'glueless' },
    { id: 'heat-resistant', name: 'Heat Resistant', category: TagCategory.FEATURE, slug: 'heat-resistant' },
  ],
  [TagCategory.LENGTH]: [
    { id: '10-inch', name: '10"', category: TagCategory.LENGTH, slug: '10-inch' },
    { id: '12-inch', name: '12"', category: TagCategory.LENGTH, slug: '12-inch' },
    { id: '14-inch', name: '14"', category: TagCategory.LENGTH, slug: '14-inch' },
    { id: '16-inch', name: '16"', category: TagCategory.LENGTH, slug: '16-inch' },
    { id: '18-inch', name: '18"', category: TagCategory.LENGTH, slug: '18-inch' },
    { id: '20-inch', name: '20"', category: TagCategory.LENGTH, slug: '20-inch' },
    { id: '22-inch', name: '22"', category: TagCategory.LENGTH, slug: '22-inch' },
    { id: '24-inch', name: '24"', category: TagCategory.LENGTH, slug: '24-inch' },
    { id: '26-inch', name: '26"', category: TagCategory.LENGTH, slug: '26-inch' },
    { id: '28-inch', name: '28"', category: TagCategory.LENGTH, slug: '28-inch' },
    { id: '30-inch', name: '30"', category: TagCategory.LENGTH, slug: '30-inch' },
  ],
  [TagCategory.TEXTURE]: [
    { id: 'silky', name: 'Silky', category: TagCategory.TEXTURE, slug: 'silky' },
    { id: 'yaki', name: 'Yaki', category: TagCategory.TEXTURE, slug: 'yaki' },
    { id: 'coarse', name: 'Coarse', category: TagCategory.TEXTURE, slug: 'coarse' },
    { id: 'fine', name: 'Fine', category: TagCategory.TEXTURE, slug: 'fine' },
  ],
  [TagCategory.ORIGIN]: [
    { id: 'brazilian', name: 'Brazilian', category: TagCategory.ORIGIN, slug: 'brazilian' },
    { id: 'peruvian', name: 'Peruvian', category: TagCategory.ORIGIN, slug: 'peruvian' },
    { id: 'indian', name: 'Indian', category: TagCategory.ORIGIN, slug: 'indian' },
    { id: 'malaysian', name: 'Malaysian', category: TagCategory.ORIGIN, slug: 'malaysian' },
    { id: 'vietnamese', name: 'Vietnamese', category: TagCategory.ORIGIN, slug: 'vietnamese' },
  ],
};

// Available length options
export const AVAILABLE_LENGTHS = ['10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30'];