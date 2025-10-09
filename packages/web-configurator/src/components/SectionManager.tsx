import { useState } from 'react';
import type { UISchema, Section } from '@gcg/schema';
import styles from './SectionManager.module.css';

interface SectionManagerProps {
  schema: UISchema;
  selectedTabId: string | null;
  onUpdate: (schema: UISchema) => void;
  onSelectSection: (sectionId: string) => void;
  selectedSectionId: string | null;
  onAddComponent: (channelId: string, componentType?: string, targetSectionId?: string) => void;
}

export default function SectionManager({
  schema,
  selectedTabId,
  onUpdate,
  onSelectSection,
  selectedSectionId,
  onAddComponent,
}: SectionManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(null);

  const selectedTab = schema.tabs.find((tab) => tab.id === selectedTabId);

  if (!selectedTab) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>Select a tab to manage sections</p>
        </div>
      </div>
    );
  }

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;

    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: newSectionTitle.trim(),
      enabled: true,
      components: [],
    };

    const updatedTabs = schema.tabs.map((tab) =>
      tab.id === selectedTabId ? { ...tab, sections: [...tab.sections, newSection] } : tab
    );

    onUpdate({ ...schema, tabs: updatedTabs });
    setNewSectionTitle('');
    setIsAdding(false);
    onSelectSection(newSection.id);
  };

  const handleDeleteSection = (sectionId: string) => {
    if (selectedTab.sections.length === 1) {
      alert('Cannot delete the last section. Tab must have at least one section.');
      return;
    }

    if (!confirm('Delete this section and all its components?')) return;

    const updatedTabs = schema.tabs.map((tab) =>
      tab.id === selectedTabId
        ? { ...tab, sections: tab.sections.filter((s) => s.id !== sectionId) }
        : tab
    );

    onUpdate({ ...schema, tabs: updatedTabs });

    if (selectedSectionId === sectionId) {
      const remainingSections = selectedTab.sections.filter((s) => s.id !== sectionId);
      if (remainingSections.length > 0) {
        onSelectSection(remainingSections[0]!.id);
      }
    }
  };

  const handleRenameSection = (sectionId: string, newTitle: string) => {
    const updatedTabs = schema.tabs.map((tab) =>
      tab.id === selectedTabId
        ? {
            ...tab,
            sections: tab.sections.map((section) =>
              section.id === sectionId ? { ...section, title: newTitle } : section
            ),
          }
        : tab
    );

    onUpdate({ ...schema, tabs: updatedTabs });
  };

  const handleToggleCollapsible = (sectionId: string) => {
    const updatedTabs = schema.tabs.map((tab) =>
      tab.id === selectedTabId
        ? {
            ...tab,
            sections: tab.sections.map((section) =>
              section.id === sectionId ? { ...section, collapsible: !section.collapsible } : section
            ),
          }
        : tab
    );

    onUpdate({ ...schema, tabs: updatedTabs });
  };

  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    const currentIndex = selectedTab.sections.findIndex((s) => s.id === sectionId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= selectedTab.sections.length) return;

    const newSections = [...selectedTab.sections];
    const movedSection = newSections.splice(currentIndex, 1)[0] as Section;
    newSections.splice(newIndex, 0, movedSection);

    const updatedTabs = schema.tabs.map((tab) =>
      tab.id === selectedTabId ? { ...tab, sections: newSections } : tab
    );

    onUpdate({ ...schema, tabs: updatedTabs });
  };

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

    onUpdate({ ...schema, tabs: updatedTabs });
  };

  // Drag and drop handlers for components from palette
  const handleDrop = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSectionId(null);

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
    setDragOverSectionId(sectionId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setDragOverSectionId(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Sections in "{selectedTab.title}"</h3>
        <button
          className={styles.addButton}
          onClick={() => setIsAdding(true)}
          title="Add new section"
        >
          + Section
        </button>
      </div>

      <div className={styles.sectionList}>
        {selectedTab.sections.map((section, index) => {
          const isSelected = section.id === selectedSectionId;
          const componentCount = section.components.length;
          const isDragOver = dragOverSectionId === section.id;

          return (
            <div
              key={section.id}
              className={`${styles.sectionItem} ${isSelected ? styles.selected : ''} ${isDragOver ? styles.dragOver : ''}`}
              onDrop={(e) => handleDrop(e, section.id)}
              onDragOver={(e) => handleDragOver(e, section.id)}
              onDragLeave={handleDragLeave}
            >
              <div className={styles.sectionHeader} onClick={() => onSelectSection(section.id)}>
                <input
                  type="text"
                  className={styles.sectionTitle}
                  value={section.title}
                  onChange={(e) => handleRenameSection(section.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className={styles.sectionActions}>
                  <button
                    className={styles.iconButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleCollapsible(section.id);
                    }}
                    title={section.collapsible ? 'Make non-collapsible' : 'Make collapsible'}
                  >
                    {section.collapsible ? '📁' : '📂'}
                  </button>
                  <button
                    className={styles.iconButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveSection(section.id, 'up');
                    }}
                    disabled={index === 0}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    className={styles.iconButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveSection(section.id, 'down');
                    }}
                    disabled={index === selectedTab.sections.length - 1}
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSection(section.id);
                    }}
                    title="Delete section"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className={styles.sectionMeta}>
                {componentCount} {componentCount === 1 ? 'component' : 'components'}
              </div>

              {isSelected && componentCount > 0 && (
                <div className={styles.componentList}>
                  {section.components.map((component) => (
                    <div key={component.id} className={styles.componentItem}>
                      <div className={styles.componentInfo}>
                        <span className={styles.componentType}>{component.type}</span>
                        <span className={styles.componentLabel}>{component.label}</span>
                      </div>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteComponent(section.id, component.id)}
                        title="Delete component"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isAdding && (
        <div className={styles.addForm}>
          <input
            type="text"
            className={styles.input}
            placeholder="Section title..."
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddSection();
              if (e.key === 'Escape') {
                setIsAdding(false);
                setNewSectionTitle('');
              }
            }}
            autoFocus
          />
          <div className={styles.formActions}>
            <button className={styles.primaryButton} onClick={handleAddSection}>
              Add
            </button>
            <button
              className={styles.secondaryButton}
              onClick={() => {
                setIsAdding(false);
                setNewSectionTitle('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
