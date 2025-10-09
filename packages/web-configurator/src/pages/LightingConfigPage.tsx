import { useSchema } from '../context/SchemaContext';
import type { LightingConfig } from '@gcg/schema';
import styles from './LightingConfigPage.module.css';

export default function LightingConfigPage() {
  const { schema, updateSchema } = useSchema();

  if (!schema) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No schema loaded</div>
      </div>
    );
  }

  const lighting = schema.lighting || {
    enabled: false,
    modules: 0,
    zonesPerModule: 2,
  };

  const updateLighting = (updates: Partial<LightingConfig>) => {
    updateSchema({
      ...schema,
      lighting: {
        ...lighting,
        ...updates,
      },
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>💡 ITC Lighting System Configuration</h2>
        <p className={styles.subtitle}>
          Configure ITC (Intelligent Tactical Control) lighting modules and zones
        </p>
      </header>

      <div className={styles.content}>
        {/* ITC Module Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleRow}>
              <h3>🎚️ ITC Lighting Module</h3>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={lighting.enabled}
                  onChange={(e) => updateLighting({ enabled: e.target.checked })}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <p className={styles.sectionDescription}>
              Intelligent Tactical Control modules for dimmable LED zone lighting
            </p>
          </div>

          {lighting.enabled && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="itc-modules" className={styles.label}>
                  <strong>Number of ITC Modules</strong>
                  <span className={styles.labelDescription}>
                    How many ITC lighting modules are installed?
                  </span>
                </label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioCard}>
                    <input
                      type="radio"
                      name="itc-modules"
                      value="0"
                      checked={lighting.modules === 0}
                      onChange={() => updateLighting({ modules: 0 })}
                    />
                    <div className={styles.radioContent}>
                      <div className={styles.radioIcon}>⭕</div>
                      <div>
                        <strong>None</strong>
                        <span>No ITC modules</span>
                      </div>
                    </div>
                  </label>

                  <label className={styles.radioCard}>
                    <input
                      type="radio"
                      name="itc-modules"
                      value="1"
                      checked={lighting.modules === 1}
                      onChange={() => updateLighting({ modules: 1 })}
                    />
                    <div className={styles.radioContent}>
                      <div className={styles.radioIcon}>1️⃣</div>
                      <div>
                        <strong>One Module</strong>
                        <span>Single ITC lighting module</span>
                      </div>
                    </div>
                  </label>

                  <label className={styles.radioCard}>
                    <input
                      type="radio"
                      name="itc-modules"
                      value="2"
                      checked={lighting.modules === 2}
                      onChange={() => updateLighting({ modules: 2 })}
                    />
                    <div className={styles.radioContent}>
                      <div className={styles.radioIcon}>2️⃣</div>
                      <div>
                        <strong>Two Modules</strong>
                        <span>Dual ITC module setup</span>
                      </div>
                    </div>
                  </label>

                  <label className={styles.radioCard}>
                    <input
                      type="radio"
                      name="itc-modules"
                      value="3"
                      checked={lighting.modules === 3}
                      onChange={() => updateLighting({ modules: 3 })}
                    />
                    <div className={styles.radioContent}>
                      <div className={styles.radioIcon}>3️⃣</div>
                      <div>
                        <strong>Three Modules</strong>
                        <span>Extended ITC lighting system</span>
                      </div>
                    </div>
                  </label>

                  <label className={styles.radioCard}>
                    <input
                      type="radio"
                      name="itc-modules"
                      value="4"
                      checked={lighting.modules === 4}
                      onChange={() => updateLighting({ modules: 4 })}
                    />
                    <div className={styles.radioContent}>
                      <div className={styles.radioIcon}>4️⃣</div>
                      <div>
                        <strong>Four Modules</strong>
                        <span>Full ITC lighting system</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {lighting.modules > 0 && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>ITC Zone Configuration</h4>
                  <div className={styles.formGroup}>
                    <label htmlFor="zones-per-module" className={styles.label}>
                      <strong>Zones Per Module</strong>
                      <span className={styles.labelDescription}>
                        How many lighting zones does each ITC module control?
                      </span>
                    </label>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioCard}>
                        <input
                          type="radio"
                          name="zones-per-module"
                          value="2"
                          checked={lighting.zonesPerModule === 2}
                          onChange={() => updateLighting({ zonesPerModule: 2 })}
                        />
                        <div className={styles.radioContent}>
                          <div className={styles.radioIcon}>2️⃣</div>
                          <div>
                            <strong>2 Zones</strong>
                            <span>
                              {lighting.modules} {lighting.modules === 1 ? 'module' : 'modules'} ={' '}
                              {lighting.modules * 2} total zones
                            </span>
                          </div>
                        </div>
                      </label>

                      <label className={styles.radioCard}>
                        <input
                          type="radio"
                          name="zones-per-module"
                          value="4"
                          checked={lighting.zonesPerModule === 4}
                          onChange={() => updateLighting({ zonesPerModule: 4 })}
                        />
                        <div className={styles.radioContent}>
                          <div className={styles.radioIcon}>4️⃣</div>
                          <div>
                            <strong>4 Zones</strong>
                            <span>
                              {lighting.modules} {lighting.modules === 1 ? 'module' : 'modules'} ={' '}
                              {lighting.modules * 4} total zones
                            </span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* Summary Section */}
        <section className={styles.summarySection}>
          <h3>📋 Lighting Configuration Summary</h3>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>ITC Modules</div>
              <div className={styles.summaryValue}>
                {lighting.enabled ? (
                  lighting.modules > 0 ? (
                    <>
                      {lighting.modules} {lighting.modules === 1 ? 'module' : 'modules'}
                    </>
                  ) : (
                    'Enabled (no modules selected)'
                  )
                ) : (
                  'Disabled'
                )}
              </div>
            </div>

            {lighting.enabled && lighting.modules > 0 && (
              <>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>Zones Per Module</div>
                  <div className={styles.summaryValue}>{lighting.zonesPerModule} zones</div>
                </div>

                <div className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>Total Lighting Zones</div>
                  <div className={styles.summaryValue}>
                    {lighting.modules * lighting.zonesPerModule} zones
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
