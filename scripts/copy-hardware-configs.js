#!/usr/bin/env node

/**
 * Copy hardware configuration files from central source to package public directories
 * This ensures all packages use the same hardware config files (single source of truth)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source: monorepo root configuration directory
const CONFIG_ROOT = path.join(__dirname, '../configuration');

// Destinations
const HMI_UI_PUBLIC = path.join(__dirname, '../packages/hmi-ui/public');
const WEB_CONFIGURATOR_PUBLIC = path.join(__dirname, '../packages/web-configurator/public');

console.log('📋 Copying hardware configuration files from central source...\n');

// Files to copy
const configFiles = [
  { name: 'hardware-config-core.json', desc: 'Core system hardware config' },
  { name: 'hardware-config-core-lite.json', desc: 'Core Lite system hardware config' },
];

let totalCopied = 0;

configFiles.forEach(({ name, desc }) => {
  const sourcePath = path.join(CONFIG_ROOT, name);

  if (!fs.existsSync(sourcePath)) {
    console.warn(`⚠️  Source file not found: ${name}`);
    return;
  }

  // Copy to hmi-ui/public
  const hmiDest = path.join(
    HMI_UI_PUBLIC,
    name === 'hardware-config-core.json' ? 'hardware-config.json' : name
  );
  fs.copyFileSync(sourcePath, hmiDest);
  console.log(`✓ Copied to hmi-ui/public/${path.basename(hmiDest)}`);
  totalCopied++;

  // Copy to web-configurator/public
  const webDest = path.join(WEB_CONFIGURATOR_PUBLIC, name);
  fs.copyFileSync(sourcePath, webDest);
  console.log(`✓ Copied to web-configurator/public/${name}`);
  totalCopied++;

  console.log(`  ${desc}\n`);
});

console.log(`✅ Copied ${totalCopied} hardware configuration files`);
console.log('📍 Source of truth: configuration/hardware-config-*.json\n');
