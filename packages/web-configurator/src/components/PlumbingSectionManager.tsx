import type { UISchema, Component } from '@gcg/schema';
import styles from './PlumbingSectionManager.module.css';

interface PlumbingSectionManagerProps {
  schema: UISchema;
  selectedTabId: string;
  onUpdate: (schema: UISchema) => void;
  onAddComponent: (channelId: string, componentType?: string, targetSectionId?: string) => void;
  onDeleteComponent: (tabId: string, sectionId: string, componentId: string) => void;
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
}

export default function PlumbingSectionManager({
  schema,
  selectedTabId,
  onUpdate,
  onAddComponent,
  onDeleteComponent,
  selectedSectionId,
  onSelectSection,
}: PlumbingSectionManagerProps) {
  const currentTab = schema.tabs.find((tab) => tab.id === selectedTabId);

  if (!currentTab) {
    return (
      <div className={styles.error}>
        <p>Tab not found</p>
      </div>
    );
  }

  // Get plumbing configuration from schema
  const plumbingConfig = schema.plumbingTab || {
    switchingSection: {
      enabled: false,
      title: 'Plumbing Controls',
    },
  };

  // Get plumbing system config for tank info
  const plumbing = schema.plumbing || {
    enabled: true,
    monitoringSource: 'cerbo-gx' as const,
    count: 3,
    tanks: [
      { type: 'fresh' as const, name: '' },
      { type: 'waste' as const, name: '' },
      { type: 'black' as const, name: '' },
    ],
  };

  // Get sections from the tab
  const switchingSection = currentTab.sections[0]; // First section is configurable switching
  // Remaining sections are auto-generated tank gauges

  // Update plumbing tab configuration
  const updatePlumbingConfig = (updates: Partial<typeof plumbingConfig>) => {
    onUpdate({
      ...schema,
      plumbingTab: {
        ...plumbingConfig,
        ...updates,
      },
    });
  };

  const updateSwitchingSection = (updates: Partial<typeof plumbingConfig.switchingSection>) => {
    updatePlumbingConfig({
      switchingSection: {
        ...plumbingConfig.switchingSection,
        ...updates,
      },
    });
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    // Only allow drops on switching section
    if (sectionId === switchingSection?.id) {
      e.preventDefault();
      if (styles.dragOver) {
        e.currentTarget.classList.add(styles.dragOver);
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (styles.dragOver) {
      e.currentTarget.classList.remove(styles.dragOver);
    }
  };

  const handleDrop = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    if (styles.dragOver) {
      e.currentTarget.classList.remove(styles.dragOver);
    }

    // Only allow drops on switching section
    if (sectionId !== switchingSection?.id) return;

    const componentData = e.dataTransfer.getData('application/json');
    if (!componentData) return;

    try {
      const data = JSON.parse(componentData);
      onAddComponent(data.channelId, data.componentType, sectionId);
      onSelectSection(sectionId);
    } catch (error) {
      console.error('Failed to parse component data:', error);
    }
  };

  const handleDeleteComponentClick = (sectionId: string, componentId: string) => {
    onDeleteComponent(selectedTabId, sectionId, componentId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>💧 Plumbing Tab Configuration</h3>
        <p className={styles.subtitle}>
          Configure switching controls and view auto-generated tank gauges
        </p>
      </div>

      {/* Configurable Switching Section */}
      {switchingSection && (
        <div className={styles.sectionGroup}>
          <div className={styles.groupHeader}>
            <h4>📝 Configurable Section</h4>
            <p className={styles.groupDescription}>
              Optional switching section for plumbing-related controls (pumps, valves, etc.)
            </p>
          </div>

          <div
            className={`${styles.sectionBlock} ${
              selectedSectionId === switchingSection.id ? styles.selected : ''
            }${plumbingConfig.switchingSection.enabled ? '' : ` ${styles.disabled}`}`}
            onClick={() => onSelectSection(switchingSection.id)}
            onDragOver={(e) => handleDragOver(e, switchingSection.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, switchingSection.id)}
          >
            <div className={styles.sectionHeader}>
              <div className={styles.headerLeft}>
                <h4>
                  {plumbingConfig.switchingSection.title}
                  {selectedSectionId === switchingSection.id && (
                    <span className={styles.selectedBadge}>SELECTED</span>
                  )}
                </h4>
                <label className={styles.toggleSwitch} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={plumbingConfig.switchingSection.enabled}
                    onChange={(e) => updateSwitchingSection({ enabled: e.target.checked })}
                  />
                  <span className={styles.slider}></span>
                  <span className={styles.toggleLabel}>
                    {plumbingConfig.switchingSection.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>
            </div>

            {plumbingConfig.switchingSection.enabled && (
              <div className={styles.componentList}>
                {switchingSection.components.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>Drag switching components from the palette to add them here</p>
                    <p className={styles.hint}>💡 Add pump controls, valve switches, etc.</p>
                  </div>
                ) : (
                  <div className={styles.components}>
                    {switchingSection.components.map((component: Component) => (
                      <div key={component.id} className={styles.componentItem}>
                        <span className={styles.componentIcon}>{component.icon}</span>
                        <span className={styles.componentLabel}>{component.label}</span>
                        <button
                          className={styles.deleteButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteComponentClick(switchingSection.id, component.id);
                          }}
                          title="Delete component"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auto-Generated Tank Gauge Sections */}
      <div className={styles.sectionGroup}>
        <div className={styles.groupHeader}>
          <h4>🤖 Auto-Generated Tank Gauges</h4>
          <p className={styles.groupDescription}>
            These sections are automatically created based on your{' '}
            <strong>Plumbing Configuration</strong>
          </p>
        </div>

        <div className={styles.autoGeneratedInfo}>
          <div className={styles.infoIcon}>ℹ️</div>
          <div className={styles.infoContent}>
            <p>
              <strong>Auto-Generated Content</strong>
            </p>
            <p>
              Tank gauge sections are created automatically based on the tanks configured in the
              Plumbing Config page. Gauges cannot be added or removed manually.
            </p>
          </div>
        </div>

        {/* Render tank sections */}
        {plumbing.enabled &&
          plumbing.tanks.map((tank, index) => {
            const tankSection = currentTab.sections[index + 1]; // +1 because first section is switching
            if (!tankSection) return null;

            const tankTypeIcons: Record<string, string> = {
              fresh: '💧',
              waste: '🚰',
              black: '🚽',
            };

            const tankTypeLabels: Record<string, string> = {
              fresh: 'Fresh Water',
              waste: 'Gray Water',
              black: 'Black Water',
            };

            return (
              <div key={tankSection.id} className={styles.autoSection}>
                <div className={styles.autoSectionHeader}>
                  <h4>
                    {tankTypeIcons[tank.type]} {tank.name || tankTypeLabels[tank.type]}
                    <span className={styles.autoTag}>AUTO</span>
                  </h4>
                </div>

                <div className={styles.componentList}>
                  {tankSection.components.length === 0 ? (
                    <div className={styles.autoEmptyState}>
                      <p>No tank gauge generated yet</p>
                    </div>
                  ) : (
                    <div className={styles.components}>
                      {tankSection.components.map((component: Component) => (
                        <div key={component.id} className={styles.autoComponentItem}>
                          <span className={styles.componentIcon}>{component.icon}</span>
                          <span className={styles.componentLabel}>{component.label}</span>
                          <span className={styles.lockIcon}>🔒</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        {/* Message when plumbing disabled */}
        {!plumbing.enabled && (
          <div className={styles.noTanksMessage}>
            <p>
              <strong>Plumbing system disabled</strong>
            </p>
            <p>
              Enable plumbing in the <strong>Plumbing Config</strong> page to automatically generate
              tank gauge sections here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
