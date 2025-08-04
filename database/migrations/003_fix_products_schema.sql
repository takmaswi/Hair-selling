-- Fix Products Schema Migration
-- Adds missing columns: hair_type, quality, inches, density, texture, origin, is_active, stock

-- First, drop the existing products table and all dependent tables
-- We need to drop in correct order due to foreign key constraints

DROP TABLE IF EXISTS newsletter;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS loyalty_points;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS wishlists;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS users;

-- Recreate Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT UNIQUE NOT NULL,
    email_verified DATETIME,
    password TEXT,
    name TEXT,
    image TEXT,
    role TEXT DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN')),
    phone TEXT,
    referral_code TEXT UNIQUE,
    referred_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);

-- Accounts table (for OAuth)
CREATE TABLE accounts (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(provider, provider_account_id)
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);

-- Sessions table
CREATE TABLE sessions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    session_token TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    expires DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Categories table
CREATE TABLE categories (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    parent_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- Products table with ALL required columns
CREATE TABLE products (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),
    sku TEXT UNIQUE NOT NULL,
    
    -- New required columns
    hair_type TEXT DEFAULT 'HUMAN_HAIR' CHECK (hair_type IN ('HUMAN_HAIR', 'SYNTHETIC', 'BLEND', 'HEAT_FRIENDLY')),
    quality TEXT DEFAULT 'STANDARD' CHECK (quality IN ('PREMIUM', 'STANDARD', 'LUXURY', 'BASIC')),
    inches TEXT, -- JSON array stored as text, e.g., '["12","14","16","18"]'
    density TEXT DEFAULT '130%',
    texture TEXT DEFAULT 'Straight',
    origin TEXT DEFAULT 'Brazilian',
    is_active INTEGER DEFAULT 1,
    stock INTEGER DEFAULT 0,
    
    -- Existing columns
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK')),
    featured INTEGER DEFAULT 0,
    category_id TEXT NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    tags TEXT, -- JSON array stored as text
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_hair_type ON products(hair_type);
CREATE INDEX idx_products_quality ON products(quality);
CREATE INDEX idx_products_is_active ON products(is_active);

-- Product Images table
CREATE TABLE product_images (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    url TEXT NOT NULL,
    alt TEXT,
    display_order INTEGER DEFAULT 0,
    product_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- Product Variants table
CREATE TABLE product_variants (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    color TEXT,
    length TEXT,
    density TEXT,
    texture TEXT,
    images TEXT, -- JSON array stored as text
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);

-- Orders table
CREATE TABLE orders (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    order_number TEXT UNIQUE NOT NULL,
    user_id TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED')),
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    shipping DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT NOT NULL, -- JSON stored as text
    billing_address TEXT NOT NULL, -- JSON stored as text
    payment_method TEXT,
    payment_intent_id TEXT,
    notes TEXT,
    tracking_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);

-- Order Items table
CREATE TABLE order_items (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    variant_id TEXT,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Cart Items table
CREATE TABLE cart_items (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    variant_id TEXT,
    quantity INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id, variant_id)
);

CREATE INDEX idx_cart_items_user ON cart_items(user_id);

-- Reviews table
CREATE TABLE reviews (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    images TEXT, -- JSON array stored as text
    helpful INTEGER DEFAULT 0,
    verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Wishlists table
CREATE TABLE wishlists (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlists_user ON wishlists(user_id);

-- Appointments table
CREATE TABLE appointments (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    date DATETIME NOT NULL,
    duration INTEGER NOT NULL,
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    meeting_link TEXT,
    reminder_sent INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_appointments_user ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Loyalty Points table
CREATE TABLE loyalty_points (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT UNIQUE NOT NULL,
    points INTEGER DEFAULT 0,
    lifetime INTEGER DEFAULT 0,
    tier TEXT DEFAULT 'Bronze',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_loyalty_user ON loyalty_points(user_id);

-- Addresses table
CREATE TABLE addresses (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    line1 TEXT NOT NULL,
    line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL,
    phone TEXT,
    is_default INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

-- Newsletter table
CREATE TABLE newsletter (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT UNIQUE NOT NULL,
    subscribed INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_newsletter_email ON newsletter(email);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_users_timestamp AFTER UPDATE ON users
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_categories_timestamp AFTER UPDATE ON categories
BEGIN
    UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_products_timestamp AFTER UPDATE ON products
BEGIN
    UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_product_variants_timestamp AFTER UPDATE ON product_variants
BEGIN
    UPDATE product_variants SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_orders_timestamp AFTER UPDATE ON orders
BEGIN
    UPDATE orders SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_cart_items_timestamp AFTER UPDATE ON cart_items
BEGIN
    UPDATE cart_items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_reviews_timestamp AFTER UPDATE ON reviews
BEGIN
    UPDATE reviews SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_appointments_timestamp AFTER UPDATE ON appointments
BEGIN
    UPDATE appointments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_loyalty_points_timestamp AFTER UPDATE ON loyalty_points
BEGIN
    UPDATE loyalty_points SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_addresses_timestamp AFTER UPDATE ON addresses
BEGIN
    UPDATE addresses SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_newsletter_timestamp AFTER UPDATE ON newsletter
BEGIN
    UPDATE newsletter SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;