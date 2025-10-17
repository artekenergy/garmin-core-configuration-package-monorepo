#!/usr/bin/env node

// Copy configuration files (hardware + UISchema) from central source to package public directories
// Single source of truth: configuration/
// Merges hardware-config outputs into schema.json for HMI runtime binding resolution

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const CONFIG_ROOT = path.join(ROOT, '../configuration');
const HMI_PUBLIC = path.join(ROOT, '../packages/hmi-ui/public');
const WEB_PUBLIC = path.join(ROOT, '../packages/web-configurator/public');

console.log('\nCopying configuration files from configuration/...');

// Copy hardware configs as-is
const hardwareFiles = [
  { name: 'hardware-config-core.json', destName: 'hardware-config.json', destDir: HMI_PUBLIC },
  { name: 'hardware-config-core.json', destName: 'hardware-config-core.json', destDir: WEB_PUBLIC },
  {
    name: 'hardware-config-core-lite.json',
    destName: 'hardware-config-core-lite.json',
    destDir: HMI_PUBLIC,
  },
  {
    name: 'hardware-config-core-lite.json',
    destName: 'hardware-config-core-lite.json',
    destDir: WEB_PUBLIC,
  },
];

let copied = 0;
for (const f of hardwareFiles) {
  const src = path.join(CONFIG_ROOT, f.name);
  if (!fs.existsSync(src)) {
    console.warn(`  Skip (missing): ${f.name}`);
    continue;
  }
  const dest = path.join(f.destDir, f.destName);
  fs.mkdirSync(f.destDir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`  Copied ${f.name} -> ${path.relative(ROOT, dest)}`);
  copied++;
}

// Merge schema.json with hardware-config outputs
const schemaPath = path.join(CONFIG_ROOT, 'schema.json');
const hardwarePath = path.join(CONFIG_ROOT, 'hardware-config-core.json');

if (fs.existsSync(schemaPath) && fs.existsSync(hardwarePath)) {
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  const hardware = JSON.parse(fs.readFileSync(hardwarePath, 'utf-8'));

  // Merge hardware outputs into schema
  if (!schema.hardware) {
    schema.hardware = {};
  }
  schema.hardware.systemType = hardware.systemType || 'core';
  schema.hardware.outputs = hardware.outputs || [];
  schema.hardware.halfBridgePairs = hardware.halfBridgePairs || [];
  schema.hardware.signalMap = hardware.signalMap || {};
  schema.hardware.genesisBoards = hardware.genesisBoards || 0;

  // Write merged schema for HMI
  const hmiSchemaPath = path.join(HMI_PUBLIC, 'schema.json');
  fs.mkdirSync(HMI_PUBLIC, { recursive: true });
  fs.writeFileSync(hmiSchemaPath, JSON.stringify(schema, null, 2));
  console.log(
    `  Merged schema.json + hardware-config -> ${path.relative(ROOT, hmiSchemaPath)} (${schema.hardware.outputs.length} outputs)`
  );
  copied++;

  // Write merged schema for web-configurator as well
  const webSchemaPath = path.join(WEB_PUBLIC, 'schema.json');
  fs.mkdirSync(WEB_PUBLIC, { recursive: true });
  fs.writeFileSync(webSchemaPath, JSON.stringify(schema, null, 2));
  console.log(
    `  Merged schema.json + hardware-config -> ${path.relative(ROOT, webSchemaPath)} (${schema.hardware.outputs.length} outputs)`
  );
  copied++;
} else {
  console.warn('  Skip schema merge: schema.json or hardware-config-core.json missing');
}

console.log(`Done. ${copied} file(s) copied.`);
