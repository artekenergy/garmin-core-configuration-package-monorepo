import { useState } from 'react';
import { debug } from '../utils/debug';
import type { UISchema } from '@gcg/schema';
import styles from './LightingSectionManager.module.css';

interface LightingSectionManagerProps {
  schema: UISchema;
  selectedTabId: string;
  onUpdate: (schema: UISchema) => void;
  onAddComponent: (channelId: string, componentType?: string, targetSectionId?: string) => void;
  onDeleteComponent?: (sectionId: string, componentId: string) => void;
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
}

export default function LightingSectionManager({
  schema,
  selectedTabId,
  onUpdate,
  onAddComponent,
  onDeleteComponent,
  selectedSectionId,
  onSelectSection,
}: LightingSectionManagerProps) {
  const selectedTab = schema.tabs.find((tab) => tab.id === selectedTabId);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);

  if (!selectedTab) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>⚠️ Lighting tab not found</p>
        </div>
      </div>
    );
  }

  const lightingTabConfig = schema.lightingTab || {
    interior: { enabled: true, title: 'Interior', icon: '💡' },
    exterior: { enabled: true, title: 'Exterior', icon: '🌟' },
    rgb: { enabled: false, title: 'RGB', icon: '🌈' },
  };

  const updateSection = (
    sectionKey: 'interior' | 'exterior' | 'rgb',
    updates: Partial<{ enabled: boolean; title: string; icon: string }>
  ) => {
    const currentSection = lightingTabConfig[sectionKey];
    const newLightingTab = {
      ...lightingTabConfig,
      [sectionKey]: {
        enabled: updates.enabled ?? currentSection?.enabled ?? true,
        title: updates.title ?? (currentSection?.title || 'Section'),
        icon: updates.icon ?? currentSection?.icon,
      },
    };

    // Also update the actual tab section title if title changed
    const sectionIndexMap: { [key: string]: number } = {
      interior: 0,
      exterior: 1,
      rgb: 2,
    };
    const sectionIndex = sectionIndexMap[sectionKey];
    const updatedTabs = schema.tabs.map((tab) =>
      tab.id === selectedTabId
        ? {
            ...tab,
            sections: tab.sections.map((section, idx) =>
              idx === sectionIndex
                ? { ...section, title: newLightingTab[sectionKey].title }
                : section
            ),
          }
        : tab
    );

    onUpdate({
      ...schema,
      lightingTab: newLightingTab,
      tabs: updatedTabs,
    });
  };

  const toggleSectionEnabled = (sectionKey: 'interior' | 'exterior' | 'rgb') => {
    const currentSection = lightingTabConfig[sectionKey];
    updateSection(sectionKey, { enabled: !currentSection?.enabled });
  };

  const handleDrop = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSection(null);

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.channelId && data.componentType) {
        onAddComponent(data.channelId, data.componentType, sectionId);
      }
    } catch (error) {
      debug.error('Failed to parse drop data:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverSection(sectionId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setDragOverSection(null);
    }
  };

  const renderSectionConfig = (sectionKey: 'interior' | 'exterior' | 'rgb', sectionNum: number) => {
    const section = lightingTabConfig[sectionKey];
    const tabSection = selectedTab?.sections?.[sectionNum - 1];
    const isEnabled = section?.enabled ?? true;
    const sectionId = tabSection?.id || `section-lighting-${sectionKey}`;
    const isDragOver = dragOverSection === sectionId;
    const isSelected = selectedSectionId === sectionId;

    const sectionIconMap = {
      interior: section?.icon || '💡',
      exterior: section?.icon || '🌟',
      rgb: section?.icon || '�',
    };
    const sectionIcon = sectionIconMap[sectionKey];

    const sectionDescriptionMap = {
      interior: 'Control interior lighting zones and dimmers',
      exterior: 'Control exterior and accent lighting',
      rgb: 'Control RGB and color lighting modules',
    };
    const sectionDescription = sectionDescriptionMap[sectionKey];

    return (
      <div
        className={`${styles.sectionBlock} ${!isEnabled ? styles.disabled : ''} ${isDragOver ? styles.dragOver : ''} ${isSelected ? styles.selected : ''}`}
        key={sectionKey}
        onClick={() => onSelectSection(sectionId)}
        onDrop={(e) => handleDrop(e, sectionId)}
        onDragOver={(e) => handleDragOver(e, sectionId)}
        onDragLeave={handleDragLeave}
      >
        <div className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <h4>
              {sectionIcon} {sectionKey === 'interior' ? 'Interior Lights' : 'Exterior Lights'}
              {isSelected && <span className={styles.selectedBadge}>Selected</span>}
            </h4>
            <label className={styles.toggleSwitch} onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={() => toggleSectionEnabled(sectionKey)}
              />
              <span className={styles.toggleSlider}></span>
              <span className={styles.toggleLabel}>{isEnabled ? 'Enabled' : 'Disabled'}</span>
            </label>
          </div>
        </div>

        {isEnabled && (
          <>
            <div className={styles.description}>
              <p>{sectionDescription}</p>
            </div>

            <div className={styles.titleInput} onClick={(e) => e.stopPropagation()}>
              <label>Section Title:</label>
              <input
                type="text"
                value={section?.title || ''}
                onChange={(e) => updateSection(sectionKey, { title: e.target.value })}
                placeholder="Section title"
                maxLength={30}
              />
            </div>

            {/* Component List */}
            <div className={styles.componentList}>
              <div className={styles.componentListHeader}>
                <strong>Components in this section:</strong>
                <span className={styles.componentCount}>{tabSection?.components?.length || 0}</span>
              </div>
              {tabSection?.components && tabSection.components.length > 0 ? (
                <div className={styles.components}>
                  {tabSection.components.map((comp) => (
                    <div key={comp.id} className={styles.componentItem}>
                      <span className={styles.componentIcon}>
                        {comp.type === 'toggle'
                          ? '🔘'
                          : comp.type === 'button'
                            ? '🔳'
                            : comp.type === 'dimmer'
                              ? '🎚️'
                              : '⚙️'}
                      </span>
                      <span className={styles.componentLabel}>{comp.label}</span>
                      <span className={styles.componentType}>{comp.type}</span>
                      {onDeleteComponent && (
                        <button
                          className={styles.deleteButton}
                          onClick={() => onDeleteComponent(sectionId, comp.id)}
                          title="Delete component"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyComponents}>
                  <p>No components added yet</p>
                  <small>Add lighting controls from the Component Palette</small>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>💡 Lighting Tab Subtabs</h3>
        <p className={styles.subtitle}>
          Configure interior, exterior, and RGB lighting subtabs. Each subtab can be enabled or
          disabled independently.
        </p>
      </div>

      {renderSectionConfig('interior', 1)}
      {renderSectionConfig('exterior', 2)}
      {renderSectionConfig('rgb', 3)}

      <div className={styles.infoBox}>
        <strong>💡 Tip:</strong> Click a subtab to select it, then add lighting controls from the
        Component Palette. Use the toggles to enable/disable subtabs. RGB subtab appears when RGB
        modules are enabled.
      </div>
    </div>
  );
}
