-- Seed Data for Truth Hair Database

-- Insert Categories
INSERT INTO categories (id, name, slug, description, image) VALUES
('cat_human_hair', 'Human Hair Wigs', 'human-hair-wigs', 'Premium 100% human hair wigs for natural look and feel', '/assets/categories/human-hair.jpg'),
('cat_synthetic', 'Synthetic Wigs', 'synthetic-wigs', 'High-quality synthetic fiber wigs', '/assets/categories/synthetic.jpg'),
('cat_lace_front', 'Lace Front Wigs', 'lace-front-wigs', 'Natural hairline lace front wigs', '/assets/categories/lace-front.jpg'),
('cat_full_lace', 'Full Lace Wigs', 'full-lace-wigs', 'Versatile full lace construction wigs', '/assets/categories/full-lace.jpg'),
('cat_closures', 'Closures & Frontals', 'closures-frontals', 'Hair closures and frontals for perfect finish', '/assets/categories/closures.jpg'),
('cat_bundles', 'Hair Bundles', 'hair-bundles', 'Virgin hair bundles and extensions', '/assets/categories/bundles.jpg');

-- Insert Sample Products
INSERT INTO products (id, name, slug, description, price, compare_at_price, sku, status, featured, category_id, seo_title, seo_description, tags) VALUES
('prod_001', 'Brazilian Body Wave Wig', 'brazilian-body-wave-wig', 'Luxurious Brazilian human hair wig with natural body wave pattern. Pre-plucked hairline with baby hair for realistic appearance.', 299.99, 399.99, 'BWW-001', 'ACTIVE', 1, 'cat_human_hair', 'Brazilian Body Wave Human Hair Wig | Truth Hair', 'Premium Brazilian body wave wig made from 100% human hair. Natural looking, pre-plucked hairline with baby hair.', '["brazilian","body wave","human hair","lace front"]'),

('prod_002', 'Straight Bob Lace Front', 'straight-bob-lace-front', 'Chic straight bob style lace front wig. Perfect for everyday wear with minimal styling required.', 189.99, 249.99, 'SBL-001', 'ACTIVE', 1, 'cat_lace_front', 'Straight Bob Lace Front Wig | Truth Hair', 'Stylish straight bob lace front wig. Easy to wear and maintain, perfect for any occasion.', '["bob","straight","lace front","synthetic"]'),

('prod_003', 'Curly Afro Full Lace', 'curly-afro-full-lace', 'Beautiful curly afro texture full lace wig. Versatile styling options with 360-degree natural hairline.', 459.99, 599.99, 'CAF-001', 'ACTIVE', 1, 'cat_full_lace', 'Curly Afro Full Lace Wig | Truth Hair', 'Premium curly afro full lace wig with 360-degree styling versatility. Made from high-quality human hair.', '["afro","curly","full lace","human hair"]'),

('prod_004', 'Deep Wave Bundle Deal', 'deep-wave-bundle-deal', '3 bundles of virgin deep wave hair. Available in lengths from 12" to 30". Can be dyed and styled.', 249.99, 329.99, 'DWB-001', 'ACTIVE', 0, 'cat_bundles', 'Deep Wave Hair Bundle Deal | Truth Hair', 'Virgin deep wave hair bundles, 3-piece set. Can be colored and heat styled to your preference.', '["bundles","deep wave","virgin hair","extensions"]'),

('prod_005', 'HD Lace Closure 4x4', 'hd-lace-closure-4x4', 'Ultra-thin HD lace closure for seamless blend. Pre-plucked with natural hairline.', 89.99, 129.99, 'HDC-001', 'ACTIVE', 0, 'cat_closures', 'HD Lace Closure 4x4 | Truth Hair', 'High-definition lace closure with pre-plucked hairline. Perfect for completing your install.', '["closure","hd lace","4x4","human hair"]'),

('prod_006', 'Water Wave Synthetic Wig', 'water-wave-synthetic-wig', 'Affordable water wave synthetic wig with natural appearance. Heat-resistant fibers up to 180°C.', 79.99, 119.99, 'WWS-001', 'ACTIVE', 0, 'cat_synthetic', 'Water Wave Synthetic Wig | Truth Hair', 'Beautiful water wave pattern synthetic wig. Heat-resistant and budget-friendly option.', '["synthetic","water wave","affordable","heat resistant"]');

-- Insert Product Images
INSERT INTO product_images (product_id, url, alt, display_order) VALUES
('prod_001', '/assets/products/brazilian-body-wave-1.jpg', 'Brazilian Body Wave Wig Front View', 1),
('prod_001', '/assets/products/brazilian-body-wave-2.jpg', 'Brazilian Body Wave Wig Side View', 2),
('prod_001', '/assets/products/brazilian-body-wave-3.jpg', 'Brazilian Body Wave Wig Back View', 3),

('prod_002', '/assets/products/straight-bob-1.jpg', 'Straight Bob Lace Front View', 1),
('prod_002', '/assets/products/straight-bob-2.jpg', 'Straight Bob Lace Side View', 2),

('prod_003', '/assets/products/curly-afro-1.jpg', 'Curly Afro Full Lace Front', 1),
('prod_003', '/assets/products/curly-afro-2.jpg', 'Curly Afro Full Lace Detail', 2),

('prod_004', '/assets/products/deep-wave-bundle-1.jpg', 'Deep Wave Bundle Set', 1),
('prod_004', '/assets/products/deep-wave-bundle-2.jpg', 'Deep Wave Bundle Texture', 2),

('prod_005', '/assets/products/hd-closure-1.jpg', 'HD Lace Closure Front', 1),
('prod_005', '/assets/products/hd-closure-2.jpg', 'HD Lace Closure Detail', 2),

('prod_006', '/assets/products/water-wave-synthetic-1.jpg', 'Water Wave Synthetic Front', 1),
('prod_006', '/assets/products/water-wave-synthetic-2.jpg', 'Water Wave Synthetic Side', 2);

-- Insert Product Variants
INSERT INTO product_variants (product_id, name, sku, price, stock, color, length, density, texture) VALUES
-- Brazilian Body Wave variants
('prod_001', '12 inch - Natural Black', 'BWW-001-12-1B', 299.99, 5, 'Natural Black', '12 inches', '130%', 'Body Wave'),
('prod_001', '16 inch - Natural Black', 'BWW-001-16-1B', 349.99, 3, 'Natural Black', '16 inches', '130%', 'Body Wave'),
('prod_001', '20 inch - Natural Black', 'BWW-001-20-1B', 399.99, 2, 'Natural Black', '20 inches', '130%', 'Body Wave'),

-- Straight Bob variants
('prod_002', '10 inch - Black', 'SBL-001-10-BLK', 189.99, 10, 'Black', '10 inches', '150%', 'Straight'),
('prod_002', '10 inch - Brown', 'SBL-001-10-BRN', 189.99, 8, 'Brown', '10 inches', '150%', 'Straight'),
('prod_002', '12 inch - Black', 'SBL-001-12-BLK', 209.99, 6, 'Black', '12 inches', '150%', 'Straight'),

-- Curly Afro variants
('prod_003', '14 inch - Natural', 'CAF-001-14-NAT', 459.99, 3, 'Natural', '14 inches', '180%', 'Kinky Curly'),
('prod_003', '16 inch - Natural', 'CAF-001-16-NAT', 499.99, 2, 'Natural', '16 inches', '180%', 'Kinky Curly'),

-- Deep Wave Bundle variants
('prod_004', '3x12 inch Bundle', 'DWB-001-3x12', 249.99, 7, 'Natural Black', '12 inches', 'Standard', 'Deep Wave'),
('prod_004', '3x16 inch Bundle', 'DWB-001-3x16', 329.99, 5, 'Natural Black', '16 inches', 'Standard', 'Deep Wave'),
('prod_004', '3x20 inch Bundle', 'DWB-001-3x20', 399.99, 3, 'Natural Black', '20 inches', 'Standard', 'Deep Wave'),

-- HD Closure variants
('prod_005', '4x4 Straight', 'HDC-001-4x4-STR', 89.99, 12, 'Natural Black', '4x4', 'Standard', 'Straight'),
('prod_005', '4x4 Body Wave', 'HDC-001-4x4-BW', 89.99, 10, 'Natural Black', '4x4', 'Standard', 'Body Wave'),
('prod_005', '4x4 Deep Wave', 'HDC-001-4x4-DW', 89.99, 8, 'Natural Black', '4x4', 'Standard', 'Deep Wave'),

-- Water Wave Synthetic variants
('prod_006', '18 inch - Black', 'WWS-001-18-BLK', 79.99, 15, 'Black', '18 inches', '150%', 'Water Wave'),
('prod_006', '18 inch - Dark Brown', 'WWS-001-18-DBR', 79.99, 12, 'Dark Brown', '18 inches', '150%', 'Water Wave'),
('prod_006', '22 inch - Black', 'WWS-001-22-BLK', 99.99, 8, 'Black', '22 inches', '150%', 'Water Wave');

-- Insert test user (password: 'password123' - should be hashed in production)
INSERT INTO users (id, email, name, role, phone) VALUES
('user_admin', 'admin@truthhair.com', 'Admin User', 'ADMIN', '+263771234567'),
('user_test', 'customer@example.com', 'Test Customer', 'CUSTOMER', '+263779876543');

-- Insert sample reviews
INSERT INTO reviews (user_id, product_id, rating, title, comment, verified) VALUES
('user_test', 'prod_001', 5, 'Amazing Quality!', 'This wig is absolutely beautiful! The hair is so soft and the lace melts perfectly. Worth every penny!', 1),
('user_test', 'prod_002', 4, 'Great for the price', 'Nice synthetic wig for everyday wear. Looks natural and is easy to maintain.', 1),
('user_test', 'prod_003', 5, 'Love the versatility', 'Full lace construction allows for so many styling options. The curls are gorgeous!', 1);

-- Insert newsletter subscribers
INSERT INTO newsletter (email) VALUES
('subscriber1@example.com'),
('subscriber2@example.com'),
('subscriber3@example.com');