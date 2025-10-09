import { useState } from 'react';
import type { UISchema } from '@gcg/schema';
import styles from './TabManager.module.css';

interface TabManagerProps {
  schema: UISchema;
  onUpdate: (schema: UISchema) => void;
  selectedTabId: string | null;
  onSelectTab: (tabId: string) => void;
}

export default function TabManager({
  schema,
  onUpdate,
  selectedTabId,
  onSelectTab,
}: TabManagerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleToggleTab = (tabId: string) => {
    const newTabs = schema.tabs.map((tab) =>
      tab.id === tabId ? { ...tab, enabled: !tab.enabled } : tab
    );
    onUpdate({ ...schema, tabs: newTabs });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Set a semi-transparent drag image
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newTabs = [...schema.tabs];
    const draggedTab = newTabs[draggedIndex];

    if (!draggedTab) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Remove from old position
    newTabs.splice(draggedIndex, 1);
    // Insert at new position
    newTabs.splice(dropIndex, 0, draggedTab);

    onUpdate({ ...schema, tabs: newTabs });
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Navigation Tabs</h3>
        <p className={styles.subtitle}>Enable or disable preset tabs for your HMI</p>
      </div>

      <div className={styles.tabList}>
        {schema.tabs.map((tab, index) => {
          const isSelected = tab.id === selectedTabId;
          const isEnabled = tab.enabled !== false; // Default to true if undefined
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;
          const sectionCount = tab.sections.length;
          const componentCount = tab.sections.reduce(
            (sum, section) => sum + section.components.length,
            0
          );

          return (
            <div
              key={tab.id}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`${styles.tabItem} ${isSelected ? styles.selected : ''} ${
                !isEnabled ? styles.disabled : ''
              } ${isDragging ? styles.dragging : ''} ${isDragOver ? styles.dragOver : ''}`}
              onClick={() => isEnabled && onSelectTab(tab.id)}
            >
              <div className={styles.tabHeader}>
                <div className={styles.dragHandle}>⋮⋮</div>
                <div className={styles.tabTitle}>{tab.title}</div>
                <div className={styles.tabActions}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleToggleTab(tab.id);
                      }}
                      className={styles.toggleInput}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
              <div className={styles.tabMeta}>
                {sectionCount} {sectionCount === 1 ? 'section' : 'sections'} • {componentCount}{' '}
                {componentCount === 1 ? 'component' : 'components'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
