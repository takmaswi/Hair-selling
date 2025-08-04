#!/usr/bin/env node

/**
 * Helper script to query the D1 database
 * Usage: node scripts/db-query.js "SELECT * FROM products LIMIT 5"
 * Add --remote flag to query production database
 */

const { execSync } = require('child_process');

const DATABASE_NAME = 'truthhair-database';

// Get command line arguments
const args = process.argv.slice(2);
const isRemote = args.includes('--remote');
const query = args.filter(arg => arg !== '--remote').join(' ') || 'SELECT name FROM sqlite_master WHERE type="table"';

// Build the command
const remoteFlag = isRemote ? '' : '--local';
const command = `wrangler d1 execute ${DATABASE_NAME} --command "${query}" ${remoteFlag}`.trim();

console.log(`🔍 Executing query on ${isRemote ? 'PRODUCTION' : 'LOCAL'} database:`);
console.log(`   Query: ${query}\n`);

try {
  const output = execSync(command, { encoding: 'utf8' });
  
  // Parse and pretty print the output
  const lines = output.split('\n');
  let jsonStarted = false;
  let jsonStr = '';
  
  for (const line of lines) {
    if (line.trim().startsWith('[')) {
      jsonStarted = true;
    }
    
    if (jsonStarted) {
      jsonStr += line;
      if (line.trim().endsWith(']')) {
        try {
          const result = JSON.parse(jsonStr);
          if (result[0] && result[0].results) {
            console.log('📊 Results:');
            console.table(result[0].results);
            console.log(`\n✅ ${result[0].results.length} rows returned`);
          }
        } catch (e) {
          console.log(jsonStr);
        }
        break;
      }
    }
  }
  
} catch (error) {
  console.error('❌ Error executing query:');
  console.error(error.message);
  process.exit(1);
}

// Show some helpful examples
if (process.argv.length === 2) {
  console.log('\n📖 Examples:');
  console.log('   node scripts/db-query.js "SELECT * FROM products LIMIT 5"');
  console.log('   node scripts/db-query.js "SELECT COUNT(*) FROM products WHERE hair_type = \'HUMAN_HAIR\'"');
  console.log('   node scripts/db-query.js "SELECT name FROM sqlite_master WHERE type=\'table\'"');
  console.log('   node scripts/db-query.js "PRAGMA table_info(products)"');
  console.log('\n   Add --remote flag to query production database');
}