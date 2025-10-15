import { useMemo, useState, useEffect } from 'react';
import type { UISchema } from '@gcg/schema';
import { CONTROL_COMPONENT_MAP } from '../constants/hardware';
import { debug } from '../utils/debug';
import styles from './ComponentPalette.module.css';

interface ComponentPaletteProps {
  schema: UISchema;
  onAddComponent: (channelId: string, componentType?: string) => void;
  filterType?: 'switching' | 'signal-values' | 'image' | 'mixed' | null;
}

type ComponentCategory = 'switching' | 'signal-values';

export default function ComponentPalette({
  schema,
  onAddComponent,
  filterType,
}: ComponentPaletteProps) {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>('switching');

  // Auto-switch category when filterType changes
  useEffect(() => {
    debug.log('[DEBUG ComponentPalette] filterType changed to:', filterType);
    if (filterType === 'switching' || filterType === 'signal-values') {
      setSelectedCategory(filterType);
      debug.log('[DEBUG ComponentPalette] Auto-switched category to:', filterType);
    }
  }, [filterType]);

  // Get switching components from hardware
  const switchingComponents = useMemo(() => {
    if (!schema.hardware) return [];

    return schema.hardware.outputs.filter((output) => output.control !== 'not-used');
  }, [schema]);

  // Get signal value components (gauges, indicators)
  const signalValueComponents = useMemo(() => {
    const signals: Array<{ id: string; label: string; type: string; source: string }> = [];

    // Power signals
    if (schema.power) {
      signals.push(
        { id: 'battery-voltage', label: 'Battery Voltage', type: 'gauge', source: 'power' },
        { id: 'battery-current', label: 'Battery Current', type: 'gauge', source: 'power' },
        { id: 'battery-soc', label: 'State of Charge', type: 'gauge', source: 'power' }
      );
      if (schema.power.solar?.enabled) {
        signals.push(
          { id: 'solar-power', label: 'Solar Power', type: 'gauge', source: 'solar' },
          { id: 'solar-voltage', label: 'Solar Voltage', type: 'gauge', source: 'solar' }
        );
      }
    }

    // Plumbing signals
    if (schema.plumbing?.enabled) {
      schema.plumbing.tanks.forEach((tank, idx) => {
        signals.push({
          id: `tank-${idx}-level`,
          label: `${tank.name || tank.type} Tank Level`,
          type: 'gauge',
          source: 'plumbing',
        });
      });
    }

    // HVAC signals
    if (schema.hvac?.heating?.enabled || schema.hvac?.cooling?.enabled) {
      signals.push({
        id: 'interior-temp',
        label: 'Interior Temperature',
        type: 'gauge',
        source: 'hvac',
      });
    }

    return signals;
  }, [schema]);

  if (!schema.hardware || schema.hardware.outputs.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>Component Palette</h3>
        </div>
        <div className={styles.empty}>
          <p>Configure hardware channels first</p>
          <small>Go to Hardware tab to set up output channels</small>
        </div>
      </div>
    );
  }

  const currentComponents =
    selectedCategory === 'switching' ? switchingComponents : signalValueComponents;

  // Determine if components should be disabled based on filter
  // filterType === null means no filtering (show all)
  // filterType === 'image' means image section (no components)
  // filterType === 'switching' or 'signal-values' means only that type
  const isDisabled =
    filterType === 'image' || (filterType !== null && filterType !== selectedCategory);
  const showFilterMessage = filterType !== null && filterType !== 'image';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Component Palette</h3>
        <div className={styles.count}>{currentComponents.length}</div>
      </div>

      {showFilterMessage && (
        <div className={styles.filterMessage}>
          {filterType === selectedCategory ? (
            <span className={styles.filterActive}>
              ✓ Showing {filterType === 'switching' ? 'Switching' : 'Signal Values'} components
            </span>
          ) : (
            <span className={styles.filterInactive}>
              ⚠ Switch to {filterType === 'switching' ? 'Switching' : 'Signal Values'} tab to add
              components
            </span>
          )}
        </div>
      )}

      {filterType === 'image' && (
        <div className={styles.filterMessage}>
          <span className={styles.filterInactive}>
            🖼️ Image sections don't use components - upload an image instead
          </span>
        </div>
      )}

      <div className={styles.helpText}>
        {filterType === null
          ? 'Click or drag to add (reusable)'
          : filterType === 'image'
            ? 'Upload an image for this section'
            : `Add ${filterType === 'switching' ? 'switching' : 'signal value'} components`}
      </div>

      {/* Category Tabs */}
      {filterType !== 'image' && (
        <div className={styles.categoryTabs}>
          <button
            className={`${styles.categoryTab} ${
              selectedCategory === 'switching' ? styles.active : ''
            } ${filterType !== null && filterType !== 'switching' ? styles.disabled : ''}`}
            onClick={() => setSelectedCategory('switching')}
            disabled={filterType !== null && filterType !== 'switching'}
            title={
              filterType === 'signal-values'
                ? 'Current section only accepts Signal Values'
                : 'Switching components: toggles, buttons, dimmers'
            }
          >
            🔘 Switching
          </button>
          <button
            className={`${styles.categoryTab} ${
              selectedCategory === 'signal-values' ? styles.active : ''
            } ${filterType !== null && filterType !== 'signal-values' ? styles.disabled : ''}`}
            onClick={() => setSelectedCategory('signal-values')}
            disabled={filterType !== null && filterType !== 'signal-values'}
            title={
              filterType === 'switching'
                ? 'Current section only accepts Switching components'
                : 'Signal Values: gauges, indicators, readings'
            }
          >
            📊 Signal Values
          </button>
        </div>
      )}

      <div className={styles.palette}>
        {selectedCategory === 'switching' &&
          switchingComponents.map((channel) => {
            const mapping = CONTROL_COMPONENT_MAP[channel.control];
            if (!mapping) return null;

            const componentType = mapping.component;
            const icon = getIconForType(componentType);

            return (
              <div
                key={channel.id}
                className={`${styles.paletteItem} ${isDisabled ? styles.disabled : ''}`}
                draggable={!isDisabled}
                onDragStart={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                    return;
                  }
                  e.dataTransfer.effectAllowed = 'copy';
                  e.dataTransfer.setData(
                    'application/json',
                    JSON.stringify({
                      channelId: channel.id,
                      componentType: 'switching',
                    })
                  );
                }}
                onClick={() => {
                  if (!isDisabled) {
                    onAddComponent(channel.id, 'switching');
                  }
                }}
                title={
                  isDisabled
                    ? 'Select a switching section to add this component'
                    : `Drag to section or click to add ${componentType} for ${channel.label || channel.id}`
                }
              >
                <div className={styles.itemIcon}>{icon}</div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemLabel}>{channel.label || channel.id}</div>
                  <div className={styles.itemType}>{componentType}</div>
                  <div className={styles.itemChannel}>
                    {channel.source.toUpperCase()} #{channel.channel}
                  </div>
                </div>
              </div>
            );
          })}

        {selectedCategory === 'signal-values' &&
          signalValueComponents.map((signal) => {
            const icon = getIconForType(signal.type);

            return (
              <div
                key={signal.id}
                className={`${styles.paletteItem} ${isDisabled ? styles.disabled : ''}`}
                draggable={!isDisabled}
                onDragStart={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                    return;
                  }
                  e.dataTransfer.effectAllowed = 'copy';
                  e.dataTransfer.setData(
                    'application/json',
                    JSON.stringify({
                      channelId: signal.id,
                      componentType: 'signal-value',
                    })
                  );
                }}
                onClick={() => {
                  if (!isDisabled) {
                    onAddComponent(signal.id, 'signal-value');
                  }
                }}
                title={
                  isDisabled
                    ? 'Select a signal values section to add this component'
                    : `Drag to section or click to add ${signal.type} for ${signal.label}`
                }
              >
                <div className={styles.itemIcon}>{icon}</div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemLabel}>{signal.label}</div>
                  <div className={styles.itemType}>{signal.type}</div>
                  <div className={styles.itemChannel}>{signal.source.toUpperCase()}</div>
                </div>
              </div>
            );
          })}

        {currentComponents.length === 0 && (
          <div className={styles.emptyCategory}>
            <p>No {selectedCategory === 'switching' ? 'switching' : 'signal value'} components</p>
            <small>
              {selectedCategory === 'switching'
                ? 'Configure hardware channels'
                : 'Enable power, plumbing, or HVAC systems'}
            </small>
          </div>
        )}
      </div>
    </div>
  );
}

function getIconForType(type: string): string {
  const icons: Record<string, string> = {
    toggle: '🔘',
    button: '🔳',
    dimmer: '🎚️',
    gauge: '📊',
    indicator: '💡',
    slider: '🎛️',
  };
  return icons[type] || '❓';
}
