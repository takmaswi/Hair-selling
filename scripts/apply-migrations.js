#!/usr/bin/env node

/**
 * Script to apply database migrations to Cloudflare D1
 * Usage: node scripts/apply-migrations.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DATABASE_NAME = 'truthhair-database';
const MIGRATIONS_DIR = path.join(__dirname, '..', 'database', 'migrations');

// Define migrations in order
const migrations = [
  '003_fix_products_schema.sql',
  '004_updated_seed_data.sql'
];

console.log('🔄 Starting database migration process...\n');

// Check if wrangler is installed
try {
  execSync('wrangler --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Error: wrangler CLI is not installed or not in PATH');
  console.log('Please install wrangler: npm install -g wrangler');
  process.exit(1);
}

// Apply each migration
for (const migrationFile of migrations) {
  const migrationPath = path.join(MIGRATIONS_DIR, migrationFile);
  
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationFile}`);
    continue;
  }
  
  console.log(`📝 Applying migration: ${migrationFile}`);
  
  try {
    // Read the migration file
    const sqlContent = fs.readFileSync(migrationPath, 'utf8');
    
    // Write to temp file (wrangler d1 execute reads from file)
    const tempFile = path.join(__dirname, 'temp-migration.sql');
    fs.writeFileSync(tempFile, sqlContent);
    
    // Execute the migration
    const command = `wrangler d1 execute ${DATABASE_NAME} --file="${tempFile}" --local`;
    console.log(`   Executing: ${command}`);
    
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log(`   ✅ Migration ${migrationFile} applied successfully`);
    
    // Clean up temp file
    fs.unlinkSync(tempFile);
    
  } catch (error) {
    console.error(`   ❌ Error applying migration ${migrationFile}:`);
    console.error(`   ${error.message}`);
    
    // Clean up temp file if it exists
    const tempFile = path.join(__dirname, 'temp-migration.sql');
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    
    // Ask if user wants to continue
    console.log('\n   Do you want to continue with the next migration? (y/n)');
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('', (answer) => {
      readline.close();
      if (answer.toLowerCase() !== 'y') {
        process.exit(1);
      }
    });
  }
}

console.log('\n✅ Migration process completed!');
console.log('\n📊 To verify the database schema, run:');
console.log('   wrangler d1 execute truthhair-database --command "SELECT name FROM sqlite_master WHERE type=\'table\'" --local');
console.log('\n🔍 To check products with new columns:');
console.log('   wrangler d1 execute truthhair-database --command "SELECT id, name, hair_type, quality FROM products LIMIT 5" --local');