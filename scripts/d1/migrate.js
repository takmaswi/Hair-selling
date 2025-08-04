#!/usr/bin/env node

/**
 * D1 Database Migration Runner
 * Manages database migrations for Cloudflare D1
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const DATABASE_NAME = process.env.CLOUDFLARE_DATABASE_NAME || 'truthhair-database';
const MIGRATIONS_DIR = path.join(__dirname, '../../database/migrations');
const MIGRATIONS_LOG = path.join(__dirname, '../../database/.migrations.json');

// Colors
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

class MigrationRunner {
  constructor() {
    this.appliedMigrations = this.loadAppliedMigrations();
  }

  loadAppliedMigrations() {
    if (fs.existsSync(MIGRATIONS_LOG)) {
      const data = fs.readFileSync(MIGRATIONS_LOG, 'utf8');
      return JSON.parse(data);
    }
    return { migrations: [] };
  }

  saveAppliedMigrations() {
    fs.writeFileSync(MIGRATIONS_LOG, JSON.stringify(this.appliedMigrations, null, 2));
  }

  getMigrationFiles() {
    if (!fs.existsSync(MIGRATIONS_DIR)) {
      throw new Error(`Migrations directory not found: ${MIGRATIONS_DIR}`);
    }

    return fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort();
  }

  getPendingMigrations() {
    const allMigrations = this.getMigrationFiles();
    const applied = new Set(this.appliedMigrations.migrations.map(m => m.file));
    return allMigrations.filter(file => !applied.has(file));
  }

  async runMigration(file) {
    const filePath = path.join(MIGRATIONS_DIR, file);
    
    log(`Running migration: ${file}`, 'cyan');
    
    try {
      // Read the SQL file
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Execute via wrangler
      const command = `wrangler d1 execute ${DATABASE_NAME} --file="${filePath}"`;
      execSync(command, { stdio: 'inherit' });
      
      // Record as applied
      this.appliedMigrations.migrations.push({
        file,
        appliedAt: new Date().toISOString(),
        checksum: this.getFileChecksum(filePath)
      });
      
      log(`✓ Migration ${file} applied successfully`, 'green');
      return true;
    } catch (error) {
      log(`✗ Migration ${file} failed: ${error.message}`, 'red');
      return false;
    }
  }

  getFileChecksum(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const crypto = require('crypto');
    return crypto.createHash('md5').update(content).digest('hex');
  }

  async up() {
    const pending = this.getPendingMigrations();
    
    if (pending.length === 0) {
      log('No pending migrations', 'yellow');
      return;
    }
    
    log(`Found ${pending.length} pending migration(s)`, 'cyan');
    
    for (const file of pending) {
      const success = await this.runMigration(file);
      if (!success) {
        log('Migration process stopped due to error', 'red');
        break;
      }
    }
    
    this.saveAppliedMigrations();
  }

  async down(steps = 1) {
    log('Rollback functionality not yet implemented', 'yellow');
    log('Please manually revert changes if needed', 'yellow');
  }

  async reset() {
    log('⚠️  This will drop all tables and re-run all migrations!', 'red');
    
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      readline.question('Are you sure? (yes/no): ', resolve);
    });
    
    readline.close();
    
    if (answer.toLowerCase() !== 'yes') {
      log('Reset cancelled', 'yellow');
      return;
    }
    
    // Drop all tables
    const dropFile = path.join(MIGRATIONS_DIR, '000_drop_all.sql');
    const dropSQL = `
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
    `;
    
    fs.writeFileSync(dropFile, dropSQL);
    
    try {
      execSync(`wrangler d1 execute ${DATABASE_NAME} --file="${dropFile}"`, { stdio: 'inherit' });
      fs.unlinkSync(dropFile);
      
      // Clear migration log
      this.appliedMigrations = { migrations: [] };
      this.saveAppliedMigrations();
      
      // Re-run all migrations
      await this.up();
      
      log('Database reset complete', 'green');
    } catch (error) {
      log(`Reset failed: ${error.message}`, 'red');
      if (fs.existsSync(dropFile)) {
        fs.unlinkSync(dropFile);
      }
    }
  }

  status() {
    const allMigrations = this.getMigrationFiles();
    const applied = new Set(this.appliedMigrations.migrations.map(m => m.file));
    
    log('\n=== Migration Status ===', 'bright');
    
    for (const file of allMigrations) {
      if (applied.has(file)) {
        const migration = this.appliedMigrations.migrations.find(m => m.file === file);
        log(`✓ ${file} (applied: ${migration.appliedAt})`, 'green');
      } else {
        log(`○ ${file} (pending)`, 'yellow');
      }
    }
    
    const pending = allMigrations.filter(f => !applied.has(f));
    log(`\nTotal: ${allMigrations.length} | Applied: ${applied.size} | Pending: ${pending.length}`, 'cyan');
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'up';
  
  log('\n╔════════════════════════════════════════╗', 'bright');
  log('║     D1 Database Migration Runner       ║', 'bright');
  log('╚════════════════════════════════════════╝', 'bright');
  
  const runner = new MigrationRunner();
  
  try {
    switch (command) {
      case 'up':
        await runner.up();
        break;
      case 'down':
        const steps = parseInt(args[1]) || 1;
        await runner.down(steps);
        break;
      case 'reset':
        await runner.reset();
        break;
      case 'status':
        runner.status();
        break;
      default:
        log('Usage: node migrate.js [command]', 'yellow');
        log('Commands:', 'cyan');
        log('  up      - Run pending migrations', 'yellow');
        log('  down N  - Rollback N migrations (not yet implemented)', 'yellow');
        log('  reset   - Drop all tables and re-run migrations', 'yellow');
        log('  status  - Show migration status', 'yellow');
    }
  } catch (error) {
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = MigrationRunner;