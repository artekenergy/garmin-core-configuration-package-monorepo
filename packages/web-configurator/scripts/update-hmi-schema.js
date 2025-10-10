#!/usr/bin/env node

/**
 * Update HMI schema file with user configuration
 * This script helps update an existing deployment with a new schema
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if a schema file was provided
const schemaPath = process.argv[2];
if (!schemaPath) {
  console.error('Usage: node update-hmi-schema.js <path-to-schema.json>');
  console.error('Example: node update-hmi-schema.js ../my-config-schema.json');
  process.exit(1);
}

// Paths
const WEB_ROOT = path.join(__dirname, '../../../web');
const DEPLOYMENT_PACKAGE = path.join(__dirname, '../public/deployment-package/web');

// Check if schema file exists
if (!fs.existsSync(schemaPath)) {
  console.error(`❌ Schema file not found: ${schemaPath}`);
  process.exit(1);
}

// Read the schema
const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

// Validate it's valid JSON
try {
  JSON.parse(schemaContent);
} catch (error) {
  console.error('❌ Invalid JSON in schema file:', error.message);
  process.exit(1);
}

console.log('📄 Updating HMI schema files...\n');

// Update web/new-hmi-configuration-schema-2.json
const webSchemaPath = path.join(WEB_ROOT, 'new-hmi-configuration-schema-2.json');
if (fs.existsSync(WEB_ROOT)) {
  fs.writeFileSync(webSchemaPath, schemaContent);
  console.log('✓ Updated web/new-hmi-configuration-schema-2.json');
} else {
  console.warn('⚠ /web directory not found, skipping');
}

// Update deployment package
const deploymentSchemaPath = path.join(DEPLOYMENT_PACKAGE, 'new-hmi-configuration-schema-2.json');
if (fs.existsSync(DEPLOYMENT_PACKAGE)) {
  fs.writeFileSync(deploymentSchemaPath, schemaContent);
  console.log('✓ Updated deployment-package/web/new-hmi-configuration-schema-2.json');
} else {
  console.warn('⚠ Deployment package not found, skipping');
}

// Also update legacy schema.json files
const webLegacyPath = path.join(WEB_ROOT, 'schema.json');
if (fs.existsSync(WEB_ROOT)) {
  fs.writeFileSync(webLegacyPath, schemaContent);
  console.log('✓ Updated web/schema.json');
}

const deploymentLegacyPath = path.join(DEPLOYMENT_PACKAGE, 'schema.json');
if (fs.existsSync(DEPLOYMENT_PACKAGE)) {
  fs.writeFileSync(deploymentLegacyPath, schemaContent);
  console.log('✓ Updated deployment-package/web/schema.json');
}

console.log('\n🎯 Schema files updated successfully!');
console.log('\nThe HMI UI will now load your custom configuration.');
console.log('If testing on a device, you may need to:');
console.log('  1. Clear browser cache');
console.log('  2. Hard refresh (Ctrl+F5)');
console.log('  3. Restart the web server');