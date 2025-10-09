import type { UISchema } from '@gcg/schema';
import styles from './ReadOnlySectionView.module.css';

interface ReadOnlySectionViewProps {
  schema: UISchema;
  selectedTabId: string;
  tabName: string;
  description: string;
  icon: string;
}

export default function ReadOnlySectionView({
  schema,
  selectedTabId,
  tabName,
  description,
  icon,
}: ReadOnlySectionViewProps) {
  const selectedTab = schema.tabs.find((tab) => tab.id === selectedTabId);

  if (!selectedTab) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>⚠️ Tab not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>
          {icon} {tabName}
        </h3>
        <p className={styles.subtitle}>{description}</p>
      </div>

      <div className={styles.infoBox}>
        <div className={styles.infoIcon}>ℹ️</div>
        <div className={styles.infoContent}>
          <strong>Auto-Generated Content</strong>
          <p>
            This tab's sections and components are automatically generated based on your system
            configuration. To modify the content:
          </p>
          <ul>
            <li>Configure your system settings in the respective configuration pages</li>
            <li>Use the "⚡ Regenerate Content" button to update all tabs</li>
            <li>Toggle this tab on/off using the Tab Manager on the left</li>
            <li>Reorder tabs by dragging them in the Tab Manager</li>
          </ul>
        </div>
      </div>

      <div className={styles.sectionsPreview}>
        <h4>Current Sections ({selectedTab.sections.length})</h4>
        <div className={styles.sectionList}>
          {selectedTab.sections.map((section, index) => (
            <div key={section.id} className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionNumber}>{index + 1}</div>
                <div className={styles.sectionInfo}>
                  <h5>{section.title}</h5>
                  <p className={styles.componentCount}>
                    {section.components.length} component
                    {section.components.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              {section.components.length > 0 && (
                <div className={styles.componentPreview}>
                  {section.components.slice(0, 3).map((comp) => (
                    <div key={comp.id} className={styles.componentChip}>
                      <span className={styles.componentIcon}>
                        {comp.type === 'toggle'
                          ? '🔘'
                          : comp.type === 'button'
                            ? '🔳'
                            : comp.type === 'dimmer'
                              ? '🎚️'
                              : comp.type === 'gauge'
                                ? '📊'
                                : comp.type === 'indicator'
                                  ? '💡'
                                  : '⚙️'}
                      </span>
                      <span className={styles.componentName}>{comp.label}</span>
                    </div>
                  ))}
                  {section.components.length > 3 && (
                    <div className={styles.moreComponents}>
                      +{section.components.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.actionCard}>
          <div className={styles.actionIcon}>⚙️</div>
          <div className={styles.actionContent}>
            <h5>Configure System</h5>
            <p>
              Modify your {tabName.toLowerCase()} settings in the configuration pages to change what
              appears in this tab.
            </p>
          </div>
        </div>
        <div className={styles.actionCard}>
          <div className={styles.actionIcon}>⚡</div>
          <div className={styles.actionContent}>
            <h5>Regenerate Content</h5>
            <p>
              Use the "Regenerate Content" button at the top to refresh all tabs with the latest
              configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
