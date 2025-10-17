#!/usr/bin/env node

// Clean hardware-config-core.json to be a pure capability definition
// Sets configurable channels to "not-used" with minimal defaults

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../configuration/hardware-config-core.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

console.log('Cleaning hardware-config-core.json to pure capability definition...\n');

let cleaned = 0;
let kept = 0;

config.outputs = config.outputs.map((output) => {
  // Keep signal-value entries as-is (these are sensors/read-only)
  if (output.control === 'signal-value') {
    kept++;
    return output;
  }

  // For core channels (configurable outputs), reset to not-used
  if (output.source === 'core' && output.id.startsWith('core-')) {
    cleaned++;
    return {
      id: output.id,
      source: output.source,
      channel: output.channel,
      control: 'not-used',
      label: `Core ${output.channel}`,
      signals: output.signals, // Keep signal mappings
    };
  }

  // For other controllable outputs (HVAC, accessories, etc.)
  // Keep them but remove icons if they have specific function
  if (output.icon) {
    const { icon, ...rest } = output;
    kept++;
    return rest;
  }

  kept++;
  return output;
});

// Write back
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

console.log(`✓ Cleaned ${cleaned} core channels to "not-used"`);
console.log(`✓ Kept ${kept} specialized outputs (sensors, controls, etc.)`);
console.log(`✓ Total outputs: ${config.outputs.length}`);
console.log('\nDone! hardware-config-core.json is now a pure capability definition.');
