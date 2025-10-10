/**
 * Fix Validation Errors Script
 * 
 * This script identifies and fixes the remaining validation errors:
 * 1. Channel binding errors (core-26 not found)
 * 2. Icon reference errors (invalid SVG paths)
 */

const fs = require('fs');
const path = require('path');

// Schema file paths to check and fix
const schemaFiles = [
  './web/schema.json',
  './packages/web-configurator/public/deployment-package/web/schema.json',
  './packages/hmi-ui/public/schema.json'
];

function loadSchema(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn(`Could not load schema from ${filePath}:`, error.message);
  }
  return null;
}

function saveSchema(filePath, schema) {
  try {
    const content = JSON.stringify(schema, null, 2);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed schema saved to ${filePath}`);
  } catch (error) {
    console.error(`❌ Could not save schema to ${filePath}:`, error.message);
  }
}

function fixSchema(schema) {
  let fixCount = 0;
  const availableChannels = new Set();
  
  // Get list of available channel IDs from hardware config
  if (schema.hardware && schema.hardware.outputs) {
    schema.hardware.outputs.forEach(output => {
      availableChannels.add(output.id);
    });
  }
  
  console.log(`Available channels: ${Array.from(availableChannels).join(', ')}`);
  
  // Fix icon references first
  const validIcons = new Set();
  if (schema.icons && Array.isArray(schema.icons)) {
    schema.icons.forEach(icon => {
      validIcons.add(icon.id);
    });
  }
  
  // Iterate through all components and fix issues
  if (schema.tabs && Array.isArray(schema.tabs)) {
    schema.tabs.forEach(tab => {
      if (tab.sections && Array.isArray(tab.sections)) {
        tab.sections.forEach(section => {
          if (section.components && Array.isArray(section.components)) {
            // Filter out components with invalid channel bindings
            const validComponents = section.components.filter(component => {
              let isValid = true;
              
              // Check for invalid channel bindings
              if (component.bindings) {
                const bindingTypes = ['state', 'intensity', 'value', 'action'];
                
                for (const bindingType of bindingTypes) {
                  const binding = component.bindings[bindingType];
                  if (binding && binding.type === 'empirbus' && binding.channel) {
                    if (!availableChannels.has(binding.channel)) {
                      console.log(`❌ Removing component "${component.label}" (${component.id}) - invalid channel binding: ${binding.channel}`);
                      isValid = false;
                      fixCount++;
                      break;
                    }
                  }
                }
              }
              
              // Fix invalid icon references
              if (component.icon && !validIcons.has(component.icon)) {
                // Check if it's a file path reference that should be removed
                if (component.icon.startsWith('/icons/') || component.icon.includes('.svg')) {
                  console.log(`🔧 Removing invalid icon reference "${component.icon}" from component "${component.label}"`);
                  delete component.icon;
                  fixCount++;
                }
              }
              
              return isValid;
            });
            
            // Update section components if any were removed
            if (validComponents.length !== section.components.length) {
              section.components = validComponents;
            }
          }
        });
      }
    });
  }
  
  return fixCount;
}

function main() {
  console.log('🔧 Fixing validation errors in schema files...\n');
  
  let totalFixes = 0;
  
  schemaFiles.forEach(filePath => {
    console.log(`Checking ${filePath}...`);
    
    const schema = loadSchema(filePath);
    if (!schema) {
      console.log(`⚠️ Skipping ${filePath} (not found or invalid)\n`);
      return;
    }
    
    const fixes = fixSchema(schema);
    totalFixes += fixes;
    
    if (fixes > 0) {
      saveSchema(filePath, schema);
      console.log(`✅ Applied ${fixes} fixes to ${filePath}\n`);
    } else {
      console.log(`✅ No fixes needed for ${filePath}\n`);
    }
  });
  
  console.log(`🎉 Validation error fix complete! Applied ${totalFixes} total fixes.`);
  
  if (totalFixes > 0) {
    console.log('\n📋 Next steps:');
    console.log('1. Refresh your browser to reload the schema');
    console.log('2. Check that validation errors are resolved');
    console.log('3. If needed, regenerate tab content using the Regenerate button');
  }
}

main();