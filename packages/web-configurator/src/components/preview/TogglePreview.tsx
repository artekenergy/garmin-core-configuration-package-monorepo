import { useState } from 'react';
import type { Component } from '@gcg/schema';
import styles from './ComponentPreview.module.css';

interface TogglePreviewProps {
  component: Component & { type: 'toggle' };
}

export default function TogglePreview({ component }: TogglePreviewProps) {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className={styles.componentWrapper}>
      <button
        className={`${styles.toggle} ${isOn ? styles.toggleOn : styles.toggleOff}`}
        onClick={() => setIsOn(!isOn)}
        title={component.tooltip}
      >
        {component.icon && <span className={styles.icon}>{component.icon}</span>}
        <span className={styles.label}>{component.label}</span>
        <div className={`${styles.toggleIndicator} ${isOn ? styles.indicatorOn : ''}`}>
          <div className={styles.toggleThumb} />
        </div>
      </button>
    </div>
  );
}
