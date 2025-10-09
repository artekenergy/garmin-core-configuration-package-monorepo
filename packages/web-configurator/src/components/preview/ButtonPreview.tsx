import { useState } from 'react';
import type { Component } from '@gcg/schema';
import styles from './ComponentPreview.module.css';

interface ButtonPreviewProps {
  component: Component & { type: 'button' };
}

export default function ButtonPreview({ component }: ButtonPreviewProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), component.action === 'momentary' ? 200 : 0);
  };

  return (
    <div className={styles.componentWrapper}>
      <button
        className={`${styles.button} ${isPressed ? styles.buttonPressed : ''} ${
          styles[`button-${component.variant || 'primary'}`]
        }`}
        onClick={handlePress}
        title={component.tooltip}
      >
        {component.icon && <span className={styles.icon}>{component.icon}</span>}
        <span className={styles.label}>{component.label}</span>
      </button>
    </div>
  );
}
