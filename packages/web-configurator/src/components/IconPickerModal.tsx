import { useState, useEffect } from 'react';
import { debug } from '../utils/debug';
import styles from './IconPickerModal.module.css';

interface IconManifest {
  groups: Array<{
    label: string;
    icons: Array<{
      label: string;
      path: string;
    }>;
  }>;
}

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iconPath: string) => void;
  selectedIcon?: string;
}

export default function IconPickerModal({
  isOpen,
  onClose,
  onSelect,
  selectedIcon,
}: IconPickerModalProps) {
  const [icons, setIcons] = useState<IconManifest['groups'][0]['icons']>([]);

  useEffect(() => {
    // Load icon manifest
    fetch('/icons/icon-manifest.json')
      .then((res) => res.json())
      .then((manifest: IconManifest) => {
        const allIcons = manifest.groups.flatMap((group) => group.icons);
        setIcons(allIcons);
      })
      .catch((err) => debug.error('Failed to load icon manifest:', err));
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        // Pass the data URL as the icon path (will be stored in schema)
        onSelect(dataUrl);
        onClose();
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid SVG file');
    }
  };

  const handleIconSelect = (iconPath: string) => {
    onSelect('/' + iconPath);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Select Icon</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.controls}>
          <label className={styles.uploadButton}>
            <input
              type="file"
              accept=".svg"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            📤 Upload Custom SVG
          </label>
        </div>

        <div className={styles.iconGrid}>
          {icons.map((icon, index) => (
            <button
              key={index}
              className={`${styles.iconCard} ${
                selectedIcon === '/' + icon.path ? styles.selected : ''
              }`}
              onClick={() => handleIconSelect(icon.path)}
              title={icon.label}
            >
              <div className={styles.iconPreview}>
                <img src={'/' + icon.path} alt={icon.label} />
              </div>
              <span className={styles.iconLabel}>{icon.label}</span>
            </button>
          ))}
        </div>

        {icons.length === 0 && (
          <div className={styles.emptyState}>
            <p>Loading icons...</p>
          </div>
        )}
      </div>
    </div>
  );
}
