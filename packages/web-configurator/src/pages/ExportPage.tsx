import { useSchema } from '../context/SchemaContext';
import styles from './ExportPage.module.css';
import { debug } from '../utils/debug';
import JSZip from 'jszip';
import { useState } from 'react';
import { updateSchemaIcons } from '../utils/iconRegistry';
import type { UISchema, Tab, Section, Component, GaugeComponent, OutputChannel } from '@gcg/schema';

export default function ExportPage() {
  const { schema, validationResult } = useSchema();
  const [isCompiling, setIsCompiling] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [compiledPackage, setCompiledPackage] = useState<{
    deploymentZip: Blob;
    schemaJson: string;
    stats: {
      totalIcons: number;
      libraryIcons: number;
      customIcons: number;
    };
  } | null>(null);
  const [compilationError, setCompilationError] = useState<string | null>(null);

  if (!schema) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <h2>No Schema to Export</h2>
          <p>Create a schema in the Editor first.</p>
        </div>
      </div>
    );
  }

  const hasErrors = validationResult && !validationResult.success;
  const canCompile = validationResult?.success;

  const handleCompilePackage = async () => {
    if (!schema) return;

    setIsCompiling(true);
    setCompilationError(null);
    setCompiledPackage(null);

    try {
      const zip = new JSZip();

      // 1. Build icons array and update schema with icon registry
      let enhancedSchema = updateSchemaIcons(schema);

      // Ensure hardware structure exists for export-time augmentation
      if (!enhancedSchema.hardware) {
        enhancedSchema = {
          ...enhancedSchema,
          hardware: {
            systemType: 'core',
            outputs: [],
            halfBridgePairs: [],
            signalMap: {},
            genesisBoards: 0,
          },
        } as UISchema;
      }
      const hardwareCfg = enhancedSchema.hardware!;
      if (!hardwareCfg.outputs) {
        hardwareCfg.outputs = [] as OutputChannel[];
      }

      // Helper: sanitize any static signal-value bindings to empirbus before export
      const aliasToChannel: Record<string, string> = {
        // Power/BMS
        'battery-voltage': 'signal-bms-battery-voltage',
        'battery-current': 'signal-bms-battery-amperage',
        'battery-soc': 'signal-bms-battery-state-of-charge',
        // Solar
        'solar-voltage': 'signal-primary-solar-voltage',
        // No direct power signal available yet; bind to amperage as a placeholder source
        'solar-power': 'signal-primary-solar-amperage',
      };

      const isGauge = (comp: Component): comp is GaugeComponent => comp.type === 'gauge';

      const sanitizeSchemaBindings = (inputSchema: UISchema) => {
        const cloned: UISchema = JSON.parse(JSON.stringify(inputSchema)) as UISchema;
        let upgraded = 0;
        let converted = 0;

        if (Array.isArray(cloned.tabs)) {
          cloned.tabs = cloned.tabs.map((tab: Tab): Tab => ({
            ...tab,
            sections: Array.isArray(tab.sections)
              ? tab.sections.map((section: Section): Section => ({
                  ...section,
                  components: Array.isArray(section.components)
                    ? section.components.map((comp: Component): Component => {
                        if (!isGauge(comp)) return comp;
                        const hasValueBinding = (comp as GaugeComponent).bindings?.value;
                        if (!hasValueBinding) return comp;

                        // Try to infer alias from component id like "comp-signal-<alias>"
                        let alias: string | null = null;
                        if (typeof comp.id === 'string' && comp.id.startsWith('comp-signal-')) {
                          alias = comp.id.replace('comp-signal-', '');
                        }

                        const resolvedChannel = alias ? aliasToChannel[alias] || alias : null;

                        // Case 1: static -> empirbus (preferred channel if known, else alias)
                        if (comp.bindings.value?.type === 'static') {
                          const nextComp: GaugeComponent = {
                            ...comp,
                            bindings: {
                              ...comp.bindings,
                              value: resolvedChannel
                                ? { type: 'empirbus', channel: resolvedChannel, property: 'value' }
                                : { type: 'empirbus', channel: alias || 'unknown', property: 'value' },
                            },
                          };
                          converted++;
                          return nextComp;
                        }

                        // Case 2: empirbus but pointing at an alias (not a real signal id)
                        if (
                          comp.bindings.value?.type === 'empirbus' &&
                          typeof comp.bindings.value?.channel === 'string' &&
                          alias &&
                          comp.bindings.value.channel === alias &&
                          aliasToChannel[alias]
                        ) {
                          const resolved = aliasToChannel[alias] as string;
                          const nextComp: GaugeComponent = {
                            ...comp,
                            bindings: {
                              ...comp.bindings,
                              value: {
                                ...comp.bindings.value,
                                channel: resolved,
                                property: 'value',
                              },
                            },
                          };
                          upgraded++;
                          return nextComp;
                        }

                        return comp;
                      })
                    : section.components,
                }))
              : tab.sections,
          }));
        }

        return { schema: cloned, stats: { upgraded, converted } };
      };

      // 2. Fetch hardware config with signal mappings
      try {
        const hwConfigResponse = await fetch(
          '/deployment-package/configuration/hardware-config.json'
        );
        if (hwConfigResponse.ok) {
          const hardwareConfig = await hwConfigResponse.json();

          // Merge signal mappings from hardware config into user's schema
          if (
            hardwareConfig.outputs &&
            enhancedSchema.hardware &&
            enhancedSchema.hardware.outputs
          ) {
            type HWOutput = {
              id: string;
              source?: string;
              channel?: number;
              control?: string;
              label?: string;
              icon?: string;
              signals?: Record<string, number | null>;
            };
            const hwOutputsMap = new Map<string, HWOutput>();
            (hardwareConfig.outputs as Array<HWOutput>).forEach((hwOutput) => {
              hwOutputsMap.set(hwOutput.id, hwOutput);
            });

            // Add signals to each output in the user's schema
            hardwareCfg.outputs = hardwareCfg.outputs.map(
              (userOutput) => {
                const hwOutput = hwOutputsMap.get(userOutput.id);
                if (hwOutput && hwOutput.signals) {
                  return { ...userOutput, signals: hwOutput.signals };
                }
                return userOutput;
              }
            );

            // Ensure any referenced signal channels exist in hardware.outputs
            const referencedChannels = new Set<string>();
            enhancedSchema.tabs?.forEach((tab: Tab) => {
              tab.sections.forEach((section: Section) => {
                section.components.forEach((comp: Component) => {
                  type BindingLike = { type?: string; channel?: string | number; property?: string };
                  const bindings = (comp as { bindings?: Record<string, BindingLike> }).bindings;
                  if (!bindings) return;
                  for (const key of Object.keys(bindings)) {
                    const b = bindings[key];
                    if (b && b.type === 'empirbus' && typeof b.channel === 'string') {
                      referencedChannels.add(b.channel);
                    }
                  }
                });
              });
            });

            const existingIds = new Set((hardwareCfg.outputs || []).map((o: OutputChannel) => o.id));

            const added: string[] = [];
            referencedChannels.forEach((id) => {
              if (!existingIds.has(id)) {
                const hw = hwOutputsMap.get(id);
                if (hw) {
                  const numericChannel =
                    typeof hw.channel === 'number'
                      ? hw.channel
                      : typeof hw.signals?.value === 'number'
                        ? hw.signals!.value!
                        : 1; // safe fallback

                  const oc: OutputChannel = {
                    id: hw.id,
                    // Use a valid source enum; these signal IDs are virtual, map to 'genesis'
                    source: 'genesis',
                    channel: numericChannel,
                    control: 'special-function',
                    label: hw.label,
                    icon: hw.icon,
                  };

                  hardwareCfg.outputs.push(oc);
                  existingIds.add(id);
                  added.push(id);
                } else {
                  debug.warn(
                    `Referenced channel '${id}' not found in hardware-config.json; cannot add to hardware.outputs`
                  );
                }
              }
            });

            debug.log(
              `✓ Added signal mappings to schema for export (added ${added.length} referenced outputs)`
            );
          }
        }
      } catch (error) {
        debug.warn('Could not fetch hardware config for signal mappings:', error);
      }

      // 2b. Sanitize any static/alias value bindings in tabs/sections/components
      const { schema: sanitizedSchema, stats } = sanitizeSchemaBindings(enhancedSchema);
      enhancedSchema = sanitizedSchema;
      if (stats.converted || stats.upgraded) {
        debug.log(
          `✓ Sanitized gauge bindings (converted: ${stats.converted}, upgraded: ${stats.upgraded})`
        );
      }

      const schemaJson = JSON.stringify(enhancedSchema, null, 2);

      // 3. Try to fetch complete deployment package from public/deployment-package
      // These are copied during build by copy-hmi-assets.js script
      try {
        // Fetch manifest to get list of all deployment files
        const manifestResponse = await fetch('/deployment-package/manifest.json');

        if (manifestResponse.ok) {
          const manifest = await manifestResponse.json();
          debug.log(`Loading complete deployment package: ${manifest.totalFiles} files`);
          debug.log(`  - web/: ${manifest.directories.web} files`);
          debug.log(`  - configuration/: ${manifest.directories.configuration} files`);
          debug.log(`  - services/: ${manifest.directories.services} files`);

          // Fetch all files listed in manifest
          for (const file of manifest.files) {
            if (file === 'manifest.json') continue; // Skip the manifest itself

            const response = await fetch(`/deployment-package/${file}`);
            if (response.ok) {
              // Determine if file is text or binary
              const isText =
                file.endsWith('.html') ||
                file.endsWith('.json') ||
                file.endsWith('.js') ||
                file.endsWith('.css') ||
                file.endsWith('.svg') ||
                file.endsWith('.md') ||
                file.endsWith('.service');

              if (isText) {
                const content = await response.text();
                // File path already includes directory structure (e.g., "web/index1.html")
                // JSZip will create the nested folders automatically
                zip.file(file, content);
              } else {
                const content = await response.arrayBuffer();
                zip.file(file, content);
              }
            }
          }

          debug.log(`✓ Loaded complete deployment package (${manifest.totalFiles} files)`);
        } else {
          debug.warn('Deployment package manifest not found - package will contain schema only');
          debug.warn('Run: pnpm --filter @gcg/web-configurator prebuild');
        }
      } catch (error) {
        debug.warn('Could not fetch deployment package files:', error);
        debug.warn('The export package will contain only the schema and icons.');
      }

      // 4. Update web/schema.json with user's configuration (overwrite the template)
      zip.file('web/schema.json', schemaJson);

      // 5. Also update the HMI UI schema file so it loads the user's configuration
      zip.file('web/new-hmi-configuration-schema-2.json', schemaJson);

      // 6. Note: Icons are already included in the deployment package
      // The /web/icons/ directory was copied with all icons
      let libraryIconCount = 0;
      let customIconCount = 0;

      // Count referenced icons for stats
      if (schema.hardware && schema.hardware.outputs) {
        schema.hardware.outputs.forEach((output) => {
          if (output.icon) {
            if (output.icon.startsWith('/icons/')) {
              libraryIconCount++;
            } else if (output.icon.startsWith('data:image/')) {
              customIconCount++;
            }
          }
        });
      }

      // 7. Create README with deployment instructions
      const readme = `# ${schema.metadata.name} - Deployment Package

## Contents

- \`web/\` - Complete HMI UI application
  - \`index1.html\` - HMI UI entry point  
  - \`hmi-assets/\` - JavaScript and CSS bundles
  - \`schema.json\` - Your custom configuration (legacy)
  - \`new-hmi-configuration-schema-2.json\` - Your custom configuration (HMI UI)
  - \`icons/\` - All icon files (${libraryIconCount + customIconCount} total)
  - Essential data files (manifest, signals, etc.)
- \`services/\` - Backend services (if available)
- \`configuration/\` - Additional config files (if available)

## Deployment Instructions

### Prerequisites
- EmpirBus controller with Core Graphics HMI system  
- Garmin display with web interface support
- Network access to the HMI device

### Step 1: Upload EmpirBus Configuration
1. Open your EmpirBus configuration tool
2. Upload your .ebp file to the controller  
3. Verify the configuration is loaded successfully

### Step 2: Deploy Complete Package
1. Extract this entire ZIP file to your Garmin device
2. The \`web/\` folder contains the complete HMI UI application
3. Upload via USB, network transfer, or SD card
4. Typical deployment location: device root or /mnt/data/

### Step 3: Access HMI Interface  
1. Navigate to the Garmin device web interface
2. Access index1.html from the web/ folder
3. Your custom interface "${schema.metadata.name}" will load
4. Test all functionality with the physical hardware

## Package Structure

\`\`\`
${schema.metadata.name.replace(/\s+/g, '-').toLowerCase()}-config.zip
├── web/
│   ├── index1.html          # HMI UI application
│   ├── hmi-assets/          # Compiled JS/CSS
│   ├── schema.json          # Your configuration  
│   ├── icons/               # Icon files
│   ├── manifest1.json       # App manifest
│   ├── dataitems.json       # Data definitions
│   ├── signal-info.json     # EmpirBus signals
│   └── unit-info.json       # Hardware units
├── services/                # Backend services (optional)
└── configuration/           # Additional configs (optional)
\`\`\`

## Configuration Summary

**Name:** ${schema.metadata.name}
**Version:** ${schema.metadata.version}
**Schema Version:** ${schema.schemaVersion}
**Generated:** ${new Date().toISOString()}
**Package Type:** Full Deployment (HMI UI + Configuration)

### Hardware Configuration
- **System Type:** ${schema.hardware?.systemType || 'Not configured'}
- **Output Channels:** ${schema.hardware?.outputs?.length || 0}

### Subsystems Configured  
- **Power:** ${schema.power ? 'Configured' : 'Not configured'}
- **HVAC:** ${schema.hvac?.heating?.enabled || schema.hvac?.cooling?.enabled || schema.hvac?.ventilation?.enabled ? 'Enabled' : 'Disabled'}
- **Plumbing:** ${schema.plumbing?.enabled ? 'Enabled' : 'Disabled'}
- **Accessories:** ${schema.accessories?.keypad?.enabled || schema.accessories?.awning?.enabled || schema.accessories?.slides?.enabled || schema.accessories?.itcLighting?.enabled ? 'Enabled' : 'Disabled'}
- **ITC Lighting:** ${schema.accessories?.itcLighting?.enabled ? 'Enabled' : 'Disabled'}

### Theme
- **Preset:** ${schema.theme?.preset || 'blue'}
${schema.theme?.customColors ? '- **Custom Colors:** Applied' : ''}

### UI Structure
- **Tabs:** ${schema.tabs?.length || 0}
- **Total Sections:** ${schema.tabs?.reduce((sum, tab) => sum + tab.sections.length, 0) || 0}
- **Total Components:** ${
        schema.tabs?.reduce(
          (total, tab) =>
            total + tab.sections.reduce((sum, section) => sum + section.components.length, 0),
          0
        ) || 0
      }

## Troubleshooting

### HMI UI doesn't load
- Verify \`web/index1.html\` exists in the correct location
- Check browser console for JavaScript errors  
- Ensure \`hmi-assets/\` folder is in the same directory as index1.html

### Schema validation fails
- Check \`web/schema.json\` is valid JSON
- Verify schema matches expected structure
- Review console errors for specific validation issues

### Hardware doesn't respond
- Verify EmpirBus controller is running and configured
- Check WebSocket connection to controller
- Verify channel IDs in schema match EmpirBus configuration
- Test with simple toggle channels first (channels 3, 4, 6, 7, 8)

## Support

For issues or questions:
- Check \`/docs/INTEGRATION_FLOW_COMPLETE_GUIDE.md\` for architecture details
- Review \`/docs/HMI_DEPLOYMENT_GUIDE.md\` for deployment specifics  
- Check browser console for detailed error messages

---
Generated by Garmin Core Graphics Configurator v${schema.metadata.version}
This package includes the complete HMI UI application and is ready for direct deployment.
`;

      zip.file('README.md', readme);

      // 5. Generate the zip file
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 },
      });

      // Store compiled package for download
      setCompiledPackage({
        deploymentZip: blob,
        schemaJson: schemaJson,
        stats: {
          totalIcons: libraryIconCount + customIconCount,
          libraryIcons: libraryIconCount,
          customIcons: customIconCount,
        },
      });

      debug.log('✅ Package compiled successfully!');
    } catch (error) {
      debug.error('Failed to compile deployment package:', error);
      setCompilationError(
        error instanceof Error ? error.message : 'Unknown error occurred during compilation'
      );
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDownloadDeploymentPackage = () => {
    if (!compiledPackage || !schema) return;

    setIsDownloading(true);
    try {
      const url = URL.createObjectURL(compiledPackage.deploymentZip);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${schema.metadata.name.replace(/\s+/g, '-').toLowerCase()}-deployment.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadSchemaJSON = () => {
    if (!compiledPackage || !schema) return;

    const dataBlob = new Blob([compiledPackage.schemaJson], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${schema.metadata.name.replace(/\s+/g, '-').toLowerCase()}-schema.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadDebugSchema = () => {
    if (!schema) return;

    const schemaJson = JSON.stringify(schema, null, 2);
    const dataBlob = new Blob([schemaJson], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${schema.metadata.name.replace(/\s+/g, '-').toLowerCase()}-debug-schema.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Export Configuration</h2>
        <p className={styles.subtitle}>
          Compile your configuration and download the deployment package for your Garmin display
        </p>
      </div>

      {hasErrors && (
        <div className={styles.errorBanner}>
          ⚠️ Schema has validation errors. Fix them before compiling.
          <div style={{ marginTop: '10px' }}>
            <button
              className={styles.buttonSecondary}
              onClick={handleDownloadDebugSchema}
              style={{ fontSize: '14px' }}
            >
              🐛 Download Debug Schema
            </button>
            <span style={{ marginLeft: '10px', fontSize: '14px', opacity: 0.7 }}>
              Export current configuration for debugging (includes validation errors)
            </span>
          </div>
        </div>
      )}

      {compilationError && (
        <div className={styles.errorBanner}>❌ Compilation Error: {compilationError}</div>
      )}

      <div className={styles.content}>
        {/* Step 1: Compile */}
        <section className={styles.section}>
          <h3>Step 1: Compile Configuration</h3>
          <p className={styles.sectionDescription}>
            Validate and compile your configuration into a deployment-ready package
          </p>

          <button
            className={styles.buttonPrimary}
            onClick={handleCompilePackage}
            disabled={!canCompile || isCompiling || !!compiledPackage}
          >
            {isCompiling
              ? '⏳ Compiling...'
              : compiledPackage
                ? '✅ Compiled Successfully'
                : '🔨 Compile Package'}
          </button>
        </section>

        {/* Step 2: Download */}
        {compiledPackage && (
          <section className={styles.section}>
            <h3>Step 2: Download Files</h3>
            <p className={styles.sectionDescription}>
              Download the compiled deployment package and schema backup
            </p>

            <div className={styles.downloadOptions}>
              <div className={styles.downloadCard}>
                <div className={styles.downloadIcon}>📦</div>
                <h4>Deployment Package</h4>
                <p>
                  Complete ZIP file with HMI UI, configuration, icons, and all assets. Upload this
                  to your Garmin display.
                </p>
                <button
                  className={styles.buttonPrimary}
                  onClick={handleDownloadDeploymentPackage}
                  disabled={isDownloading}
                >
                  {isDownloading ? '⏳ Downloading...' : '📥 Download Deployment Package'}
                </button>
              </div>

              <div className={styles.downloadCard}>
                <div className={styles.downloadIcon}>📄</div>
                <h4>Schema JSON</h4>
                <p>
                  Backup of your configuration that can be re-uploaded in the Hardware Configuration
                  section to restore your settings.
                </p>
                <button className={styles.buttonSecondary} onClick={handleDownloadSchemaJSON}>
                  � Download schema.json
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Summary Section */}
        <section className={styles.section}>
          <h3>📋 Configuration Summary</h3>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <h4>Basic Information</h4>
              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Name:</span>
                  <span className={styles.summaryValue}>{schema.metadata.name}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Version:</span>
                  <span className={styles.summaryValue}>{schema.metadata.version}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Schema Version:</span>
                  <span className={styles.summaryValue}>{schema.schemaVersion}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Theme:</span>
                  <span className={styles.summaryValue}>
                    {schema.theme?.preset || 'blue'}
                    {schema.theme?.customColors && ' (Custom)'}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <h4>Hardware Configuration</h4>
              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>System Type:</span>
                  <span className={styles.summaryValue}>
                    {schema.hardware?.systemType || 'Not configured'}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Output Channels:</span>
                  <span className={styles.summaryValue}>
                    {schema.hardware?.outputs?.length || 0}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Total Icons:</span>
                  <span className={styles.summaryValue}>
                    {schema.hardware?.outputs?.filter((o) => o.icon).length || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <h4>Subsystems</h4>
              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Power:</span>
                  <span className={styles.summaryValue}>{schema.power ? '✅' : '—'}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>HVAC:</span>
                  <span className={styles.summaryValue}>
                    {schema.hvac?.heating?.enabled ||
                    schema.hvac?.cooling?.enabled ||
                    schema.hvac?.ventilation?.enabled
                      ? '✅'
                      : '—'}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Plumbing:</span>
                  <span className={styles.summaryValue}>
                    {schema.plumbing?.enabled ? '✅' : '—'}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Accessories:</span>
                  <span className={styles.summaryValue}>
                    {schema.accessories?.keypad?.enabled ||
                    schema.accessories?.awning?.enabled ||
                    schema.accessories?.slides?.enabled
                      ? '✅'
                      : '—'}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>ITC Lighting:</span>
                  <span className={styles.summaryValue}>
                    {schema.accessories?.itcLighting?.enabled ? '✅' : '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <h4>UI Structure</h4>
              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Tabs:</span>
                  <span className={styles.summaryValue}>{schema.tabs?.length || 0}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Sections:</span>
                  <span className={styles.summaryValue}>
                    {schema.tabs?.reduce((sum, tab) => sum + tab.sections.length, 0) || 0}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Components:</span>
                  <span className={styles.summaryValue}>
                    {schema.tabs?.reduce(
                      (total, tab) =>
                        total +
                        tab.sections.reduce((sum, section) => sum + section.components.length, 0),
                      0
                    ) || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3>🚀 Deployment Instructions</h3>
          <div className={styles.instructions}>
            <div className={styles.instructionStep}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h4>Compile Configuration</h4>
                <p>
                  Click "Compile Package" above. This validates your configuration and creates a
                  complete deployment package with the HMI UI application, your schema, and all
                  assets.
                </p>
              </div>
            </div>

            <div className={styles.instructionStep}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h4>Download Files</h4>
                <p>
                  Download the deployment package ZIP file to upload to your Garmin device.
                  Optionally, download the schema.json for backup or future restoration.
                </p>
              </div>
            </div>

            <div className={styles.instructionStep}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h4>Deploy to Garmin Device</h4>
                <p>
                  Extract the entire ZIP file to your Garmin device (USB, network, or SD card). The
                  package includes the web/ folder with index1.html, hmi-assets/, and schema.json.
                </p>
              </div>
            </div>

            <div className={styles.instructionStep}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h4>Launch Application</h4>
                <p>
                  Restart the HMI application on your Garmin display. Your custom interface will
                  appear in the app selector!
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
