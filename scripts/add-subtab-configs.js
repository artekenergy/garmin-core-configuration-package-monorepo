#!/usr/bin/env node
/**
 * Add default lightingTab, hvacTab, and switchingTab configurations to schema files
 * that are missing them. This ensures subtabs display properly in the HMI UI.
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_SUBTAB_CONFIGS = {
  lightingTab: {
    interior: {
      enabled: true,
      title: 'Interior',
      icon: '💡',
    },
    exterior: {
      enabled: true,
      title: 'Exterior',
      icon: '🌟',
    },
    rgb: {
      enabled: false,
      title: 'RGB',
      icon: '🌈',
    },
  },
  hvacTab: {
    heating: {
      enabled: true,
      title: 'Heating',
      icon: '🔥',
    },
    cooling: {
      enabled: true,
      title: 'Cooling',
      icon: '❄️',
    },
    ventilation: {
      enabled: true,
      title: 'Ventilation',
      icon: '💨',
    },
  },
  switchingTab: {
    switches: {
      enabled: true,
      title: 'Switches',
      icon: '🔌',
    },
    accessories: {
      enabled: true,
      title: 'Accessories',
      icon: '⚡',
    },
  },
};

const SCHEMA_PATHS = [
  'packages/hmi-ui/public/schema.json',
  'garmin-bundle/web/schema.json',
  'packages/web-configurator/public/deployment-package/web/schema.json',
];

function addSubtabConfigs(schemaPath) {
  const fullPath = path.join(process.cwd(), schemaPath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⏭️  Skipping ${schemaPath} (not found)`);
    return;
  }

  const schemaContent = fs.readFileSync(fullPath, 'utf8');
  const schema = JSON.parse(schemaContent);

  let updated = false;

  // Add missing lightingTab
  if (!schema.lightingTab) {
    schema.lightingTab = DEFAULT_SUBTAB_CONFIGS.lightingTab;
    updated = true;
  }

  // Add missing hvacTab
  if (!schema.hvacTab) {
    schema.hvacTab = DEFAULT_SUBTAB_CONFIGS.hvacTab;
    updated = true;
  }

  // Add missing switchingTab
  if (!schema.switchingTab) {
    schema.switchingTab = DEFAULT_SUBTAB_CONFIGS.switchingTab;
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(fullPath, JSON.stringify(schema, null, 2) + '\n');
    console.log(`✅ Updated ${schemaPath}`);
  } else {
    console.log(`✓  ${schemaPath} already has subtab configs`);
  }
}

console.log('🔧 Adding default subtab configurations to schemas...\n');

SCHEMA_PATHS.forEach(addSubtabConfigs);

console.log('\n✅ Done! Subtab configurations added where missing.');
console.log('\nNext steps:');
console.log('  1. Run: pnpm run deploy:full');
console.log('  2. Upload the new deployment package to your device');
console.log('  3. Refresh the HMI UI in your browser');
