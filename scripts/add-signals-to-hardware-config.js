#!/usr/bin/env node

/**
 * Add signal mappings from channel-mapping.json to hardware-config.json
 */

const fs = require('fs');
const path = require('path');

const configDir = path.join(__dirname, '../configuration');
const hardwareConfigPath = path.join(configDir, 'hardware-config.json');
const channelMappingPath = path.join(configDir, 'channel-mapping.json');

// Read both files
const hardwareConfig = JSON.parse(fs.readFileSync(hardwareConfigPath, 'utf8'));
const channelMapping = JSON.parse(fs.readFileSync(channelMappingPath, 'utf8'));

// Create a map of channel numbers to signals
const signalMap = {};
const channels = channelMapping.channels || channelMapping;
for (const key in channels) {
  const mapping = channels[key];
  if (mapping.channel && mapping.signals) {
    signalMap[mapping.channel] = mapping.signals;
  }
}

// Update hardware outputs with signals
let updateCount = 0;
hardwareConfig.outputs.forEach((output) => {
  if (output.channel && signalMap[output.channel]) {
    output.signals = signalMap[output.channel];
    updateCount++;
    console.log(`✓ Added signals to ${output.id} (channel ${output.channel}):`, output.signals);
  }
});

// Write updated hardware config
fs.writeFileSync(hardwareConfigPath, JSON.stringify(hardwareConfig, null, 2), 'utf8');

console.log(`\n✅ Updated ${updateCount} outputs with signal mappings`);
console.log(`📝 Updated: ${hardwareConfigPath}`);
