import { useSchema } from '../context/SchemaContext';
import type { ThemeConfig } from '@gcg/schema';
import styles from './ThemeConfigPage.module.css';

// Define theme presets with their color schemes
const THEME_PRESETS = {
  blue: {
    name: 'Ocean Blue',
    description: 'Classic blue theme with professional look',
    colors: {
      primary: '#dbeafe', // Light blue (inactive button background)
      secondary: '#1e40af', // Dark blue (active button background / inactive icon)
      accent: '#3b82f6',
      background: '#f8fafc',
      text: '#1e293b',
    },
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  purple: {
    name: 'Royal Purple',
    description: 'Elegant purple theme',
    colors: {
      primary: '#f3e8ff', // Light purple (inactive button background)
      secondary: '#6d28d9', // Dark purple (active button background / inactive icon)
      accent: '#8b5cf6',
      background: '#faf5ff',
      text: '#1e293b',
    },
    gradient: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
  },
  green: {
    name: 'Forest Green',
    description: 'Natural green theme',
    colors: {
      primary: '#d1fae5', // Light green (inactive button background)
      secondary: '#047857', // Dark green (active button background / inactive icon)
      accent: '#10b981',
      background: '#f0fdf4',
      text: '#1e293b',
    },
    gradient: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
  },
  orange: {
    name: 'Sunset Orange',
    description: 'Warm orange theme',
    colors: {
      primary: '#ffedd5', // Light orange (inactive button background)
      secondary: '#c2410c', // Dark orange (active button background / inactive icon)
      accent: '#f97316',
      background: '#fff7ed',
      text: '#1e293b',
    },
    gradient: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
  },
  red: {
    name: 'Marine Red',
    description: 'Bold red theme',
    colors: {
      primary: '#fee2e2', // Light red (inactive button background)
      secondary: '#b91c1c', // Dark red (active button background / inactive icon)
      accent: '#ef4444',
      background: '#fef2f2',
      text: '#1e293b',
    },
    gradient: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)',
  },
  dark: {
    name: 'Midnight Dark',
    description: 'Dark mode theme',
    colors: {
      primary: '#1e293b', // Dark gray (inactive button background)
      secondary: '#93c5fd', // Light blue (active button background / inactive icon)
      accent: '#60a5fa',
      background: '#0f172a',
      text: '#f1f5f9',
    },
    gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  },
  light: {
    name: 'Bright Light',
    description: 'Clean light theme',
    colors: {
      primary: '#e0f2fe', // Very light blue (inactive button background)
      secondary: '#0284c7', // Dark cyan (active button background / inactive icon)
      accent: '#38bdf8',
      background: '#ffffff',
      text: '#0f172a',
    },
    gradient: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
  },
};

export default function ThemeConfigPage() {
  const { schema, updateSchema } = useSchema();

  if (!schema) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No schema loaded</div>
      </div>
    );
  }

  const theme = schema.theme || { preset: 'blue' };

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    updateSchema({
      ...schema,
      theme: {
        ...theme,
        ...updates,
      },
    });
  };

  const currentPreset =
    THEME_PRESETS[theme.preset as keyof typeof THEME_PRESETS] || THEME_PRESETS.blue;

  // Get effective colors (custom overrides take precedence)
  const effectiveColors = {
    primary: theme.customColors?.primary || currentPreset.colors.primary,
    secondary: theme.customColors?.secondary || currentPreset.colors.secondary,
    accent: theme.customColors?.accent || currentPreset.colors.accent,
    background: theme.customColors?.background || currentPreset.colors.background,
    text: theme.customColors?.text || currentPreset.colors.text,
  };

  const updateCustomColor = (
    colorKey: keyof NonNullable<ThemeConfig['customColors']>,
    value: string
  ) => {
    updateTheme({
      customColors: {
        ...theme.customColors,
        [colorKey]: value,
      },
    });
  };

  const resetCustomColors = () => {
    updateTheme({
      customColors: undefined,
    });
  };

  const hasCustomColors = theme.customColors && Object.keys(theme.customColors).length > 0;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>🎨 Theme Configuration</h2>
        <p className={styles.subtitle}>Customize the look and feel of your HMI interface</p>
      </header>

      <div className={styles.content}>
        {/* Custom Color Overrides */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Custom Colors (Optional)</h3>
            <p className={styles.sectionDescription}>Override specific colors from the preset</p>
            {hasCustomColors && (
              <button className={styles.resetButton} onClick={resetCustomColors}>
                Reset to Preset
              </button>
            )}
          </div>

          <div className={styles.colorPickerGrid}>
            <div className={styles.colorPickerItem}>
              <label className={styles.colorLabel}>
                <span className={styles.colorLabelText}>Primary Color</span>
                <div className={styles.colorInputWrapper}>
                  <input
                    type="color"
                    value={effectiveColors.primary}
                    onChange={(e) => updateCustomColor('primary', e.target.value)}
                    className={styles.colorInput}
                  />
                  <input
                    type="text"
                    value={effectiveColors.primary}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        updateCustomColor('primary', val);
                      }
                    }}
                    className={styles.colorTextInput}
                    placeholder="#2563eb"
                    maxLength={7}
                  />
                </div>
              </label>
            </div>

            <div className={styles.colorPickerItem}>
              <label className={styles.colorLabel}>
                <span className={styles.colorLabelText}>Secondary Color</span>
                <div className={styles.colorInputWrapper}>
                  <input
                    type="color"
                    value={effectiveColors.secondary}
                    onChange={(e) => updateCustomColor('secondary', e.target.value)}
                    className={styles.colorInput}
                  />
                  <input
                    type="text"
                    value={effectiveColors.secondary}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        updateCustomColor('secondary', val);
                      }
                    }}
                    className={styles.colorTextInput}
                    placeholder="#1e40af"
                    maxLength={7}
                  />
                </div>
              </label>
            </div>

            <div className={styles.colorPickerItem}>
              <label className={styles.colorLabel}>
                <span className={styles.colorLabelText}>Accent Color</span>
                <div className={styles.colorInputWrapper}>
                  <input
                    type="color"
                    value={effectiveColors.accent}
                    onChange={(e) => updateCustomColor('accent', e.target.value)}
                    className={styles.colorInput}
                  />
                  <input
                    type="text"
                    value={effectiveColors.accent}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        updateCustomColor('accent', val);
                      }
                    }}
                    className={styles.colorTextInput}
                    placeholder="#3b82f6"
                    maxLength={7}
                  />
                </div>
              </label>
            </div>

            <div className={styles.colorPickerItem}>
              <label className={styles.colorLabel}>
                <span className={styles.colorLabelText}>Background Color</span>
                <div className={styles.colorInputWrapper}>
                  <input
                    type="color"
                    value={effectiveColors.background}
                    onChange={(e) => updateCustomColor('background', e.target.value)}
                    className={styles.colorInput}
                  />
                  <input
                    type="text"
                    value={effectiveColors.background}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        updateCustomColor('background', val);
                      }
                    }}
                    className={styles.colorTextInput}
                    placeholder="#f8fafc"
                    maxLength={7}
                  />
                </div>
              </label>
            </div>

            <div className={styles.colorPickerItem}>
              <label className={styles.colorLabel}>
                <span className={styles.colorLabelText}>Text Color</span>
                <div className={styles.colorInputWrapper}>
                  <input
                    type="color"
                    value={effectiveColors.text}
                    onChange={(e) => updateCustomColor('text', e.target.value)}
                    className={styles.colorInput}
                  />
                  <input
                    type="text"
                    value={effectiveColors.text}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        updateCustomColor('text', val);
                      }
                    }}
                    className={styles.colorTextInput}
                    placeholder="#1e293b"
                    maxLength={7}
                  />
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Theme Preset Selection */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Choose a Theme Preset</h3>
            <p className={styles.sectionDescription}>
              Select from professionally designed color schemes
            </p>
          </div>

          <div className={styles.presetGrid}>
            {Object.entries(THEME_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                className={`${styles.presetCard} ${theme.preset === key ? styles.presetCardActive : ''}`}
                onClick={() => updateTheme({ preset: key as ThemeConfig['preset'] })}
              >
                <div className={styles.presetPreview} style={{ background: preset.gradient }}>
                  <div className={styles.presetColors}>
                    <div
                      className={styles.colorSwatch}
                      style={{ background: preset.colors.primary }}
                      title="Primary"
                    />
                    <div
                      className={styles.colorSwatch}
                      style={{ background: preset.colors.secondary }}
                      title="Secondary"
                    />
                    <div
                      className={styles.colorSwatch}
                      style={{ background: preset.colors.accent }}
                      title="Accent"
                    />
                  </div>
                </div>
                <div className={styles.presetInfo}>
                  <div className={styles.presetName}>{preset.name}</div>
                  <div className={styles.presetDescription}>{preset.description}</div>
                </div>
                {theme.preset === key && <div className={styles.activeIndicator}>✓ Active</div>}
              </button>
            ))}
          </div>
        </section>

        {/* Live Preview */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Live Preview</h3>
            <p className={styles.sectionDescription}>
              See how your theme looks on sample components
            </p>
          </div>

          <div className={styles.previewArea}>
            <div
              className={styles.previewDevice}
              style={
                {
                  '--theme-primary': effectiveColors.primary,
                  '--theme-secondary': effectiveColors.secondary,
                  '--theme-accent': effectiveColors.accent,
                  '--theme-background': effectiveColors.background,
                  '--theme-text': effectiveColors.text,
                } as React.CSSProperties
              }
            >
              <div className={styles.previewHeader}>Sample Interface</div>
              <div className={styles.previewContent}>
                {/* Round Buttons Row */}
                <div className={styles.roundButtonRow}>
                  <button className={styles.roundButton}>
                    <div className={styles.roundButtonIcon} />
                  </button>
                  <button className={`${styles.roundButton} ${styles.roundButtonOn}`}>
                    <div className={styles.roundButtonIcon} />
                  </button>
                  <button className={styles.roundButton}>
                    <div className={styles.roundButtonIcon} />
                  </button>
                </div>

                {/* Regular Button */}
                <button className={styles.sampleButton}>Action Button</button>

                {/* Toggle */}
                <div className={styles.sampleToggle}>
                  <span>Sample Toggle</span>
                  <div className={styles.toggleSwitch}>
                    <div className={styles.toggleThumb} />
                  </div>
                </div>

                {/* Card */}
                <div className={styles.sampleCard}>
                  <div className={styles.cardTitle}>Sample Card</div>
                  <div className={styles.cardContent}>
                    This is how cards will look with your theme.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className={styles.summarySection}>
          <h3>📋 Theme Summary</h3>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Active Theme</div>
              <div className={styles.summaryValue}>
                {currentPreset.name}
                {hasCustomColors && <span className={styles.customBadge}>+ Custom</span>}
              </div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Primary Color</div>
              <div className={styles.summaryValue}>
                <div
                  className={styles.colorIndicator}
                  style={{ background: effectiveColors.primary }}
                >
                  {effectiveColors.primary}
                </div>
              </div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Background</div>
              <div className={styles.summaryValue}>
                <div
                  className={styles.colorIndicator}
                  style={{ background: effectiveColors.background }}
                >
                  {effectiveColors.background}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
