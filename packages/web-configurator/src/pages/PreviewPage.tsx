import { useState } from 'react';
import { useSchema } from '../context/SchemaContext';
import type { Component } from '@gcg/schema';
import TogglePreview from '../components/preview/TogglePreview';
import ButtonPreview from '../components/preview/ButtonPreview';
import DimmerPreview from '../components/preview/DimmerPreview';
import styles from './NewPreviewPage.module.css';

type Theme = 'light' | 'dark' | 'dusk';

export default function PreviewPage() {
  const { schema, validationResult } = useSchema();
  const [activeTabId, setActiveTabId] = useState(schema?.tabs[0]?.id);
  const [theme, setTheme] = useState<Theme>('light');

  // Coming Soon state
  return (
    <div className={styles.container}>
      <div className={styles.comingSoon}>
        <div className={styles.comingSoonIcon}>🚀</div>
        <h2>Preview Coming Soon</h2>
        <p>We're working on bringing you an interactive preview of your HMI interface.</p>
        <p className={styles.comingSoonHint}>
          In the meantime, you can export your configuration and test it on your device.
        </p>
      </div>
    </div>
  );
}
