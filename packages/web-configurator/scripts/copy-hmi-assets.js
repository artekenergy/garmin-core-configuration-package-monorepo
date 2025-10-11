#!/usr/bin/env node

/**
 * Copy HMI UI build assets to web-configurator public directory
 * This allows the web configurator to include the complete HMI UI in its export package
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HMI_DIST = path.join(__dirname, '../../hmi-ui/dist');
const GARMIN_BUNDLE_ROOT = path.join(__dirname, '../../../garmin-bundle');
const WEB_ROOT = path.join(GARMIN_BUNDLE_ROOT, 'web');
const CONFIG_ROOT = path.join(GARMIN_BUNDLE_ROOT, 'configuration');
const SERVICES_ROOT = path.join(GARMIN_BUNDLE_ROOT, 'services');
const PUBLIC_DEPLOYMENT = path.join(__dirname, '../public/deployment-package');

console.log('📦 Copying complete deployment package for web configurator export...\n');

// Check if HMI UI is built
if (!fs.existsSync(HMI_DIST)) {
  console.error('❌ HMI UI dist folder not found!');
  console.error(`   Expected at: ${HMI_DIST}`);
  console.error('   Run: pnpm --filter @gcg/hmi-ui build');
  process.exit(1);
}

// Check if web directory exists (deployed HMI)
if (!fs.existsSync(WEB_ROOT)) {
  console.error('❌ garmin-bundle/web directory not found!');
  console.error('   Run: pnpm --filter @gcg/hmi-ui deploy:web');
  console.error(`   Expected at: ${WEB_ROOT}`);
  process.exit(1);
}

// Create public/deployment-package directory
if (fs.existsSync(PUBLIC_DEPLOYMENT)) {
  fs.rmSync(PUBLIC_DEPLOYMENT, { recursive: true, force: true });
}
fs.mkdirSync(PUBLIC_DEPLOYMENT, { recursive: true });

// Function to copy directory recursively
function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`⚠️  Source not found: ${src}`);
    return 0;
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  let fileCount = 0;

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      fileCount += copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      fileCount++;
    }
  }

  return fileCount;
}

// Copy complete deployment package structure
let totalFiles = 0;

console.log('📁 Copying complete garmin-bundle/web directory...');
const webDest = path.join(PUBLIC_DEPLOYMENT, 'web');
fs.mkdirSync(webDest, { recursive: true });
const webFileCount = copyDirectory(WEB_ROOT, webDest);
console.log(`   ✓ Copied ${webFileCount} files from garmin-bundle/web\n`);
totalFiles += webFileCount;

// Copy configuration directory
if (fs.existsSync(CONFIG_ROOT)) {
  console.log('📁 Copying garmin-bundle/configuration directory...');
  const configDest = path.join(PUBLIC_DEPLOYMENT, 'configuration');
  fs.mkdirSync(configDest, { recursive: true });
  const configFileCount = copyDirectory(CONFIG_ROOT, configDest);
  console.log(`   ✓ Copied ${configFileCount} files from garmin-bundle/configuration\n`);
  totalFiles += configFileCount;
} else {
  console.warn('⚠️  garmin-bundle/configuration directory not found, skipping\n');
}

// Copy services directory
if (fs.existsSync(SERVICES_ROOT)) {
  console.log('📁 Copying garmin-bundle/services directory...');
  const servicesDest = path.join(PUBLIC_DEPLOYMENT, 'services');
  fs.mkdirSync(servicesDest, { recursive: true });
  const servicesFileCount = copyDirectory(SERVICES_ROOT, servicesDest);
  console.log(`   ✓ Copied ${servicesFileCount} files from garmin-bundle/services\n`);
  totalFiles += servicesFileCount;
} else {
  console.warn('⚠️  garmin-bundle/services directory not found, skipping\n');
}

// Create manifest file listing all files for easy packaging
const manifestFiles = [];
function listFiles(dir, baseDir = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const relativePath = path.join(baseDir, entry.name);

    if (entry.isDirectory()) {
      listFiles(path.join(dir, entry.name), relativePath);
    } else {
      manifestFiles.push(relativePath.replace(/\\/g, '/'));
    }
  }
}

listFiles(PUBLIC_DEPLOYMENT);

const manifest = {
  generatedAt: new Date().toISOString(),
  totalFiles: manifestFiles.length,
  files: manifestFiles.sort(),
  directories: {
    web: manifestFiles.filter((f) => f.startsWith('web/')).length,
    configuration: manifestFiles.filter((f) => f.startsWith('configuration/')).length,
    services: manifestFiles.filter((f) => f.startsWith('services/')).length,
  },
};

fs.writeFileSync(path.join(PUBLIC_DEPLOYMENT, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log(`\n✅ Copied ${totalFiles} files to public/deployment-package/`);
console.log(`📄 Created manifest with ${manifestFiles.length} entries`);
console.log(`\nBreakdown:`);
console.log(`   - web/: ${manifest.directories.web} files`);
console.log(`   - configuration/: ${manifest.directories.configuration} files`);
console.log(`   - services/: ${manifest.directories.services} files`);
console.log('\nWeb configurator can now export complete deployment packages!\n');
