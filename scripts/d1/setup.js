#!/usr/bin/env node

/**
 * D1 Database Setup Script
 * Initializes the Cloudflare D1 database with schema and seed data
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Configuration
const DATABASE_NAME = 'truthhair-database';
const DATABASE_ID = '8bcaa605-e7d0-4664-a059-fa807b596409';
const MIGRATIONS_DIR = path.join(__dirname, '../../database/migrations');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, description) {
  try {
    log(`\n→ ${description}...`, 'cyan');
    const output = execSync(command, { encoding: 'utf8' });
    log(`✓ ${description} completed`, 'green');
    if (output) console.log(output);
    return true;
  } catch (error) {
    log(`✗ ${description} failed`, 'red');
    console.error(error.message);
    return false;
  }
}

async function checkWranglerInstallation() {
  try {
    execSync('wrangler --version', { stdio: 'ignore', shell: true });
    return true;
  } catch {
    log('Wrangler CLI is not installed!', 'red');
    log('Please install it with: npm install -g wrangler', 'yellow');
    return false;
  }
}

async function checkAuthentication() {
  try {
    execSync('wrangler whoami', { stdio: 'ignore', shell: true });
    return true;
  } catch {
    log('You are not logged in to Wrangler!', 'red');
    log('Please run: wrangler login', 'yellow');
    return false;
  }
}

async function createDatabase() {
  const create = await question(`\nDo you want to create a new D1 database? (y/n): `);
  
  if (create.toLowerCase() === 'y') {
    return execCommand(
      `wrangler d1 create ${DATABASE_NAME}`,
      'Creating D1 database'
    );
  }
  
  log('Using existing database...', 'yellow');
  return true;
}

async function runMigrations() {
  log('\n=== Running Database Migrations ===', 'bright');
  
  const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  for (const file of migrationFiles) {
    const filePath = path.join(MIGRATIONS_DIR, file);
    const success = execCommand(
      `wrangler d1 execute ${DATABASE_NAME} --file="${filePath}"`,
      `Executing migration: ${file}`
    );
    
    if (!success) {
      const continueAnyway = await question('Migration failed. Continue anyway? (y/n): ');
      if (continueAnyway.toLowerCase() !== 'y') {
        return false;
      }
    }
  }
  
  return true;
}

async function seedDatabase() {
  const seed = await question(`\nDo you want to seed the database with sample data? (y/n): `);
  
  if (seed.toLowerCase() === 'y') {
    const seedFile = path.join(MIGRATIONS_DIR, '002_seed_data.sql');
    if (fs.existsSync(seedFile)) {
      return execCommand(
        `wrangler d1 execute ${DATABASE_NAME} --file="${seedFile}"`,
        'Seeding database'
      );
    } else {
      log('Seed file not found!', 'red');
      return false;
    }
  }
  
  return true;
}

async function testConnection() {
  log('\n=== Testing Database Connection ===', 'bright');
  
  return execCommand(
    `wrangler d1 execute ${DATABASE_NAME} --command="SELECT COUNT(*) as table_count FROM sqlite_master WHERE type='table';"`,
    'Testing database connection'
  );
}

async function main() {
  log('\n╔════════════════════════════════════════╗', 'bright');
  log('║   Truth Hair D1 Database Setup Tool    ║', 'bright');
  log('╚════════════════════════════════════════╝', 'bright');
  
  // Check prerequisites
  log('\n=== Checking Prerequisites ===', 'bright');
  
  if (!await checkWranglerInstallation()) {
    process.exit(1);
  }
  
  if (!await checkAuthentication()) {
    process.exit(1);
  }
  
  log('✓ All prerequisites met', 'green');
  
  // Setup database
  try {
    // Create or use existing database
    if (!await createDatabase()) {
      throw new Error('Failed to create database');
    }
    
    // Run migrations
    if (!await runMigrations()) {
      throw new Error('Failed to run migrations');
    }
    
    // Seed database
    if (!await seedDatabase()) {
      log('Warning: Database seeding failed', 'yellow');
    }
    
    // Test connection
    if (!await testConnection()) {
      throw new Error('Failed to connect to database');
    }
    
    // Success message
    log('\n╔════════════════════════════════════════╗', 'green');
    log('║     Database Setup Successful! 🎉      ║', 'green');
    log('╚════════════════════════════════════════╝', 'green');
    
    log('\nNext steps:', 'cyan');
    log('1. Copy .env.d1.local to .env.local and update values', 'yellow');
    log('2. Run: npm run dev:d1 to start development server', 'yellow');
    log('3. Visit: http://localhost:3000', 'yellow');
    
    log('\nUseful commands:', 'cyan');
    log('• View tables: wrangler d1 execute truthhair-database --command="SELECT name FROM sqlite_master WHERE type=\'table\';"', 'yellow');
    log('• Query data: wrangler d1 execute truthhair-database --command="SELECT * FROM products LIMIT 5;"', 'yellow');
    log('• Run local: wrangler dev --local --persist', 'yellow');
    
  } catch (error) {
    log(`\n✗ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the setup
main().catch(console.error);