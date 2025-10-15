#!/usr/bin/env node

// Check that there are no static bindings for 'value' in key schemas
// Exits with non-zero code if violations are found.

const fs = require('fs');
const path = require('path');

const targets = [
  'packages/hmi-ui/public/schema.json',
  'garmin-bundle/web/schema.json',
  'packages/web-configurator/public/deployment-package/web/schema.json',
  'packages/web-configurator/dist/deployment-package/web/schema.json',
];

function hasStaticValueBindings(schema) {
  const issues = [];
  const tabs = schema.tabs || [];

  tabs.forEach((tab, ti) => {
    const sections = (tab && tab.sections) || [];
    sections.forEach((section, si) => {
      const components = (section && section.components) || [];
      components.forEach((comp, ci) => {
        const b = comp && comp.bindings;
        if (b && b.value && b.value.type === 'static') {
          issues.push({
            path: `tabs[${ti}].sections[${si}].components[${ci}]`,
            componentId: comp.id,
            label: comp.label,
          });
        }
      });
    });
  });

  return issues;
}

let totalIssues = 0;

for (const rel of targets) {
  const full = path.join(process.cwd(), rel);
  if (!fs.existsSync(full)) {
    continue;
  }
  try {
    const raw = fs.readFileSync(full, 'utf8');
    const json = JSON.parse(raw);
    const issues = hasStaticValueBindings(json);
    if (issues.length > 0) {
      console.error(`\n❌ Static 'value' bindings found in: ${rel}`);
      for (const issue of issues) {
        console.error(`   - ${issue.path} (id: ${issue.componentId}, label: ${issue.label})`);
      }
      totalIssues += issues.length;
    } else {
      console.log(`✅ No static 'value' bindings in ${rel}`);
    }
  } catch (e) {
    console.warn(`⚠️  Could not parse ${rel}: ${(e && e.message) || e}`);
  }
}

if (totalIssues > 0) {
  console.error(`\n🚫 Validation failed: ${totalIssues} issue(s) found.`);
  process.exit(1);
}

console.log('\n🎉 Validation passed: No static value bindings found.');
