/**
 * Convert Icon Paths to IDs
 * 
 * This script converts a schema.json from path-based icons to ID-based icons.
 * Run this once to migrate existing schemas.
 * 
 * Usage: node scripts/convert-icons-to-ids.js <input.json> <output.json>
 */

const fs = require('fs');
const path = require('path');

function createIconDefinition(iconRef) {
  // Skip emoji
  if (iconRef.length <= 3) {
    return null;
  }

  // Library icon: /icons/Plumbing.svg
  if (iconRef.startsWith('/icons/')) {
    const filename = iconRef.replace('/icons/', '');
    const id = filename.replace(/\.(svg|png|jpg)$/i, '').toLowerCase().replace(/\s+/g, '-');
    
    const extMatch = filename.match(/\.(svg|png|jpg)$/i);
    if (!extMatch) return null;
    
    const ext = extMatch[1].toLowerCase();
    const type = ext === 'svg' ? 'svg' : ext === 'png' ? 'png' : 'jpg';

    return {
      id,
      type,
      url: iconRef,
    };
  }

  // Data URL (custom uploaded icon)
  if (iconRef.startsWith('data:image/')) {
    const match = iconRef.match(/^data:image\/(svg\+xml|png|jpeg|jpg);base64,(.+)$/);
    if (!match || !match[2]) return null;

    const mimeType = match[1];
    const base64Data = match[2];
    const type = mimeType === 'svg+xml' ? 'svg' : mimeType === 'png' ? 'png' : 'jpg';
    
    const id = 'custom-' + base64Data.substring(0, 8);

    return {
      id,
      type,
      data: base64Data,
    };
  }

  return null;
}

function iconRefToId(iconRef) {
  if (!iconRef) return undefined;
  
  // Keep emoji as-is
  if (iconRef.length <= 3) return iconRef;
  
  const icon = createIconDefinition(iconRef);
  return icon?.id || iconRef;
}

function convertSchemaIcons(schema) {
  const iconRefs = new Set();
  
  // Collect all icon references
  if (schema.hardware?.outputs) {
    schema.hardware.outputs.forEach((output) => {
      if (output.icon) iconRefs.add(output.icon);
    });
  }

  schema.tabs?.forEach((tab) => {
    if (tab.icon) iconRefs.add(tab.icon);
    tab.sections?.forEach((section) => {
      if (section.icon) iconRefs.add(section.icon);
      section.components?.forEach((component) => {
        if (component.icon) iconRefs.add(component.icon);
      });
    });
  });

  // Build icons array
  const icons = [];
  const seenIds = new Set();

  iconRefs.forEach((ref) => {
    const icon = createIconDefinition(ref);
    if (icon && !seenIds.has(icon.id)) {
      icons.push(icon);
      seenIds.add(icon.id);
    }
  });

  // Convert all references to IDs
  if (schema.hardware?.outputs) {
    schema.hardware.outputs = schema.hardware.outputs.map((output) => ({
      ...output,
      icon: iconRefToId(output.icon),
    }));
  }

  schema.tabs = schema.tabs?.map((tab) => ({
    ...tab,
    icon: iconRefToId(tab.icon),
    sections: tab.sections?.map((section) => ({
      ...section,
      icon: iconRefToId(section.icon),
      components: section.components?.map((component) => ({
        ...component,
        icon: iconRefToId(component.icon),
      })),
    })),
  }));

  // Add icons array
  return {
    ...schema,
    icons: icons.length > 0 ? icons : undefined,
  };
}

// Main
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('Usage: node convert-icons-to-ids.js <input.json> <output.json>');
  process.exit(1);
}

const [inputPath, outputPath] = args;

try {
  const schemaData = fs.readFileSync(inputPath, 'utf8');
  const schema = JSON.parse(schemaData);
  
  console.log('Converting icon paths to IDs...');
  const convertedSchema = convertSchemaIcons(schema);
  
  console.log(`✓ Found ${convertedSchema.icons?.length || 0} unique icons`);
  
  fs.writeFileSync(outputPath, JSON.stringify(convertedSchema, null, 2));
  console.log(`✓ Converted schema written to ${outputPath}`);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
