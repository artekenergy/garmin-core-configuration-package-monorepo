import { useState } from 'react';
import type { Component } from '@gcg/schema';
import styles from './ComponentPreview.module.css';

interface DimmerPreviewProps {
  component: Component & { type: 'dimmer' };
}

export default function DimmerPreview({ component }: DimmerPreviewProps) {
  const min = component.min ?? 0;
  const max = component.max ?? 100;
  const step = component.step ?? 1;
  const [value, setValue] = useState(min);

  return (
    <div className={styles.componentWrapper}>
      <div className={styles.dimmer}>
        <div className={styles.dimmerHeader}>
          {component.icon && <span className={styles.icon}>{component.icon}</span>}
          <span className={styles.label}>{component.label}</span>
          <span className={styles.dimmerValue}>{Math.round(value)}%</span>
        </div>
        <input
          type="range"
          className={styles.dimmerSlider}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          title={component.tooltip}
        />
      </div>
    </div>
  );
}
