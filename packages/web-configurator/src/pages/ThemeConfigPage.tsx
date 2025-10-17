import { useSchema } from '../context/SchemaContext';
import type { ThemeConfig } from '@gcg/schema';
import styles from './ThemeConfigPage.module.css';

// Define theme presets with their 4-color system
const THEME_PRESETS = {
  blue: {
    name: 'Artek',
    description: 'Artek Brand Colors',
    colors: {
      primary: '#1e293b', // Blue for buttons/interactive
      secondary: '#1e293b', // Dark slate for backgrounds
      accent: '#f1f5f9', // Cyan for highlights
      text: '#f1f5f9', // Light text
    },
    gradient: 'linear-gradient(135deg, #1e293b 0%, #406d75ff 100%)',
  },
  purple: {
    name: 'Royal Purple',
    description: 'Elegant purple theme',
    colors: {
      primary: '#8b5cf6', // Purple for buttons/interactive
      secondary: '#1e1b4b', // Dark indigo for backgrounds
      accent: '#a78bfa', // Light purple for highlights
      text: '#f5f3ff', // Light purple text
    },
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
  },
  green: {
    name: 'Forest Green',
    description: 'Natural green theme',
    colors: {
      primary: '#10b981', // Green for buttons/interactive
      secondary: '#064e3b', // Dark green for backgrounds
      accent: '#34d399', // Light green for highlights
      text: '#ecfdf5', // Light green text
    },
    gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
  },
  orange: {
    name: 'Sunset Orange',
    description: 'Warm orange theme',
    colors: {
      primary: '#f97316', // Orange for buttons/interactive
      secondary: '#431407', // Dark orange for backgrounds
      accent: '#fb923c', // Light orange for highlights
      text: '#fff7ed', // Light orange text
    },
    gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
  },
  red: {
    name: 'Marine Red',
    description: 'Bold red theme',
    colors: {
      primary: '#ef4444', // Red for buttons/interactive
      secondary: '#450a0a', // Dark red for backgrounds
      accent: '#f87171', // Light red for highlights
      text: '#fef2f2', // Light red text
    },
    gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
  },
  cyan: {
    name: 'Cyan Wave',
    description: 'Cool cyan theme',
    colors: {
      primary: '#06b6d4', // Cyan for buttons/interactive
      secondary: '#164e63', // Dark cyan for backgrounds
      accent: '#22d3ee', // Light cyan for highlights
      text: '#ecfeff', // Light cyan text
    },
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
  },
  dark: {
    name: 'Midnight Dark',
    description: 'Dark mode theme',
    colors: {
      primary: '#60a5fa', // Light blue for buttons/interactive
      secondary: '#0f172a', // Very dark slate for backgrounds
      accent: '#818cf8', // Indigo for highlights
      text: '#f1f5f9', // Light text
    },
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  },
  light: {
    name: 'Bright Light',
    description: 'Clean light theme',
    colors: {
      primary: '#2563eb', // Dark blue for buttons/interactive
      secondary: '#f8fafc', // Light slate for backgrounds
      accent: '#0ea5e9', // Bright blue for highlights
      text: '#0f172a', // Dark text
    },
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
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
        <p className={styles.subtitle}>
          Customize your HMI with the 4-color system: Primary, Secondary, Accent, and Text
        </p>
      </header>

      <div className={styles.content}>
        {/* Custom Color Overrides */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>4-Color Theme System</h3>
            <p className={styles.sectionDescription}>
              Customize the four core colors that define your entire HMI appearance
            </p>
            {hasCustomColors && (
              <button className={styles.resetButton} onClick={resetCustomColors}>
                Reset to Preset
              </button>
            )}
          </div>

          <div className={styles.colorPickerGrid}>
            <div className={styles.colorPickerItem}>
              <label className={styles.colorLabel}>
                <span className={styles.colorLabelText}>
                  Primary Color
                  <span className={styles.colorHint}>Buttons & interactive elements</span>
                </span>
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
                    placeholder="#3b82f6"
                    maxLength={7}
                  />
                </div>
              </label>
            </div>

            <div className={styles.colorPickerItem}>
              <label className={styles.colorLabel}>
                <span className={styles.colorLabelText}>
                  Secondary Color
                  <span className={styles.colorHint}>Backgrounds & containers</span>
                </span>
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
                    placeholder="#1e293b"
                    maxLength={7}
                  />
                </div>
              </label>
            </div>

            <div className={styles.colorPickerItem}>
              <label className={styles.colorLabel}>
                <span className={styles.colorLabelText}>
                  Accent Color
                  <span className={styles.colorHint}>Highlights & focus states</span>
                </span>
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
                    placeholder="#06b6d4"
                    maxLength={7}
                  />
                </div>
              </label>
            </div>

            <div className={styles.colorPickerItem}>
              <label className={styles.colorLabel}>
                <span className={styles.colorLabelText}>
                  Text Color
                  <span className={styles.colorHint}>All text content</span>
                </span>
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
                    placeholder="#f1f5f9"
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
              <div className={styles.summaryLabel}>Secondary Color</div>
              <div className={styles.summaryValue}>
                <div
                  className={styles.colorIndicator}
                  style={{ background: effectiveColors.secondary }}
                >
                  {effectiveColors.secondary}
                </div>
              </div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Accent Color</div>
              <div className={styles.summaryValue}>
                <div
                  className={styles.colorIndicator}
                  style={{ background: effectiveColors.accent }}
                >
                  {effectiveColors.accent}
                </div>
              </div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Text Color</div>
              <div className={styles.summaryValue}>
                <div className={styles.colorIndicator} style={{ background: effectiveColors.text }}>
                  {effectiveColors.text}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
