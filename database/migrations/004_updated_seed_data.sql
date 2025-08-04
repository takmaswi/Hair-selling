-- Updated Seed Data for Truth Hair Database with new columns

-- Insert Categories
INSERT INTO categories (id, name, slug, description, image) VALUES
('cat_human_hair', 'Human Hair Wigs', 'human-hair-wigs', 'Premium 100% human hair wigs for natural look and feel', '/assets/categories/human-hair.jpg'),
('cat_synthetic', 'Synthetic Wigs', 'synthetic-wigs', 'High-quality synthetic fiber wigs', '/assets/categories/synthetic.jpg'),
('cat_lace_front', 'Lace Front Wigs', 'lace-front-wigs', 'Natural hairline lace front wigs', '/assets/categories/lace-front.jpg'),
('cat_full_lace', 'Full Lace Wigs', 'full-lace-wigs', 'Versatile full lace construction wigs', '/assets/categories/full-lace.jpg'),
('cat_closures', 'Closures & Frontals', 'closures-frontals', 'Hair closures and frontals for perfect finish', '/assets/categories/closures.jpg'),
('cat_bundles', 'Hair Bundles', 'hair-bundles', 'Virgin hair bundles and extensions', '/assets/categories/bundles.jpg');

-- Insert Sample Products with all new columns
INSERT INTO products (
    id, name, slug, description, price, compare_at_price, sku, 
    hair_type, quality, inches, density, texture, origin, 
    is_active, stock, status, featured, category_id, 
    seo_title, seo_description, tags
) VALUES
(
    'prod_001', 
    'Brazilian Body Wave Wig', 
    'brazilian-body-wave-wig', 
    'Luxurious Brazilian human hair wig with natural body wave pattern. Pre-plucked hairline with baby hair for realistic appearance.', 
    299.99, 
    399.99, 
    'BWW-001', 
    'HUMAN_HAIR',
    'PREMIUM',
    '["12","14","16","18","20","22"]',
    '130%',
    'Body Wave',
    'Brazilian',
    1,
    15,
    'ACTIVE', 
    1, 
    'cat_human_hair', 
    'Brazilian Body Wave Human Hair Wig | Truth Hair', 
    'Premium Brazilian body wave wig made from 100% human hair. Natural looking, pre-plucked hairline with baby hair.', 
    '["brazilian","body wave","human hair","lace front"]'
),
(
    'prod_002', 
    'Straight Bob Lace Front', 
    'straight-bob-lace-front', 
    'Chic straight bob style lace front wig. Perfect for everyday wear with minimal styling required.', 
    189.99, 
    249.99, 
    'SBL-001', 
    'SYNTHETIC',
    'STANDARD',
    '["10","12","14"]',
    '150%',
    'Straight',
    'Synthetic',
    1,
    24,
    'ACTIVE', 
    1, 
    'cat_lace_front', 
    'Straight Bob Lace Front Wig | Truth Hair', 
    'Stylish straight bob lace front wig. Easy to wear and maintain, perfect for any occasion.', 
    '["bob","straight","lace front","synthetic"]'
),
(
    'prod_003', 
    'Curly Afro Full Lace', 
    'curly-afro-full-lace', 
    'Beautiful curly afro texture full lace wig. Versatile styling options with 360-degree natural hairline.', 
    459.99, 
    599.99, 
    'CAF-001', 
    'HUMAN_HAIR',
    'LUXURY',
    '["14","16","18","20"]',
    '180%',
    'Kinky Curly',
    'Peruvian',
    1,
    8,
    'ACTIVE', 
    1, 
    'cat_full_lace', 
    'Curly Afro Full Lace Wig | Truth Hair', 
    'Premium curly afro full lace wig with 360-degree styling versatility. Made from high-quality human hair.', 
    '["afro","curly","full lace","human hair"]'
),
(
    'prod_004', 
    'Deep Wave Bundle Deal', 
    'deep-wave-bundle-deal', 
    '3 bundles of virgin deep wave hair. Available in lengths from 12" to 30". Can be dyed and styled.', 
    249.99, 
    329.99, 
    'DWB-001', 
    'HUMAN_HAIR',
    'PREMIUM',
    '["12","14","16","18","20","22","24","26","28","30"]',
    'Standard',
    'Deep Wave',
    'Malaysian',
    1,
    20,
    'ACTIVE', 
    0, 
    'cat_bundles', 
    'Deep Wave Hair Bundle Deal | Truth Hair', 
    'Virgin deep wave hair bundles, 3-piece set. Can be colored and heat styled to your preference.', 
    '["bundles","deep wave","virgin hair","extensions"]'
),
(
    'prod_005', 
    'HD Lace Closure 4x4', 
    'hd-lace-closure-4x4', 
    'Ultra-thin HD lace closure for seamless blend. Pre-plucked with natural hairline.', 
    89.99, 
    129.99, 
    'HDC-001', 
    'HUMAN_HAIR',
    'PREMIUM',
    '["4x4"]',
    'Standard',
    'Multiple',
    'Indian',
    1,
    30,
    'ACTIVE', 
    0, 
    'cat_closures', 
    'HD Lace Closure 4x4 | Truth Hair', 
    'High-definition lace closure with pre-plucked hairline. Perfect for completing your install.', 
    '["closure","hd lace","4x4","human hair"]'
),
(
    'prod_006', 
    'Water Wave Synthetic Wig', 
    'water-wave-synthetic-wig', 
    'Affordable water wave synthetic wig with natural appearance. Heat-resistant fibers up to 180°C.', 
    79.99, 
    119.99, 
    'WWS-001', 
    'HEAT_FRIENDLY',
    'BASIC',
    '["18","20","22","24"]',
    '150%',
    'Water Wave',
    'Synthetic',
    1,
    35,
    'ACTIVE', 
    0, 
    'cat_synthetic', 
    'Water Wave Synthetic Wig | Truth Hair', 
    'Beautiful water wave pattern synthetic wig. Heat-resistant and budget-friendly option.', 
    '["synthetic","water wave","affordable","heat resistant"]'
),
(
    'prod_007',
    'Blonde Balayage Lace Front',
    'blonde-balayage-lace-front',
    'Stunning blonde balayage human hair lace front wig. Hand-painted highlights for natural sun-kissed look.',
    389.99,
    499.99,
    'BBL-001',
    'HUMAN_HAIR',
    'LUXURY',
    '["16","18","20","22","24"]',
    '150%',
    'Straight',
    'European',
    1,
    5,
    'ACTIVE',
    1,
    'cat_lace_front',
    'Blonde Balayage Lace Front Wig | Truth Hair',
    'Luxury blonde balayage human hair wig with hand-painted highlights and pre-plucked lace front.',
    '["blonde","balayage","human hair","lace front","european"]'
),
(
    'prod_008',
    'Short Pixie Cut Wig',
    'short-pixie-cut-wig',
    'Trendy short pixie cut wig with tapered sides. Low maintenance style perfect for active lifestyle.',
    149.99,
    199.99,
    'SPC-001',
    'BLEND',
    'STANDARD',
    '["6","8"]',
    '130%',
    'Straight',
    'Mixed',
    1,
    18,
    'ACTIVE',
    0,
    'cat_synthetic',
    'Short Pixie Cut Wig | Truth Hair',
    'Stylish short pixie cut wig with human hair blend. Easy to style and maintain.',
    '["pixie","short","blend","low maintenance"]'
);

-- Insert Product Images
INSERT INTO product_images (product_id, url, alt, display_order) VALUES
('prod_001', '/assets/products/brazilian-body-wave-1.jpg', 'Brazilian Body Wave Wig Front View', 1),
('prod_001', '/assets/products/brazilian-body-wave-2.jpg', 'Brazilian Body Wave Wig Side View', 2),
('prod_001', '/assets/products/brazilian-body-wave-3.jpg', 'Brazilian Body Wave Wig Back View', 3),
('prod_001', '/assets/products/brazilian-body-wave-360.jpg', 'Brazilian Body Wave Wig 360 View', 4),

('prod_002', '/assets/products/straight-bob-1.jpg', 'Straight Bob Lace Front View', 1),
('prod_002', '/assets/products/straight-bob-2.jpg', 'Straight Bob Lace Side View', 2),

('prod_003', '/assets/products/curly-afro-1.jpg', 'Curly Afro Full Lace Front', 1),
('prod_003', '/assets/products/curly-afro-2.jpg', 'Curly Afro Full Lace Detail', 2),
('prod_003', '/assets/products/curly-afro-3.jpg', 'Curly Afro Full Lace Back', 3),

('prod_004', '/assets/products/deep-wave-bundle-1.jpg', 'Deep Wave Bundle Set', 1),
('prod_004', '/assets/products/deep-wave-bundle-2.jpg', 'Deep Wave Bundle Texture', 2),

('prod_005', '/assets/products/hd-closure-1.jpg', 'HD Lace Closure Front', 1),
('prod_005', '/assets/products/hd-closure-2.jpg', 'HD Lace Closure Detail', 2),

('prod_006', '/assets/products/water-wave-synthetic-1.jpg', 'Water Wave Synthetic Front', 1),
('prod_006', '/assets/products/water-wave-synthetic-2.jpg', 'Water Wave Synthetic Side', 2),

('prod_007', '/assets/products/blonde-balayage-1.jpg', 'Blonde Balayage Front View', 1),
('prod_007', '/assets/products/blonde-balayage-2.jpg', 'Blonde Balayage Color Detail', 2),

('prod_008', '/assets/products/pixie-cut-1.jpg', 'Pixie Cut Front View', 1),
('prod_008', '/assets/products/pixie-cut-2.jpg', 'Pixie Cut Side Profile', 2);

-- Insert Product Variants
INSERT INTO product_variants (product_id, name, sku, price, stock, color, length, density, texture) VALUES
-- Brazilian Body Wave variants
('prod_001', '12 inch - Natural Black', 'BWW-001-12-1B', 299.99, 5, 'Natural Black', '12 inches', '130%', 'Body Wave'),
('prod_001', '14 inch - Natural Black', 'BWW-001-14-1B', 324.99, 4, 'Natural Black', '14 inches', '130%', 'Body Wave'),
('prod_001', '16 inch - Natural Black', 'BWW-001-16-1B', 349.99, 3, 'Natural Black', '16 inches', '130%', 'Body Wave'),
('prod_001', '18 inch - Natural Black', 'BWW-001-18-1B', 374.99, 2, 'Natural Black', '18 inches', '130%', 'Body Wave'),
('prod_001', '20 inch - Natural Black', 'BWW-001-20-1B', 399.99, 1, 'Natural Black', '20 inches', '130%', 'Body Wave'),

-- Straight Bob variants
('prod_002', '10 inch - Black', 'SBL-001-10-BLK', 189.99, 10, 'Black', '10 inches', '150%', 'Straight'),
('prod_002', '10 inch - Brown', 'SBL-001-10-BRN', 189.99, 8, 'Brown', '10 inches', '150%', 'Straight'),
('prod_002', '12 inch - Black', 'SBL-001-12-BLK', 209.99, 6, 'Black', '12 inches', '150%', 'Straight'),

-- Curly Afro variants
('prod_003', '14 inch - Natural', 'CAF-001-14-NAT', 459.99, 3, 'Natural', '14 inches', '180%', 'Kinky Curly'),
('prod_003', '16 inch - Natural', 'CAF-001-16-NAT', 499.99, 2, 'Natural', '16 inches', '180%', 'Kinky Curly'),
('prod_003', '18 inch - Natural', 'CAF-001-18-NAT', 539.99, 2, 'Natural', '18 inches', '180%', 'Kinky Curly'),
('prod_003', '20 inch - Natural', 'CAF-001-20-NAT', 579.99, 1, 'Natural', '20 inches', '180%', 'Kinky Curly'),

-- Deep Wave Bundle variants
('prod_004', '3x12 inch Bundle', 'DWB-001-3x12', 249.99, 7, 'Natural Black', '12 inches', 'Standard', 'Deep Wave'),
('prod_004', '3x14 inch Bundle', 'DWB-001-3x14', 289.99, 6, 'Natural Black', '14 inches', 'Standard', 'Deep Wave'),
('prod_004', '3x16 inch Bundle', 'DWB-001-3x16', 329.99, 5, 'Natural Black', '16 inches', 'Standard', 'Deep Wave'),
('prod_004', '3x18 inch Bundle', 'DWB-001-3x18', 369.99, 2, 'Natural Black', '18 inches', 'Standard', 'Deep Wave'),

-- HD Closure variants
('prod_005', '4x4 Straight', 'HDC-001-4x4-STR', 89.99, 12, 'Natural Black', '4x4', 'Standard', 'Straight'),
('prod_005', '4x4 Body Wave', 'HDC-001-4x4-BW', 89.99, 10, 'Natural Black', '4x4', 'Standard', 'Body Wave'),
('prod_005', '4x4 Deep Wave', 'HDC-001-4x4-DW', 89.99, 8, 'Natural Black', '4x4', 'Standard', 'Deep Wave'),

-- Water Wave Synthetic variants
('prod_006', '18 inch - Black', 'WWS-001-18-BLK', 79.99, 15, 'Black', '18 inches', '150%', 'Water Wave'),
('prod_006', '20 inch - Black', 'WWS-001-20-BLK', 89.99, 10, 'Black', '20 inches', '150%', 'Water Wave'),
('prod_006', '22 inch - Black', 'WWS-001-22-BLK', 99.99, 8, 'Black', '22 inches', '150%', 'Water Wave'),
('prod_006', '18 inch - Dark Brown', 'WWS-001-18-DBR', 79.99, 12, 'Dark Brown', '18 inches', '150%', 'Water Wave'),

-- Blonde Balayage variants
('prod_007', '16 inch - Blonde', 'BBL-001-16-BLD', 389.99, 2, 'Blonde Balayage', '16 inches', '150%', 'Straight'),
('prod_007', '18 inch - Blonde', 'BBL-001-18-BLD', 429.99, 1, 'Blonde Balayage', '18 inches', '150%', 'Straight'),
('prod_007', '20 inch - Blonde', 'BBL-001-20-BLD', 469.99, 1, 'Blonde Balayage', '20 inches', '150%', 'Straight'),
('prod_007', '22 inch - Blonde', 'BBL-001-22-BLD', 499.99, 1, 'Blonde Balayage', '22 inches', '150%', 'Straight'),

-- Pixie Cut variants
('prod_008', '6 inch - Black', 'SPC-001-6-BLK', 149.99, 10, 'Black', '6 inches', '130%', 'Straight'),
('prod_008', '6 inch - Dark Brown', 'SPC-001-6-DBR', 149.99, 8, 'Dark Brown', '6 inches', '130%', 'Straight');

-- Insert test users
INSERT INTO users (id, email, name, role, phone) VALUES
('user_admin', 'admin@truthhair.com', 'Admin User', 'ADMIN', '+263771234567'),
('user_test', 'customer@example.com', 'Test Customer', 'CUSTOMER', '+263779876543'),
('user_vip', 'vip@example.com', 'VIP Customer', 'CUSTOMER', '+263778765432');

-- Insert sample reviews
INSERT INTO reviews (user_id, product_id, rating, title, comment, verified) VALUES
('user_test', 'prod_001', 5, 'Amazing Quality!', 'This wig is absolutely beautiful! The hair is so soft and the lace melts perfectly. Worth every penny!', 1),
('user_test', 'prod_002', 4, 'Great for the price', 'Nice synthetic wig for everyday wear. Looks natural and is easy to maintain.', 1),
('user_vip', 'prod_003', 5, 'Love the versatility', 'Full lace construction allows for so many styling options. The curls are gorgeous!', 1),
('user_vip', 'prod_007', 5, 'Stunning color!', 'The balayage is so well done, looks like I just left the salon. Gets compliments everywhere!', 1),
('user_test', 'prod_004', 5, 'Perfect bundles', 'Hair quality is excellent. Took color beautifully and minimal shedding.', 1);

-- Insert loyalty points for users
INSERT INTO loyalty_points (user_id, points, lifetime, tier) VALUES
('user_test', 250, 1500, 'Silver'),
('user_vip', 750, 5000, 'Gold');

-- Insert newsletter subscribers
INSERT INTO newsletter (email) VALUES
('subscriber1@example.com'),
('subscriber2@example.com'),
('subscriber3@example.com'),
('newsletter@truthhair.com');

-- Insert sample addresses
INSERT INTO addresses (user_id, name, line1, city, state, postal_code, country, is_default) VALUES
('user_test', 'Test Customer', '123 Main Street', 'Harare', 'Harare', '00263', 'Zimbabwe', 1),
('user_vip', 'VIP Customer', '456 Premium Avenue', 'Bulawayo', 'Bulawayo', '00263', 'Zimbabwe', 1);