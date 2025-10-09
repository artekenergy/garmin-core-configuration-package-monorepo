import type { UISchema, Component } from '@gcg/schema';
import styles from './SwitchingSectionManager.module.css';

interface SwitchingSectionManagerProps {
  schema: UISchema;
  selectedTabId: string;
  onUpdate: (schema: UISchema) => void;
  onAddComponent: (channelId: string, componentType?: string, targetSectionId?: string) => void;
  onDeleteComponent: (tabId: string, sectionId: string, componentId: string) => void;
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
}

export default function SwitchingSectionManager({
  schema,
  selectedTabId,
  onUpdate,
  onAddComponent,
  onDeleteComponent,
  selectedSectionId,
  onSelectSection,
}: SwitchingSectionManagerProps) {
  const currentTab = schema.tabs.find((tab) => tab.id === selectedTabId);

  if (!currentTab) {
    return (
      <div className={styles.error}>
        <p>Tab not found</p>
      </div>
    );
  }

  // Get switching configuration from schema
  const switchingConfig = schema.switchingTab || {
    customSection: {
      enabled: true,
      title: 'Custom Controls',
    },
    switches: {
      enabled: true,
      title: 'Switches',
    },
    accessories: {
      enabled: true,
      title: 'Accessories',
    },
  };

  // Get sections from the tab
  const customSection = currentTab.sections[0]; // First section is configurable
  const keypadSection = currentTab.sections[1]; // Auto-generated
  const awningSection = currentTab.sections[2]; // Auto-generated
  const slidesSection = currentTab.sections[3]; // Auto-generated

  // Get accessories config to show/hide auto-generated sections
  const accessories = schema.accessories || {
    keypad: { enabled: false, count: 1, buttonsPerKeypad: 8 },
    awning: { enabled: false, light: false, controlType: 'rvc' as const },
    slides: { enabled: false, controlType: 'rvc' as const, keypadSecured: false },
  };

  // Update switching configuration
  const updateSwitchingConfig = (updates: Partial<typeof switchingConfig>) => {
    onUpdate({
      ...schema,
      switchingTab: {
        ...switchingConfig,
        ...updates,
      },
    });
  };

  const updateCustomSection = (updates: Partial<typeof switchingConfig.customSection>) => {
    if (!switchingConfig.customSection) return;
    
    updateSwitchingConfig({
      customSection: {
        ...switchingConfig.customSection,
        ...updates,
      },
    });
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    // Only allow drops on custom section
    if (sectionId === customSection?.id) {
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

    // Only allow drops on custom section
    if (sectionId !== customSection?.id) return;

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
        <h3>⚡ Switching Tab Configuration</h3>
        <p className={styles.subtitle}>
          Configure your custom switching section and view auto-generated accessory controls
        </p>
      </div>

      {/* Custom Configurable Section */}
      {customSection && switchingConfig.customSection && (
        <div className={styles.sectionGroup}>
          <div className={styles.groupHeader}>
            <h4>📝 Configurable Section</h4>
            <p className={styles.groupDescription}>
              Manually add switching and signal components to this section
            </p>
          </div>

          <div
            className={`${styles.sectionBlock} ${
              selectedSectionId === customSection.id ? styles.selected : ''
            }${switchingConfig.customSection.enabled ? '' : ` ${styles.disabled}`}`}
            onClick={() => onSelectSection(customSection.id)}
            onDragOver={(e) => handleDragOver(e, customSection.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, customSection.id)}
          >
            <div className={styles.sectionHeader}>
              <div className={styles.headerLeft}>
                <h4>
                  {switchingConfig.customSection.title}
                  {selectedSectionId === customSection.id && (
                    <span className={styles.selectedBadge}>SELECTED</span>
                  )}
                </h4>
                <label className={styles.toggleSwitch} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={switchingConfig.customSection.enabled}
                    onChange={(e) => updateCustomSection({ enabled: e.target.checked })}
                  />
                  <span className={styles.slider}></span>
                  <span className={styles.toggleLabel}>
                    {switchingConfig.customSection.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>
            </div>

            {switchingConfig.customSection.enabled && (
              <div className={styles.componentList}>
                {customSection.components.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>Drag components from the palette to add them here</p>
                    <p className={styles.hint}>
                      💡 This section supports both switching and signal components
                    </p>
                  </div>
                ) : (
                  <div className={styles.components}>
                    {customSection.components.map((component: Component) => (
                      <div key={component.id} className={styles.componentItem}>
                        <span className={styles.componentIcon}>{component.icon}</span>
                        <span className={styles.componentLabel}>{component.label}</span>
                        <button
                          className={styles.deleteButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteComponentClick(customSection.id, component.id);
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

      {/* Auto-Generated Sections */}
      <div className={styles.sectionGroup}>
        <div className={styles.groupHeader}>
          <h4>🤖 Auto-Generated Sections</h4>
          <p className={styles.groupDescription}>
            These sections are automatically created based on your{' '}
            <strong>Accessories Configuration</strong>
          </p>
        </div>

        <div className={styles.autoGeneratedInfo}>
          <div className={styles.infoIcon}>ℹ️</div>
          <div className={styles.infoContent}>
            <p>
              <strong>Auto-Generated Content</strong>
            </p>
            <p>
              The following sections are created automatically when you enable accessories in the
              Accessories Config page. Components cannot be added or removed manually.
            </p>
          </div>
        </div>

        {/* Keypad Section */}
        {accessories.keypad.enabled && keypadSection && (
          <div className={styles.autoSection}>
            <div className={styles.autoSectionHeader}>
              <h4>
                🎹 {keypadSection.title}
                <span className={styles.autoTag}>AUTO</span>
              </h4>
            </div>

            <div className={styles.componentList}>
              {keypadSection.components.length === 0 ? (
                <div className={styles.autoEmptyState}>
                  <p>No keypad components generated yet</p>
                </div>
              ) : (
                <div className={styles.components}>
                  {keypadSection.components.map((component: Component) => (
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
        )}

        {/* Awning Section */}
        {accessories.awning.enabled && awningSection && (
          <div className={styles.autoSection}>
            <div className={styles.autoSectionHeader}>
              <h4>
                ☂️ {awningSection.title}
                <span className={styles.autoTag}>AUTO</span>
              </h4>
            </div>

            <div className={styles.componentList}>
              {awningSection.components.length === 0 ? (
                <div className={styles.autoEmptyState}>
                  <p>No awning components generated yet</p>
                </div>
              ) : (
                <div className={styles.components}>
                  {awningSection.components.map((component: Component) => (
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
        )}

        {/* Slides Section */}
        {accessories.slides.enabled && slidesSection && (
          <div className={styles.autoSection}>
            <div className={styles.autoSectionHeader}>
              <h4>
                📐 {slidesSection.title}
                <span className={styles.autoTag}>AUTO</span>
              </h4>
            </div>

            <div className={styles.componentList}>
              {slidesSection.components.length === 0 ? (
                <div className={styles.autoEmptyState}>
                  <p>No slide-out components generated yet</p>
                </div>
              ) : (
                <div className={styles.components}>
                  {slidesSection.components.map((component: Component) => (
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
        )}

        {/* Message when no accessories enabled */}
        {!accessories.keypad.enabled &&
          !accessories.awning.enabled &&
          !accessories.slides.enabled && (
            <div className={styles.noAccessoriesMessage}>
              <p>
                <strong>No accessories enabled</strong>
              </p>
              <p>
                Enable accessories in the <strong>Accessories Config</strong> page to automatically
                generate sections here.
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
