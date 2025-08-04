-- Truth Hair D1 Database Schema

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  parent_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  compare_at_price REAL,
  sku TEXT NOT NULL,
  
  -- Hair-specific fields
  hair_type TEXT DEFAULT 'HUMAN_HAIR',
  quality TEXT DEFAULT 'STANDARD',
  inches TEXT, -- JSON array stored as text
  density TEXT,
  texture TEXT,
  origin TEXT,
  color TEXT,
  
  -- Cap/Construction fields
  cap_construction TEXT,
  cap_size TEXT DEFAULT 'Medium',
  lace_type TEXT,
  parting_space TEXT,
  
  -- Features
  baby_hair INTEGER DEFAULT 0,
  pre_plucked INTEGER DEFAULT 0,
  bleached_knots INTEGER DEFAULT 0,
  
  -- Status fields
  is_active INTEGER DEFAULT 1,
  stock INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ACTIVE',
  featured INTEGER DEFAULT 0,
  
  -- Category and SEO
  category_id TEXT NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  tags TEXT, -- JSON array stored as text
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  alt TEXT,
  display_order INTEGER DEFAULT 0,
  product_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  email_verified DATETIME,
  password TEXT,
  name TEXT,
  image TEXT,
  role TEXT DEFAULT 'CUSTOMER',
  phone TEXT,
  referral_code TEXT,
  referred_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'PENDING',
  subtotal REAL NOT NULL,
  tax REAL NOT NULL,
  shipping REAL NOT NULL,
  discount REAL DEFAULT 0,
  total REAL NOT NULL,
  shipping_address TEXT NOT NULL, -- JSON stored as text
  billing_address TEXT NOT NULL, -- JSON stored as text
  payment_method TEXT,
  payment_intent_id TEXT,
  notes TEXT,
  tracking_number TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  variant_id TEXT,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  total REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  rating INTEGER NOT NULL,
  title TEXT,
  comment TEXT,
  images TEXT, -- JSON array stored as text
  helpful INTEGER DEFAULT 0,
  verified INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE(user_id, product_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);