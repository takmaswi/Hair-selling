#!/usr/bin/env node

/**
 * Script to apply database migrations to Cloudflare D1 (Remote/Production)
 * Usage: node scripts/apply-migrations-remote.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DATABASE_NAME = 'truthhair-database';
const MIGRATIONS_DIR = path.join(__dirname, '..', 'database', 'migrations');

// Define migrations in order
const migrations = [
  '003_fix_products_schema.sql',
  '004_updated_seed_data.sql'
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('⚠️  WARNING: This will apply migrations to the PRODUCTION database!');
console.log('   Database: ' + DATABASE_NAME);
console.log('   This will DROP and RECREATE all tables!');
console.log('');

rl.question('Are you sure you want to continue? Type "yes" to proceed: ', (answer) => {
  if (answer.toLowerCase() !== 'yes') {
    console.log('❌ Migration cancelled.');
    rl.close();
    process.exit(0);
  }
  
  rl.close();
  
  console.log('\n🔄 Starting PRODUCTION database migration process...\n');
  
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
    
    console.log(`📝 Applying migration to PRODUCTION: ${migrationFile}`);
    
    try {
      // Read the migration file
      const sqlContent = fs.readFileSync(migrationPath, 'utf8');
      
      // Write to temp file (wrangler d1 execute reads from file)
      const tempFile = path.join(__dirname, 'temp-migration-remote.sql');
      fs.writeFileSync(tempFile, sqlContent);
      
      // Execute the migration WITHOUT --local flag for production
      const command = `wrangler d1 execute ${DATABASE_NAME} --file="${tempFile}"`;
      console.log(`   Executing on PRODUCTION: ${command}`);
      
      const output = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.log(`   ✅ Migration ${migrationFile} applied to PRODUCTION successfully`);
      
      // Clean up temp file
      fs.unlinkSync(tempFile);
      
    } catch (error) {
      console.error(`   ❌ Error applying migration ${migrationFile} to PRODUCTION:`);
      console.error(`   ${error.message}`);
      
      // Clean up temp file if it exists
      const tempFile = path.join(__dirname, 'temp-migration-remote.sql');
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
      
      console.error('\n❌ Migration failed! Production database may be in an inconsistent state.');
      console.error('   You may need to manually fix the database.');
      process.exit(1);
    }
  }
  
  console.log('\n✅ PRODUCTION migration process completed!');
  console.log('\n📊 To verify the PRODUCTION database schema, run:');
  console.log('   wrangler d1 execute truthhair-database --command "SELECT name FROM sqlite_master WHERE type=\'table\'"');
  console.log('\n🔍 To check products with new columns in PRODUCTION:');
  console.log('   wrangler d1 execute truthhair-database --command "SELECT id, name, hair_type, quality FROM products LIMIT 5"');
});