import { useState } from 'react';
import type { UISchema } from '@gcg/schema';
import styles from './HomeSectionManager.module.css';

type HomeSectionType = 'switching' | 'signal-values' | 'image' | 'mixed';

interface HomeSectionManagerProps {
  schema: UISchema;
  selectedTabId: string;
  onUpdate: (schema: UISchema) => void;
  onAddComponent: (channelId: string, componentType?: string, targetSectionId?: string) => void;
  onDeleteComponent?: (sectionId: string, componentId: string) => void;
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
}

export default function HomeSectionManager({
  schema,
  selectedTabId,
  onUpdate,
  onAddComponent,
  onDeleteComponent,
  selectedSectionId,
  onSelectSection,
}: HomeSectionManagerProps) {
  const selectedTab = schema.tabs.find((tab) => tab.id === selectedTabId);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);

  if (!selectedTab) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>⚠️ Home tab not found</p>
        </div>
      </div>
    );
  }

  const getSectionIcon = (type: HomeSectionType): string => {
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
        return 'Toggle switches and buttons for quick control';
      case 'signal-values':
        return 'Real-time values like voltage, levels, temps';
      case 'image':
        return 'Custom image like floor plan or diagram';
      case 'mixed':
        return 'Mix of switching and signal-values components';
      default:
        return 'Unknown section type';
    }
  };

  const updateSection = (
    sectionIndex: number,
    updates: Partial<{
      enabled: boolean;
      type: HomeSectionType;
      title: string;
      imageUrl: string | undefined;
    }>
  ) => {
    const updatedTabs = schema.tabs.map((tab) =>
      tab.id === selectedTabId
        ? {
            ...tab,
            sections: tab.sections.map((section, idx) =>
              idx === sectionIndex ? { ...section, ...updates } : section
            ),
          }
        : tab
    );

    onUpdate({
      ...schema,
      tabs: updatedTabs,
    });
  };

  const toggleSectionEnabled = (sectionIndex: number) => {
    const section = selectedTab.sections[sectionIndex];
    updateSection(sectionIndex, { enabled: !(section?.enabled ?? true) });
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
      console.error('Failed to parse drop data:', error);
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
    // Only clear if we're leaving the drop zone entirely
    if (e.currentTarget === e.target) {
      setDragOverSection(null);
    }
  };

  const renderSectionConfig = (sectionIndex: number, sectionNum: number) => {
    const section = selectedTab?.sections?.[sectionIndex];
    if (!section) return null;

    const isEnabled = section.enabled ?? true;
    const sectionType = section.type || 'switching';
    const sectionId = section.id;
    const isDragOver = dragOverSection === sectionId;
    const isSelected = selectedSectionId === sectionId;

    return (
      <div
        className={`${styles.sectionBlock} ${!isEnabled ? styles.disabled : ''} ${isDragOver ? styles.dragOver : ''} ${isSelected ? styles.selected : ''}`}
        key={sectionId}
        onClick={() => onSelectSection(sectionId)}
        onDrop={(e) => handleDrop(e, sectionId)}
        onDragOver={(e) => handleDragOver(e, sectionId)}
        onDragLeave={handleDragLeave}
      >
        <div className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <h4>
              Section {sectionNum}
              {isSelected && <span className={styles.selectedBadge}>Selected</span>}
            </h4>
            <label className={styles.toggleSwitch} onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={() => toggleSectionEnabled(sectionIndex)}
              />
              <span className={styles.toggleSlider}></span>
              <span className={styles.toggleLabel}>{isEnabled ? 'Enabled' : 'Disabled'}</span>
            </label>
          </div>
        </div>

        {isEnabled && (
          <>
            <div className={styles.typeGrid} onClick={(e) => e.stopPropagation()}>
              <button
                className={`${styles.typeCard} ${sectionType === 'switching' ? styles.selected : ''}`}
                onClick={() => updateSection(sectionIndex, { type: 'switching' })}
              >
                <div className={styles.typeIcon}>{getSectionIcon('switching')}</div>
                <div className={styles.typeLabel}>Switching</div>
                <div className={styles.typeDesc}>{getSectionDescription('switching')}</div>
              </button>

              <button
                className={`${styles.typeCard} ${sectionType === 'signal-values' ? styles.selected : ''}`}
                onClick={() => updateSection(sectionIndex, { type: 'signal-values' })}
              >
                <div className={styles.typeIcon}>{getSectionIcon('signal-values')}</div>
                <div className={styles.typeLabel}>Signal Values</div>
                <div className={styles.typeDesc}>{getSectionDescription('signal-values')}</div>
              </button>

              <button
                className={`${styles.typeCard} ${sectionType === 'image' ? styles.selected : ''}`}
                onClick={() => updateSection(sectionIndex, { type: 'image' })}
              >
                <div className={styles.typeIcon}>{getSectionIcon('image')}</div>
                <div className={styles.typeLabel}>Image</div>
                <div className={styles.typeDesc}>{getSectionDescription('image')}</div>
              </button>
            </div>

            {/* Image Upload for image type sections */}
            {sectionType === 'image' && (
              <div className={styles.imageUpload}>
                <label htmlFor={`image-section-${sectionIndex}`} className={styles.imageLabel}>
                  {section.imageUrl ? (
                    <div className={styles.imagePreview}>
                      <img src={section.imageUrl} alt="Section preview" />
                      <div className={styles.imageOverlay}>
                        <span>📷 Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <div className={styles.uploadIcon}>📷</div>
                      <div className={styles.uploadText}>
                        <strong>Click to upload image</strong>
                        <small>PNG, JPG, or SVG</small>
                      </div>
                    </div>
                  )}
                </label>
                <input
                  id={`image-section-${sectionIndex}`}
                  type="file"
                  accept="image/*"
                  className={styles.imageInput}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const imageUrl = reader.result as string;
                        updateSection(sectionIndex, { imageUrl });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {section.imageUrl && (
                  <button
                    className={styles.removeImageButton}
                    onClick={() => updateSection(sectionIndex, { imageUrl: undefined })}
                  >
                    Remove Image
                  </button>
                )}
              </div>
            )}

            {/* Component List - Only show for switching and signal-values */}
            {sectionType !== 'image' && (
              <div className={styles.componentList}>
                <div className={styles.componentListHeader}>
                  <strong>Components in this section:</strong>
                  <span className={styles.componentCount}>{section.components?.length || 0}</span>
                </div>
                {section.components && section.components.length > 0 ? (
                  <div className={styles.components}>
                    {section.components.map((comp) => (
                      <div key={comp.id} className={styles.componentItem}>
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
                    <small>
                      {sectionType === 'switching'
                        ? 'Add switching components from the palette'
                        : sectionType === 'signal-values'
                          ? 'Add signal value components from the palette'
                          : 'Upload an image for this section'}
                    </small>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>🏠 Home Tab Sections</h3>
        <p className={styles.subtitle}>
          Configure up to two sections for your home screen. Section 1 is required, Section 2 is
          optional.
        </p>
      </div>

      {renderSectionConfig(0, 1)}
      {renderSectionConfig(1, 2)}

      <div className={styles.infoBox}>
        <strong>💡 Tip:</strong> Click a section to select it, then add components from the
        Component Palette on the right. Use the toggle to enable/disable Section 2.
      </div>
    </div>
  );
}
