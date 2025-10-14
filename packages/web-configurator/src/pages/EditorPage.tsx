import { useState, useEffect, useRef } from 'react';
import { useSchema } from '../context/SchemaContext';
import TabManager from '../components/TabManager';
import SectionManager from '../components/SectionManager';
import HomeSectionManager from '../components/HomeSectionManager';
import LightingSectionManager from '../components/LightingSectionManager';
import SwitchingSectionManager from '../components/SwitchingSectionManager';
import PlumbingSectionManager from '../components/PlumbingSectionManager';
import ReadOnlySectionView from '../components/ReadOnlySectionView';
import ComponentPalette from '../components/ComponentPalette';
import type { Component } from '@gcg/schema';
import { CONTROL_COMPONENT_MAP } from '../constants/hardware';
import { regenerateTabContent } from '../utils/tabGenerator';
import { debug } from '../utils/debug';
import styles from './EditorPage.module.css';

export default function EditorPage() {
  const { schema, updateSchema } = useSchema();
  const [selectedTabId, setSelectedTabId] = useState<string | null>(schema?.tabs[0]?.id || null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const hasRegeneratedRef = useRef(false);

  // Automatically regenerate content when navigating to Editor page
  useEffect(() => {
    if (schema && !hasRegeneratedRef.current) {
      hasRegeneratedRef.current = true;
      const updatedSchema = regenerateTabContent(schema);
      updateSchema(updatedSchema);
    }
  }, [schema, updateSchema]);

  if (!schema) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <h2>No Schema Loaded</h2>
          <p>Create a new schema or load an existing one.</p>
        </div>
      </div>
    );
  }

  // Get the current section's type for filtering component palette
  const getCurrentSectionType = (): 'switching' | 'signal-values' | 'image' | 'mixed' | null => {
    if (!selectedTabId || !selectedSectionId) return null;

    // For Home tab, check section's type property
    if (selectedTabId === 'tab-home') {
      const currentTab = schema.tabs.find((t) => t.id === selectedTabId);
      const section = currentTab?.sections.find((s) => s.id === selectedSectionId);

      debug.log('[DEBUG] Home tab section matching:', {
        sectionId: section?.id,
        selectedSectionId,
        sectionType: section?.type,
      });

      // Return the section's type property (or null if not set)
      const type = section?.type || null;
      debug.log('[DEBUG] Section selected, returning type:', type);
      return type;
    }

    // For Lighting tab, both sections support switching components (dimmers, toggles, etc.)
    if (selectedTabId === 'tab-lighting') {
      // Both interior and exterior sections accept switching components
      return 'switching';
    }

    // For Switching tab, custom section supports both switching and signal-values
    if (selectedTabId === 'tab-switching') {
      const currentTab = schema.tabs.find((t) => t.id === selectedTabId);
      const customSection = currentTab?.sections[0];

      // Custom section (first section) can have both types
      if (customSection?.id === selectedSectionId) {
        return null; // null means show both types
      }
      // Auto-generated sections are read-only, no palette needed
      return null;
    }

    // For Plumbing tab, switching section only accepts switching components
    if (selectedTabId === 'tab-plumbing') {
      const currentTab = schema.tabs.find((t) => t.id === selectedTabId);
      const switchingSection = currentTab?.sections[0];

      // Switching section (first section) only accepts switching components
      if (switchingSection?.id === selectedSectionId) {
        return 'switching';
      }
      // Tank gauge sections are read-only, no palette needed
      return null;
    }

    // For regular tabs, all sections are switching by default
    return 'switching';
  };

  const currentSectionType = getCurrentSectionType();

  // Auto-select first section when tab changes
  const handleSelectTab = (tabId: string) => {
    setSelectedTabId(tabId);
    const tab = schema.tabs.find((t) => t.id === tabId);
    if (tab && tab.sections.length > 0) {
      setSelectedSectionId(tab.sections[0]!.id);
    }
  };

  // Handle adding a component from palette
  const handleAddComponent = (
    channelId: string,
    componentType?: string,
    targetSectionId?: string
  ) => {
    // Use targetSectionId if provided (from drag-drop), otherwise use selectedSectionId
    const sectionId = targetSectionId || selectedSectionId;

    if (!selectedTabId || !sectionId) {
      alert('Please select a section first');
      return;
    }

    let newComponent: Component;

    if (componentType === 'signal-value') {
      // Handle signal value components (gauges, indicators)
      const componentId = `comp-signal-${channelId}`;

      let label = channelId;
      let unit = '';
      let min = 0;
      let max = 100;

      // Configure based on signal type
      if (channelId.includes('voltage')) {
        label = channelId.includes('battery') ? 'Battery Voltage' : 'Solar Voltage';
        unit = 'V';
        min = 0;
        max = 16;
      } else if (channelId.includes('current')) {
        label = 'Battery Current';
        unit = 'A';
        min = -100;
        max = 100;
      } else if (channelId.includes('soc')) {
        label = 'State of Charge';
        unit = '%';
        min = 0;
        max = 100;
      } else if (channelId.includes('power')) {
        label = 'Solar Power';
        unit = 'W';
        min = 0;
        max = 1000;
      } else if (channelId.includes('tank')) {
        label = channelId.replace(/-/g, ' ').replace(/tank (\d+) level/, 'Tank $1 Level');
        unit = '%';
        min = 0;
        max = 100;
      } else if (channelId.includes('temp')) {
        label = 'Interior Temperature';
        unit = '°F';
        min = 40;
        max = 120;
      }

      newComponent = {
        id: componentId,
        type: 'gauge',
        label,
        min,
        max,
        unit,
        decimals: channelId.includes('voltage') || channelId.includes('current') ? 1 : 0,
        bindings: {
          value: {
            type: 'static',
            value: 0, // Default value, will be replaced at runtime
          },
        },
      };
    } else {
      // Handle switching components (toggle, button, dimmer)
      const channel = schema.hardware?.outputs.find((o) => o.id === channelId);
      if (!channel) return;

      const mapping = CONTROL_COMPONENT_MAP[channel.control];
      if (!mapping) return;

      const componentId = `comp-${channel.id}`;

      if (mapping.component === 'button') {
        newComponent = {
          id: componentId,
          type: 'button',
          variant: 'round',
          label: channel.label || `${channel.source} ${channel.channel}`,
          icon: channel.icon,
          action: mapping.action,
          bindings: {
            action: {
              type: 'empirbus',
              channel: channelId,
            },
          },
        };
      } else if (mapping.component === 'toggle') {
        newComponent = {
          id: componentId,
          type: 'toggle',
          variant: 'round',
          label: channel.label || `${channel.source} ${channel.channel}`,
          icon: channel.icon,
          bindings: {
            state: {
              type: 'empirbus',
              channel: channelId,
            },
          },
        };
      } else if (mapping.component === 'dimmer') {
        newComponent = {
          id: componentId,
          type: 'dimmer',
          label: channel.label || `${channel.source} ${channel.channel}`,
          icon: channel.icon,
          min: channel.range?.min ?? 0,
          max: channel.range?.max ?? 100,
          step: channel.range?.step ?? 1,
          bindings: {
            intensity: {
              type: 'empirbus',
              channel: channelId,
            },
          },
        };
      } else {
        return; // Unsupported type
      }
    }

    // Add component to target section
    const updatedTabs = schema.tabs.map((tab) =>
      tab.id === selectedTabId
        ? {
            ...tab,
            sections: tab.sections.map((section) =>
              section.id === sectionId
                ? { ...section, components: [...section.components, newComponent] }
                : section
            ),
          }
        : tab
    );

    updateSchema({ ...schema, tabs: updatedTabs });
  };

  // Handle deleting a component from a section
  const handleDeleteComponent = (sectionId: string, componentId: string) => {
    if (!confirm('Delete this component?')) return;

    const updatedTabs = schema.tabs.map((tab) =>
      tab.id === selectedTabId
        ? {
            ...tab,
            sections: tab.sections.map((section) =>
              section.id === sectionId
                ? {
                    ...section,
                    components: section.components.filter((c) => c.id !== componentId),
                  }
                : section
            ),
          }
        : tab
    );

    updateSchema({ ...schema, tabs: updatedTabs });
  };

  // Handle regenerating tab content based on configuration
  const handleRegenerateContent = () => {
    if (
      !confirm(
        'This will regenerate tab content based on your system configuration. Any manual components will be replaced. Continue?'
      )
    ) {
      return;
    }

    // Only regenerate content, preserve enabled state
    const updatedSchema = regenerateTabContent(schema);
    updateSchema(updatedSchema);

    alert('Tab content has been regenerated based on your system configuration!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>Schema Editor</h2>
          <p className={styles.subtitle}>
            Design your HMI interface with tabs, sections, and components
          </p>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.regenerateButton} onClick={handleRegenerateContent}>
            ⚡ Regenerate Content
          </button>
        </div>
      </div>

      <div className={styles.editorLayout}>
        {/* Left Sidebar - Tab Management */}
        <aside className={styles.leftSidebar}>
          <TabManager
            schema={schema}
            onUpdate={updateSchema}
            selectedTabId={selectedTabId}
            onSelectTab={handleSelectTab}
          />
        </aside>

        {/* Main Editor - Section Management */}
        <main className={styles.mainEditor}>
          {selectedTabId === 'tab-home' ? (
            <HomeSectionManager
              schema={schema}
              selectedTabId={selectedTabId}
              onUpdate={updateSchema}
              onAddComponent={handleAddComponent}
              onDeleteComponent={handleDeleteComponent}
              selectedSectionId={selectedSectionId}
              onSelectSection={setSelectedSectionId}
            />
          ) : selectedTabId === 'tab-lighting' ? (
            <LightingSectionManager
              schema={schema}
              selectedTabId={selectedTabId}
              onUpdate={updateSchema}
              onAddComponent={handleAddComponent}
              onDeleteComponent={handleDeleteComponent}
              selectedSectionId={selectedSectionId}
              onSelectSection={setSelectedSectionId}
            />
          ) : selectedTabId === 'tab-switching' ? (
            <SwitchingSectionManager
              schema={schema}
              selectedTabId={selectedTabId}
              onUpdate={updateSchema}
              onAddComponent={handleAddComponent}
              onDeleteComponent={handleDeleteComponent}
              selectedSectionId={selectedSectionId}
              onSelectSection={setSelectedSectionId}
            />
          ) : selectedTabId === 'tab-plumbing' ? (
            <PlumbingSectionManager
              schema={schema}
              selectedTabId={selectedTabId}
              onUpdate={updateSchema}
              onAddComponent={handleAddComponent}
              onDeleteComponent={handleDeleteComponent}
              selectedSectionId={selectedSectionId}
              onSelectSection={setSelectedSectionId}
            />
          ) : selectedTabId === 'tab-power' ? (
            <ReadOnlySectionView
              schema={schema}
              selectedTabId={selectedTabId}
              tabName="Power Management"
              description="This tab is auto-generated from your power system configuration. Modify the power configuration to update the content displayed here."
              icon="⚡"
            />
          ) : selectedTabId === 'tab-hvac' ? (
            <ReadOnlySectionView
              schema={schema}
              selectedTabId={selectedTabId}
              tabName="HVAC System"
              description="This tab is auto-generated from your HVAC system configuration. Modify the HVAC configuration to update the content displayed here."
              icon="❄️"
            />
          ) : (
            <SectionManager
              schema={schema}
              selectedTabId={selectedTabId}
              onUpdate={updateSchema}
              onSelectSection={setSelectedSectionId}
              selectedSectionId={selectedSectionId}
              onAddComponent={handleAddComponent}
            />
          )}
        </main>

        {/* Right Sidebar - Component Palette */}
        <aside className={styles.rightSidebar}>
          {/* Hide palette for read-only tabs (Power, HVAC) */}
          {selectedTabId !== 'tab-power' && selectedTabId !== 'tab-hvac' ? (
            <ComponentPalette
              schema={schema}
              onAddComponent={handleAddComponent}
              filterType={currentSectionType}
            />
          ) : (
            <div className={styles.readOnlyMessage}>
              <div className={styles.readOnlyIcon}>🔒</div>
              <h4>Read-Only Tab</h4>
              <p>
                This tab is automatically generated from your system configuration. Components
                cannot be added or removed directly.
              </p>
              <p>
                To modify this tab's content, update your system configuration or use the Regenerate
                button.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
