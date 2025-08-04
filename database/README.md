# Truth Hair Database Setup

## Overview
This directory contains the database schema and migration files for the Truth Hair e-commerce platform using Cloudflare D1.

## Database Configuration
- **Database Name**: truthhair-database
- **Database ID**: 8bcaa605-e7d0-4664-a059-fa807b596409
- **Type**: Cloudflare D1 (SQLite)

## Schema Overview

### Key Tables
- **products**: Main product catalog with hair type, quality, and inventory tracking
- **product_variants**: Product variations (color, length, density)
- **categories**: Product categories hierarchy
- **users**: Customer and admin accounts
- **orders**: Order management
- **reviews**: Product reviews and ratings
- **wishlists**: Customer wishlists
- **loyalty_points**: Customer loyalty program

### Product Schema
The products table includes the following key columns:
- `hair_type`: HUMAN_HAIR, SYNTHETIC, BLEND, HEAT_FRIENDLY
- `quality`: PREMIUM, STANDARD, LUXURY, BASIC
- `inches`: JSON array of available lengths
- `density`: Hair density percentage
- `texture`: Hair texture (Straight, Body Wave, etc.)
- `origin`: Hair origin (Brazilian, Peruvian, etc.)
- `is_active`: Product availability flag
- `stock`: Current inventory count

## Migration Files

### Initial Schema (001_initial_schema.sql)
- Original database schema (deprecated)

### Seed Data (002_seed_data.sql)
- Sample data for initial schema (deprecated)

### Fixed Schema (003_fix_products_schema.sql)
- Complete schema with all required columns
- Drops and recreates all tables
- Includes proper indexes and constraints

### Updated Seed Data (004_updated_seed_data.sql)
- Sample products with all new columns
- Test users and reviews
- Product variants and images

## Setup Instructions

### Local Development

1. **Apply migrations to local database**:
   ```bash
   node scripts/apply-migrations.js
   ```

2. **Verify the schema**:
   ```bash
   node scripts/db-query.js "SELECT name FROM sqlite_master WHERE type='table'"
   ```

3. **Check sample data**:
   ```bash
   node scripts/db-query.js "SELECT id, name, hair_type, quality FROM products LIMIT 5"
   ```

### Production Deployment

1. **Apply migrations to production** (⚠️ CAUTION: This will drop all tables):
   ```bash
   node scripts/apply-migrations-remote.js
   ```

2. **Verify production database**:
   ```bash
   node scripts/db-query.js "SELECT COUNT(*) FROM products" --remote
   ```

## Helper Scripts

### apply-migrations.js
Applies migrations to local D1 database for development.

### apply-migrations-remote.js
Applies migrations to production D1 database (requires confirmation).

### db-query.js
Helper script for running queries:
```bash
# Local queries
node scripts/db-query.js "SELECT * FROM products WHERE hair_type = 'HUMAN_HAIR'"

# Production queries
node scripts/db-query.js "SELECT COUNT(*) FROM orders" --remote
```

## Common Queries

### Check all tables
```sql
SELECT name FROM sqlite_master WHERE type='table'
```

### View product schema
```sql
PRAGMA table_info(products)
```

### Count products by type
```sql
SELECT hair_type, COUNT(*) as count 
FROM products 
GROUP BY hair_type
```

### Active products with stock
```sql
SELECT name, hair_type, quality, stock 
FROM products 
WHERE is_active = 1 AND stock > 0
```

### Product variants
```sql
SELECT p.name, v.name as variant, v.price, v.stock 
FROM products p 
JOIN product_variants v ON p.id = v.product_id 
WHERE p.id = 'prod_001'
```

## Troubleshooting

### "no such column" errors
Run the migration script to update the schema:
```bash
node scripts/apply-migrations.js
```

### Connection errors
Ensure you're logged in to Cloudflare:
```bash
wrangler login
```

### Check database binding
Verify wrangler.toml has correct database configuration:
```toml
[[d1_databases]]
binding = "DB"
database_name = "truthhair-database"
database_id = "8bcaa605-e7d0-4664-a059-fa807b596409"
```

## Important Notes

1. **Backup Before Migration**: Always backup your data before running migrations on production.

2. **Migration Order**: Migrations must be applied in order (003 before 004).

3. **Data Types**: D1 uses SQLite, so some data types are stored as TEXT:
   - JSON arrays (inches, tags) are stored as TEXT
   - Decimals are stored as DECIMAL(10,2)

4. **Indexes**: Proper indexes are created for common queries (slug, sku, category_id, etc.).

5. **Constraints**: Foreign key constraints are enforced to maintain data integrity.