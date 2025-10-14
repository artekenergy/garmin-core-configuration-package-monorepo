import { useState, useMemo, useEffect } from 'react';
import { useSchema } from '../context/SchemaContext';
import type { HardwareConfig, OutputChannel } from '@gcg/schema';
import IconPickerModal from '../components/IconPickerModal';
import {
  CORE_CHANNELS,
  CORE_LITE_CHANNELS,
  HALF_BRIDGE_PAIRS,
  generateChannelId,
  findHalfBridgePair,
  isPrimaryChannel,
  CONTROL_COMPONENT_MAP,
  generateGenesisChannels,
} from '../constants/hardware';
import { debug } from '../utils/debug';
import styles from './HardwareConfigPage.module.css';

export default function HardwareConfigPage() {
  const { schema, updateSchema, loadHardwareConfig } = useSchema();
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [iconPickerChannelId, setIconPickerChannelId] = useState<string | null>(null);
  const [debugModeEnabled, setDebugModeEnabled] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Handle custom hardware-config.json upload
  const handleHardwareConfigUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const hardwareConfig = JSON.parse(content);

        // Basic validation
        if (!hardwareConfig.outputs || !Array.isArray(hardwareConfig.outputs)) {
          throw new Error('Invalid hardware config: missing outputs array');
        }

        // Load into context for channel validation
        loadHardwareConfig(hardwareConfig);

        // Also update the schema with the hardware config
        if (schema && schema.hardware) {
          const outputChannels = hardwareConfig.outputs.map((output: any) => ({
            id: output.id,
            source: output.source || 'core',
            channel: output.channel,
            control: output.control || 'toggle',
            label: output.label || `Channel ${output.channel}`,
            icon: output.icon || undefined,
          }));

          updateSchema({
            ...schema,
            hardware: {
              ...schema.hardware,
              systemType: hardwareConfig.systemType || schema.hardware.systemType,
              outputs: outputChannels,
              signalMap: hardwareConfig.signalMap || schema.hardware.signalMap,
              genesisBoards: schema.hardware.genesisBoards,
              halfBridgePairs: schema.hardware.halfBridgePairs,
            },
          });

          alert(
            `✅ Custom hardware config loaded successfully!\n\n${hardwareConfig.outputs.length} channels imported`
          );
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setUploadError(`Failed to load hardware config: ${errorMessage}`);
        debug.error('Hardware config upload error:', error);
      }
    };

    reader.onerror = () => {
      setUploadError('Failed to read file');
    };

    reader.readAsText(file);

    // Reset input so same file can be uploaded again
    event.target.value = '';
  };

  // Handle schema file upload
  const handleSchemaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const uploadedSchema = JSON.parse(content);

        // Basic validation
        if (!uploadedSchema.schemaVersion || !uploadedSchema.metadata) {
          throw new Error('Invalid schema file: missing required fields');
        }

        // Update the schema
        updateSchema(uploadedSchema);
        alert(
          `✅ Schema loaded successfully!\n\nName: ${uploadedSchema.metadata.name}\nVersion: ${uploadedSchema.metadata.version}`
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setUploadError(`Failed to load schema: ${errorMessage}`);
        debug.error('Schema upload error:', error);
      }
    };

    reader.onerror = () => {
      setUploadError('Failed to read file');
    };

    reader.readAsText(file);

    // Reset input so same file can be uploaded again
    event.target.value = '';
  };

  // Enable debug mode with Ctrl+Shift+D (or Cmd+Shift+D on Mac)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setDebugModeEnabled((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-load hardware config when page loads or system type changes
  useEffect(() => {
    const autoLoadHardwareConfig = async () => {
      if (!schema?.hardware) return;

      const systemType = schema.hardware.systemType;
      // Prefer the new validation configs; fall back to legacy names
      const candidates =
        systemType === 'core'
          ? ['/configuration/core-config.json', '/core-config.json', '/hardware-config-core.json']
          : [
              '/configuration/lite-config.json',
              '/lite-config.json',
              '/hardware-config-core-lite.json',
            ];

      for (const url of candidates) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const hardwareConfig = await response.json();
            loadHardwareConfig(hardwareConfig);
            debug.log(`✅ Auto-loaded ${systemType.toUpperCase()} hardware config from ${url}`);
            return; // Stop after first success
          }
        } catch (e) {
          // Try next candidate
        }
      }

      debug.warn('Could not auto-load any hardware validation config');
    };

    autoLoadHardwareConfig();
  }, [schema?.hardware?.systemType, loadHardwareConfig]);

  // Get or initialize hardware config
  const hardwareConfig: HardwareConfig = schema?.hardware || {
    systemType: 'core',
    outputs: [],
    halfBridgePairs: [],
    signalMap: {},
    genesisBoards: 0,
  };

  // Generate channel list based on system type and Genesis boards
  const channelDefinitions = useMemo(() => {
    const baseChannels = hardwareConfig.systemType === 'core' ? CORE_CHANNELS : CORE_LITE_CHANNELS;

    const genesisChannels = generateGenesisChannels(hardwareConfig.genesisBoards || 0);
    const channels = [...baseChannels, ...genesisChannels];

    return channels.map(({ source, channel }) => {
      const id = generateChannelId(source, channel);
      const existingOutput = hardwareConfig.outputs.find((o) => o.id === id);

      return (
        existingOutput || {
          id,
          source,
          channel,
          control: 'not-used' as const,
        }
      );
    });
  }, [hardwareConfig.systemType, hardwareConfig.outputs, hardwareConfig.genesisBoards]);

  // Handle system type change
  const handleSystemTypeChange = (systemType: 'core' | 'core-lite') => {
    if (!schema) return;

    // CORE LITE always has at least 1 Genesis board (included), max 4 total
    const minGenesisBoards = systemType === 'core-lite' ? 1 : 0;
    const maxGenesisBoards = 4;
    const currentGenesisBoards = hardwareConfig.genesisBoards || 0;
    const newGenesisBoards = Math.max(
      minGenesisBoards,
      Math.min(currentGenesisBoards, maxGenesisBoards)
    );

    // Preserve existing channel configurations where possible
    const newChannels = systemType === 'core' ? CORE_CHANNELS : CORE_LITE_CHANNELS;
    const genesisChannels = generateGenesisChannels(newGenesisBoards);
    const allChannels = [...newChannels, ...genesisChannels];

    const preservedOutputs = hardwareConfig.outputs.filter((output) =>
      allChannels.some((ch) => ch.source === output.source && ch.channel === output.channel)
    );

    updateSchema({
      ...schema,
      hardware: {
        ...hardwareConfig,
        systemType,
        outputs: preservedOutputs,
        halfBridgePairs: systemType === 'core' ? hardwareConfig.halfBridgePairs : [],
        genesisBoards: newGenesisBoards,
      },
    });
  };

  // Handle Genesis board count change
  const handleGenesisBoardsChange = (count: number) => {
    if (!schema) return;

    // CORE LITE always has at least 1 Genesis board, CORE can have 0
    const minBoards = hardwareConfig.systemType === 'core-lite' ? 1 : 0;
    const maxBoards = 4;
    const newCount = Math.max(minBoards, Math.min(count, maxBoards));

    // Remove outputs from boards that are being removed
    const genesisChannels = generateGenesisChannels(newCount);
    const preservedOutputs = hardwareConfig.outputs.filter((output) => {
      if (output.source !== 'genesis') return true;
      return genesisChannels.some(
        (ch) => ch.source === output.source && ch.channel === output.channel
      );
    });

    updateSchema({
      ...schema,
      hardware: {
        ...hardwareConfig,
        genesisBoards: newCount,
        outputs: preservedOutputs,
      },
    });
  };

  // Handle channel update
  const handleChannelUpdate = (channelId: string, updates: Partial<OutputChannel>) => {
    if (!schema) return;

    const channelIndex = hardwareConfig.outputs.findIndex((o) => o.id === channelId);
    let newOutputs = [...hardwareConfig.outputs];

    if (channelIndex >= 0) {
      // Update existing channel
      const existing = newOutputs[channelIndex];
      newOutputs[channelIndex] = { ...existing, ...updates } as OutputChannel;
    } else {
      // Add new channel
      const channelDef = channelDefinitions.find((c) => c.id === channelId);
      if (channelDef) {
        newOutputs.push({ ...channelDef, ...updates } as OutputChannel);
      }
    }

    // Handle half-bridge pairing logic for CORE systems
    if (hardwareConfig.systemType === 'core' && updates.control === 'half-bridge') {
      const channelDef = channelDefinitions.find((c) => c.id === channelId);
      if (channelDef) {
        const pair = findHalfBridgePair(channelDef.source, channelDef.channel);
        if (pair) {
          const isPrimary = isPrimaryChannel(channelDef.source, channelDef.channel, pair);
          const channelAId = generateChannelId(pair.source, pair.channelA);
          const channelBId = generateChannelId(pair.source, pair.channelB);
          const pairChannelId = isPrimary ? channelBId : channelAId;

          // Enable the pair
          const newPairs = hardwareConfig.halfBridgePairs || [];
          if (!newPairs.find((p) => p.source === pair.source && p.channelA === pair.channelA)) {
            newPairs.push({ ...pair, enabled: true });
          }

          // Set both channels to half-bridge mode
          newOutputs = newOutputs.map((output) => {
            if (output.id === channelAId || output.id === channelBId) {
              return { ...output, control: 'half-bridge' as const };
            }
            return output;
          });

          // Ensure the pair channel exists in outputs
          if (!newOutputs.find((o) => o.id === pairChannelId)) {
            const pairChannelDef = channelDefinitions.find((c) => c.id === pairChannelId);
            if (pairChannelDef) {
              newOutputs.push({
                ...pairChannelDef,
                control: 'half-bridge' as const,
              });
            }
          }

          updateSchema({
            ...schema,
            hardware: {
              ...hardwareConfig,
              outputs: newOutputs,
              halfBridgePairs: newPairs,
            },
          });
          return;
        }
      }
    }

    // Handle un-pairing when changing from half-bridge to something else
    if (
      hardwareConfig.systemType === 'core' &&
      updates.control !== undefined &&
      updates.control !== 'half-bridge'
    ) {
      const channelDef = channelDefinitions.find((c) => c.id === channelId);
      if (channelDef) {
        const pair = findHalfBridgePair(channelDef.source, channelDef.channel);
        if (pair) {
          const isPrimary = isPrimaryChannel(channelDef.source, channelDef.channel, pair);
          const channelAId = generateChannelId(pair.source, pair.channelA);
          const channelBId = generateChannelId(pair.source, pair.channelB);
          const pairChannelId = isPrimary ? channelBId : channelAId;
          const pairChannelOutput = newOutputs.find((o) => o.id === pairChannelId);

          // If the pair channel is currently half-bridge, change it to the same control type
          if (pairChannelOutput && pairChannelOutput.control === 'half-bridge') {
            newOutputs = newOutputs.map((output) => {
              if (output.id === pairChannelId) {
                return { ...output, control: updates.control! };
              }
              return output;
            }) as OutputChannel[];
          }

          // Remove the pair from halfBridgePairs array
          const newPairs = (hardwareConfig.halfBridgePairs || []).filter(
            (p) => !(p.source === pair.source && p.channelA === pair.channelA)
          );

          updateSchema({
            ...schema,
            hardware: {
              ...hardwareConfig,
              outputs: newOutputs,
              halfBridgePairs: newPairs,
            },
          });
          return;
        }
      }
    }

    updateSchema({
      ...schema,
      hardware: {
        ...hardwareConfig,
        outputs: newOutputs,
      },
    });
  };

  // Check if channel is in an active half-bridge pair
  const isInActivePair = (channelId: string): boolean => {
    const channelDef = channelDefinitions.find((c) => c.id === channelId);
    if (!channelDef) return false;

    const pair = findHalfBridgePair(channelDef.source, channelDef.channel);
    if (!pair) return false;

    return (hardwareConfig.halfBridgePairs || []).some(
      (p) => p.source === pair.source && p.channelA === pair.channelA && p.enabled
    );
  };

  // Handle icon picker open
  const handleOpenIconPicker = (channelId: string) => {
    setIconPickerChannelId(channelId);
    setIconPickerOpen(true);
  };

  // Handle icon selection
  const handleIconSelect = (iconPath: string) => {
    if (iconPickerChannelId) {
      handleChannelUpdate(iconPickerChannelId, { icon: iconPath });
    }
  };

  // Get current icon for picker
  const getCurrentIcon = () => {
    if (!iconPickerChannelId) return undefined;
    const channel = channelDefinitions.find((c) => c.id === iconPickerChannelId);
    return channel?.icon;
  };

  // 🎲 DEBUG: Random configuration generator
  const handleRandomConfig = () => {
    if (!schema) return;

    const controlTypes: Array<'toggle-button' | 'push-button' | 'dimmer' | 'half-bridge'> = [
      'toggle-button',
      'push-button',
      'dimmer',
      'half-bridge',
    ];
    const deviceNames = [
      'Living Room Light',
      'Bedroom Fan',
      'Kitchen Dimmer',
      'Water Pump',
      'Awning Motor',
      'Step Light',
      'Patio Light',
      'Reading Lamp',
      'Ceiling Fan',
      'Accent Light',
      'Cabinet Light',
      'Exterior Light',
      'Entry Light',
      'Tank Heater',
      'Air Compressor',
      'Slide Motor',
      'Leveling Jack',
      'Stabilizer',
    ];

    const icons = [
      '💡',
      '🔦',
      '🌟',
      '⭐',
      '💫',
      '🔆',
      '🌙',
      '🎯',
      '🔥',
      '💧',
      '🌊',
      '🌪️',
      '⚡',
      '🔌',
      '🎨',
      '🎭',
    ];

    const randomOutputs: OutputChannel[] = channelDefinitions.map((ch) => {
      // Skip some channels randomly (30% chance)
      if (Math.random() < 0.3) {
        return {
          id: ch.id,
          source: ch.source,
          channel: ch.channel,
          control: 'not-used' as const,
        };
      }

      const control = controlTypes[Math.floor(Math.random() * controlTypes.length)]!;
      const label = deviceNames[Math.floor(Math.random() * deviceNames.length)]!;
      const icon = icons[Math.floor(Math.random() * icons.length)]!;

      const output: OutputChannel = {
        id: ch.id,
        source: ch.source,
        channel: ch.channel,
        control,
        label,
        icon,
      };

      // Add range for dimmers
      if (control === 'dimmer') {
        output.range = {
          min: 0,
          max: 100,
          step: Math.random() < 0.5 ? 1 : 5,
        };
      }

      return output;
    });

    updateSchema({
      ...schema,
      hardware: {
        ...hardwareConfig,
        outputs: randomOutputs,
      },
    });

    alert(
      `🎲 Random configuration applied!\n\n${randomOutputs.filter((o) => o.control !== 'not-used').length} channels configured`
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>Hardware Configuration</h2>
          <p>Configure output channels and hardware settings</p>
        </div>
        <div className={styles.headerActions}>
          <label className={styles.uploadButton}>
            Load Custom .epb
            <input
              type="file"
              accept=".json,.epb,application/json"
              onChange={handleHardwareConfigUpload}
              style={{ display: 'none' }}
              title="Upload custom hardware configuration file"
            />
          </label>
          <label className={styles.uploadButton}>
            Upload Schema
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleSchemaUpload}
              style={{ display: 'none' }}
            />
          </label>
          {debugModeEnabled && (
            <button
              onClick={handleRandomConfig}
              className={styles.debugButton}
              title="Generate random configuration for testing"
            >
              🎲 Random Config
            </button>
          )}
        </div>
      </div>

      {uploadError && <div className={styles.uploadError}>⚠️ {uploadError}</div>}

      {!debugModeEnabled && (
        <div className={styles.debugHint}>
          💡 Press <kbd>Ctrl/Cmd + Shift + D</kbd> to enable debug mode
        </div>
      )}

      {/* System Type Selector */}
      <div className={styles.section}>
        <h3>System Type</h3>
        <div className={styles.systemTypeSelector}>
          <label className={styles.radioOption}>
            <input
              type="radio"
              name="systemType"
              value="core"
              checked={hardwareConfig.systemType === 'core'}
              onChange={(e) => handleSystemTypeChange(e.target.value as 'core')}
            />
            <div className={styles.radioContent}>
              <strong>CORE</strong>
              <span>20 output channels, half-bridge pairing support</span>
            </div>
          </label>
          <label className={styles.radioOption}>
            <input
              type="radio"
              name="systemType"
              value="core-lite"
              checked={hardwareConfig.systemType === 'core-lite'}
              onChange={(e) => handleSystemTypeChange(e.target.value as 'core-lite')}
            />
            <div className={styles.radioContent}>
              <strong>CORE LITE</strong>
              <span>6 CORE-LITE output channels</span>
            </div>
          </label>
        </div>
      </div>

      {/* Genesis Boards */}
      <div className={styles.section}>
        <h3>Genesis Boards</h3>
        <p className={styles.sectionDescription}>
          Each Genesis board provides 4 additional output channels.
          {hardwareConfig.systemType === 'core'
            ? ' CORE systems support up to 4 Genesis boards.'
            : ' CORE LITE includes 1 Genesis board (4 channels) and supports up to 3 additional boards.'}
        </p>
        <div className={styles.genesisBoardSelector}>
          <label className={styles.genesisBoardLabel}>
            {hardwareConfig.systemType === 'core'
              ? 'Number of Genesis Boards:'
              : 'Total Genesis Boards (1 included + up to 3 additional):'}
          </label>
          <div className={styles.genesisBoardButtons}>
            {Array.from({ length: 5 }, (_, i) => {
              const minBoards = hardwareConfig.systemType === 'core-lite' ? 1 : 0;
              if (i < minBoards) return null;
              return (
                <button
                  key={i}
                  className={`${styles.genesisBoardButton} ${
                    (hardwareConfig.genesisBoards || 0) === i ? styles.active : ''
                  }`}
                  onClick={() => handleGenesisBoardsChange(i)}
                >
                  {i}
                </button>
              );
            })}
          </div>
          {hardwareConfig.genesisBoards > 0 && (
            <div className={styles.genesisBoardInfo}>
              <span className={styles.infoIcon}>ℹ️</span>
              <span>
                {hardwareConfig.genesisBoards} board{hardwareConfig.genesisBoards > 1 ? 's' : ''} ={' '}
                {hardwareConfig.genesisBoards * 4} Genesis channels (GENESIS #1 - #
                {hardwareConfig.genesisBoards * 4})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Channel Configuration */}
      <div className={styles.section}>
        <h3>Output Channels</h3>
        <div className={styles.channelGrid}>
          {channelDefinitions.map((channel) => {
            const isSelected = selectedChannel === channel.id;
            const inPair = isInActivePair(channel.id);
            const canBePaired =
              hardwareConfig.systemType === 'core' &&
              findHalfBridgePair(channel.source, channel.channel) !== null;

            return (
              <div
                key={channel.id}
                className={`${styles.channelCard} ${isSelected ? styles.selected : ''}`}
                onClick={() => setSelectedChannel(channel.id)}
              >
                <div className={styles.channelHeader}>
                  <div className={styles.channelId}>
                    {channel.source.toUpperCase()} #{channel.channel}
                    {inPair && <span className={styles.pairBadge}>HALF-BRIDGE</span>}
                  </div>
                  <select
                    className={styles.controlSelect}
                    value={channel.control}
                    onChange={(e) =>
                      handleChannelUpdate(channel.id, {
                        control: e.target.value as any,
                      })
                    }
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="not-used">Not Used</option>
                    {canBePaired && <option value="push-button">Momentary</option>}
                    {canBePaired && <option value="toggle-button">Toggle</option>}
                    {canBePaired && <option value="half-bridge">Half-Bridge</option>}
                    {!canBePaired && <option value="push-button">Push Button</option>}
                    {!canBePaired && <option value="toggle-button">Toggle Button</option>}
                    {!canBePaired && <option value="slider">Slider</option>}
                  </select>
                </div>

                {channel.control !== 'not-used' && (
                  <div className={styles.channelDetails}>
                    <input
                      type="text"
                      className={styles.labelInput}
                      placeholder="Channel label..."
                      value={channel.label || ''}
                      onChange={(e) => handleChannelUpdate(channel.id, { label: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                    />

                    {/* Icon Picker (for half-bridge and button controls) */}
                    {(channel.control === 'push-button' ||
                      channel.control === 'toggle-button' ||
                      channel.control === 'half-bridge') && (
                      <div className={styles.iconPickerSection}>
                        <label className={styles.iconLabel}>Icon:</label>
                        <button
                          className={styles.iconPreviewButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenIconPicker(channel.id);
                          }}
                        >
                          {channel.icon ? (
                            <img
                              src={channel.icon}
                              alt="Selected icon"
                              className={styles.iconImage}
                            />
                          ) : (
                            <span className={styles.iconPlaceholder}>+ Select Icon</span>
                          )}
                        </button>
                        {channel.icon && (
                          <button
                            className={styles.iconClearButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChannelUpdate(channel.id, { icon: undefined });
                            }}
                            title="Clear icon"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    )}

                    <div className={styles.metadata}>
                      {channel.signalId && (
                        <span className={styles.signalId}>Signal: {channel.signalId}</span>
                      )}
                      {CONTROL_COMPONENT_MAP[channel.control] && (
                        <span className={styles.component}>
                          → {CONTROL_COMPONENT_MAP[channel.control]?.component || 'N/A'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Half-Bridge Pairs (CORE only) */}
      {hardwareConfig.systemType === 'core' && (
        <div className={styles.section}>
          <h3>Half-Bridge Pairs</h3>
          <p className={styles.helpText}>
            Half-bridge pairs allow bidirectional motor control (e.g., awnings, slide-outs). Select
            "Half-Bridge Pair" on either channel to enable pairing.
          </p>
          <div className={styles.pairList}>
            {HALF_BRIDGE_PAIRS.map((pair) => {
              const isEnabled = (hardwareConfig.halfBridgePairs || []).some(
                (p) => p.source === pair.source && p.channelA === pair.channelA && p.enabled
              );
              return (
                <div
                  key={`${pair.source}:${pair.channelA}-${pair.channelB}`}
                  className={styles.pairItem}
                >
                  <span className={styles.pairLabel}>
                    {pair.source.toUpperCase()} #{pair.channelA} + #{pair.channelB}
                  </span>
                  <span className={isEnabled ? styles.enabledBadge : styles.disabledBadge}>
                    {isEnabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className={styles.section}>
        <h3>Summary</h3>
        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Active Channels:</span>
            <span className={styles.summaryValue}>
              {channelDefinitions.filter((c) => c.control !== 'not-used').length} /{' '}
              {channelDefinitions.length}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Push Buttons:</span>
            <span className={styles.summaryValue}>
              {channelDefinitions.filter((c) => c.control === 'push-button').length}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Toggle Buttons:</span>
            <span className={styles.summaryValue}>
              {channelDefinitions.filter((c) => c.control === 'toggle-button').length}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Sliders:</span>
            <span className={styles.summaryValue}>
              {channelDefinitions.filter((c) => c.control === 'slider').length}
            </span>
          </div>
        </div>
      </div>

      {/* Icon Picker Modal */}
      <IconPickerModal
        isOpen={iconPickerOpen}
        onClose={() => setIconPickerOpen(false)}
        onSelect={handleIconSelect}
        selectedIcon={getCurrentIcon()}
      />
    </div>
  );
}
