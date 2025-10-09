import { useSchema } from '../context/SchemaContext';
import styles from './HomeConfigPage.module.css';

type HomeSectionType = 'switching' | 'signal-values' | 'image' | 'mixed';

export default function HomeConfigPage() {
  const { schema, updateSchema } = useSchema();

  if (!schema) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No schema loaded</div>
      </div>
    );
  }

  // Get home tab and its sections
  const homeTab = schema.tabs.find((t) => t.preset === 'home' || t.id === 'tab-home');
  if (!homeTab) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>Home tab not found</div>
      </div>
    );
  }

  const updateSection = (sectionIndex: number, type: HomeSectionType, title?: string) => {
    const updatedTabs = schema.tabs.map((tab) =>
      tab.id === homeTab.id
        ? {
            ...tab,
            sections: tab.sections.map((section, idx) =>
              idx === sectionIndex ? { ...section, type, title: title || section.title } : section
            ),
          }
        : tab
    );

    updateSchema({
      ...schema,
      tabs: updatedTabs,
    });
  };

  const getSectionIcon = (type: HomeSectionType | undefined): string => {
    switch (type) {
      case 'switching':
        return '🔘';
      case 'signal-values':
        return '📊';
      case 'image':
        return '🖼️';
      case 'mixed':
        return '🎨';
      default:
        return '⚙️';
    }
  };

  const getSectionDescription = (type: HomeSectionType): string => {
    switch (type) {
      case 'switching':
        return 'Display toggles and buttons for quick access to frequently used controls';
      case 'signal-values':
        return 'Show real-time signal values like battery voltage, tank levels, and temperatures';
      case 'image':
        return 'Display a custom image such as a floor plan or system diagram';
      case 'mixed':
        return 'Mix of switching and signal-values components';
      default:
        return 'Unknown section type';
    }
  };

  const renderSectionConfig = (sectionIndex: number, sectionNum: number) => {
    const section = homeTab.sections?.[sectionIndex];
    if (!section) return null;

    const sectionType = section.type || 'switching';

    return (
      <section className={styles.section} key={section.id}>
        <div className={styles.sectionHeader}>
          <h3>Section {sectionNum}</h3>
        </div>

        <div className={styles.sectionTypeGrid}>
          <button
            className={`${styles.typeCard} ${sectionType === 'switching' ? styles.selected : ''}`}
            onClick={() => updateSection(sectionIndex, 'switching')}
          >
            <div className={styles.typeIcon}>{getSectionIcon('switching')}</div>
            <div className={styles.typeLabel}>Switching</div>
            <div className={styles.typeDescription}>{getSectionDescription('switching')}</div>
          </button>

          <button
            className={`${styles.typeCard} ${sectionType === 'signal-values' ? styles.selected : ''}`}
            onClick={() => updateSection(sectionIndex, 'signal-values')}
          >
            <div className={styles.typeIcon}>{getSectionIcon('signal-values')}</div>
            <div className={styles.typeLabel}>Signal Values</div>
            <div className={styles.typeDescription}>{getSectionDescription('signal-values')}</div>
          </button>

          <button
            className={`${styles.typeCard} ${sectionType === 'image' ? styles.selected : ''}`}
            onClick={() => updateSection(sectionIndex, 'image')}
          >
            <div className={styles.typeIcon}>{getSectionIcon('image')}</div>
            <div className={styles.typeLabel}>Image</div>
            <div className={styles.typeDescription}>{getSectionDescription('image')}</div>
          </button>
        </div>
      </section>
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>🏠 Home Tab Configuration</h2>
        <p className={styles.subtitle}>
          Configure the two sections that will appear on your Home screen
        </p>
      </header>

      <div className={styles.content}>
        {renderSectionConfig(0, 1)}
        {renderSectionConfig(1, 2)}

        {/* Configuration Summary */}
        <section className={styles.summarySection}>
          <h3>📋 Configuration Summary</h3>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Section 1</div>
              <div className={styles.summaryValue}>
                {getSectionIcon(homeTab.sections?.[0]?.type)} {homeTab.sections?.[0]?.title} (
                {homeTab.sections?.[0]?.type === 'switching'
                  ? 'Switching'
                  : homeTab.sections?.[0]?.type === 'signal-values'
                    ? 'Signal Values'
                    : 'Image'}
                )
              </div>
            </div>

            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Section 2</div>
              <div className={styles.summaryValue}>
                {getSectionIcon(homeTab.sections?.[1]?.type)} {homeTab.sections?.[1]?.title} (
                {homeTab.sections?.[1]?.type === 'switching'
                  ? 'Switching'
                  : homeTab.sections?.[1]?.type === 'signal-values'
                    ? 'Signal Values'
                    : 'Image'}
                )
              </div>
            </div>
          </div>

          <div className={styles.infoBox}>
            <strong>ℹ️ Note:</strong> These sections will be automatically populated based on your
            configuration when you use the "Regenerate Content" feature in the Editor.
          </div>
        </section>
      </div>
    </div>
  );
}
