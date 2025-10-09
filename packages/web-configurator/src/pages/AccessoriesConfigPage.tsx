import { useSchema } from '../context/SchemaContext';
import type { AccessoriesConfig } from '@gcg/schema';
import styles from './AccessoriesConfigPage.module.css';

export default function AccessoriesConfigPage() {
  const { schema, updateSchema } = useSchema();

  if (!schema) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No schema loaded</div>
      </div>
    );
  }

  const accessories = schema.accessories || {
    keypad: {
      enabled: false,
      count: 1,
      buttonsPerKeypad: 8,
    },
    awning: {
      enabled: false,
      light: false,
      controlType: 'rvc' as const,
    },
    slides: {
      enabled: false,
      controlType: 'rvc' as const,
      keypadSecured: false,
    },
    itcLighting: {
      enabled: false,
      modules: 0,
      zonesPerModule: 2,
    },
  };

  const updateAccessories = (updates: Partial<AccessoriesConfig>) => {
    updateSchema({
      ...schema,
      accessories: {
        ...accessories,
        ...updates,
      },
    });
  };

  const updateKeypad = (updates: Partial<AccessoriesConfig['keypad']>) => {
    updateAccessories({
      keypad: {
        ...accessories.keypad,
        ...updates,
      },
    });
  };

  const updateAwning = (updates: Partial<AccessoriesConfig['awning']>) => {
    updateAccessories({
      awning: {
        ...accessories.awning,
        ...updates,
      },
    });
  };

  const updateSlides = (updates: Partial<AccessoriesConfig['slides']>) => {
    updateAccessories({
      slides: {
        ...accessories.slides,
        ...updates,
      },
    });
  };

  const updateItcLighting = (updates: Partial<AccessoriesConfig['itcLighting']>) => {
    updateAccessories({
      itcLighting: {
        ...accessories.itcLighting,
        ...updates,
      },
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Accessories & Controls</h2>
        <p className={styles.subtitle}>
          Configure control keypads, awning controls, and slide-out management
        </p>
      </header>

      <div className={styles.content}>
        {/* Keypad Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleRow}>
              <h3>Control Keypad</h3>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={accessories.keypad.enabled}
                  onChange={(e) => updateKeypad({ enabled: e.target.checked })}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <p className={styles.sectionDescription}>
              Wireless or wired control keypads for lighting, pumps, and other accessories
            </p>
          </div>

          {accessories.keypad.enabled && (
            <div className={styles.subsection}>
              {/* Keypad Count */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Number of Keypads
                  <span className={styles.helpText}>How many keypads do you have? (1-4)</span>
                </label>
                <div className={styles.radioGroup}>
                  {[1, 2, 3, 4].map((count) => (
                    <label key={count} className={styles.radioCard}>
                      <input
                        type="radio"
                        name="keypadCount"
                        value={count}
                        checked={accessories.keypad.count === count}
                        onChange={(e) => updateKeypad({ count: parseInt(e.target.value) })}
                      />
                      <div className={styles.radioContent}>
                        <div className={styles.radioIcon}>{count}</div>
                        <div>
                          <strong>
                            {count} Keypad{count > 1 ? 's' : ''}
                          </strong>
                          <span>{count * accessories.keypad.buttonsPerKeypad} total buttons</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Buttons Per Keypad */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Buttons Per Keypad
                  <span className={styles.helpText}>
                    How many buttons does each keypad have? (5-16)
                  </span>
                </label>
                <div className={styles.sliderGroup}>
                  <input
                    type="range"
                    min="5"
                    max="16"
                    step="1"
                    value={accessories.keypad.buttonsPerKeypad}
                    onChange={(e) => updateKeypad({ buttonsPerKeypad: parseInt(e.target.value) })}
                    className={styles.rangeSlider}
                  />
                  <div className={styles.sliderValue}>
                    {accessories.keypad.buttonsPerKeypad} buttons
                  </div>
                </div>
                <div className={styles.sliderLabels}>
                  <span>5</span>
                  <span>8</span>
                  <span>12</span>
                  <span>16</span>
                </div>
              </div>

              {/* Keypad Summary */}
              <div className={styles.infoBox}>
                <div>
                  <strong>Total Configuration</strong>
                  <p>
                    {accessories.keypad.count} keypad{accessories.keypad.count > 1 ? 's' : ''} ×{' '}
                    {accessories.keypad.buttonsPerKeypad} buttons ={' '}
                    <strong>
                      {accessories.keypad.count * accessories.keypad.buttonsPerKeypad}
                    </strong>{' '}
                    programmable buttons
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Awning Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleRow}>
              <h3>Awning Control</h3>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={accessories.awning.enabled}
                  onChange={(e) => updateAwning({ enabled: e.target.checked })}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <p className={styles.sectionDescription}>Motorized awning with optional LED lighting</p>
          </div>

          {accessories.awning.enabled && (
            <div className={styles.subsection}>
              {/* Control Type */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Control Type</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioCard}>
                    <input
                      type="radio"
                      name="awningControlType"
                      value="rvc"
                      checked={accessories.awning.controlType === 'rvc'}
                      onChange={(e) =>
                        updateAwning({ controlType: e.target.value as 'rvc' | 'analog' })
                      }
                    />
                    <div className={styles.radioContent}>
                      <div>
                        <strong>RV-C Protocol</strong>
                        <span>Digital control via RV-C network</span>
                      </div>
                    </div>
                  </label>

                  <label className={styles.radioCard}>
                    <input
                      type="radio"
                      name="awningControlType"
                      value="analog"
                      checked={accessories.awning.controlType === 'analog'}
                      onChange={(e) =>
                        updateAwning({ controlType: e.target.value as 'rvc' | 'analog' })
                      }
                    />
                    <div className={styles.radioContent}>
                      <div>
                        <strong>Analog Control</strong>
                        <span>Direct relay/switch control</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* LED Light */}
              <div className={styles.formGroup}>
                <label className={styles.checkboxCard}>
                  <input
                    type="checkbox"
                    checked={accessories.awning.light}
                    onChange={(e) => updateAwning({ light: e.target.checked })}
                  />
                  <div className={styles.checkboxContent}>
                    <div>
                      <strong>LED Awning Light</strong>
                      <span>Integrated LED strip lighting on awning</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}
        </section>

        {/* Slide-Outs Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleRow}>
              <h3>Slide-Out Rooms</h3>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={accessories.slides.enabled}
                  onChange={(e) => updateSlides({ enabled: e.target.checked })}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <p className={styles.sectionDescription}>
              Motorized slide-out room control and safety features
            </p>
          </div>

          {accessories.slides.enabled && (
            <div className={styles.subsection}>
              {/* Control Type */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Control Type</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioCard}>
                    <input
                      type="radio"
                      name="slidesControlType"
                      value="rvc"
                      checked={accessories.slides.controlType === 'rvc'}
                      onChange={(e) =>
                        updateSlides({ controlType: e.target.value as 'rvc' | 'analog' })
                      }
                    />
                    <div className={styles.radioContent}>
                      <div>
                        <strong>RV-C Protocol</strong>
                        <span>Digital control via RV-C network</span>
                      </div>
                    </div>
                  </label>

                  <label className={styles.radioCard}>
                    <input
                      type="radio"
                      name="slidesControlType"
                      value="analog"
                      checked={accessories.slides.controlType === 'analog'}
                      onChange={(e) =>
                        updateSlides({ controlType: e.target.value as 'rvc' | 'analog' })
                      }
                    />
                    <div className={styles.radioContent}>
                      <div>
                        <strong>Analog Control</strong>
                        <span>Direct relay/switch control</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Keypad Security */}
              <div className={styles.formGroup}>
                <label className={styles.checkboxCard}>
                  <input
                    type="checkbox"
                    checked={accessories.slides.keypadSecured}
                    onChange={(e) => updateSlides({ keypadSecured: e.target.checked })}
                  />
                  <div className={styles.checkboxContent}>
                    <div>
                      <strong>Keypad Security Lock</strong>
                      <span>Require keypad confirmation to operate slide-outs</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}
        </section>

        {/* ITC Lighting Module Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleRow}>
              <h3>ITC Lighting Module</h3>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={accessories.itcLighting.enabled}
                  onChange={(e) => updateItcLighting({ enabled: e.target.checked })}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <p className={styles.sectionDescription}>
              Intelligent Tactical Control modules for dimmable LED zone lighting
            </p>
          </div>

          {accessories.itcLighting.enabled && (
            <div className={styles.subsection}>
              {/* Number of Modules */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Number of ITC Modules
                  <span className={styles.helpText}>
                    How many ITC lighting modules are installed?
                  </span>
                </label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioCard}>
                    <input
                      type="radio"
                      name="itc-modules"
                      value="0"
                      checked={accessories.itcLighting.modules === 0}
                      onChange={() => updateItcLighting({ modules: 0 })}
                    />
                    <div className={styles.radioContent}>
                      <div className={styles.radioIcon}>0</div>
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
                      checked={accessories.itcLighting.modules === 1}
                      onChange={() => updateItcLighting({ modules: 1 })}
                    />
                    <div className={styles.radioContent}>
                      <div className={styles.radioIcon}>1</div>
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
                      checked={accessories.itcLighting.modules === 2}
                      onChange={() => updateItcLighting({ modules: 2 })}
                    />
                    <div className={styles.radioContent}>
                      <div className={styles.radioIcon}>2</div>
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
                      checked={accessories.itcLighting.modules === 3}
                      onChange={() => updateItcLighting({ modules: 3 })}
                    />
                    <div className={styles.radioContent}>
                      <div className={styles.radioIcon}>3</div>
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
                      checked={accessories.itcLighting.modules === 4}
                      onChange={() => updateItcLighting({ modules: 4 })}
                    />
                    <div className={styles.radioContent}>
                      <div className={styles.radioIcon}>4</div>
                      <div>
                        <strong>Four Modules</strong>
                        <span>Full ITC lighting system</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Zones Per Module */}
              {accessories.itcLighting.modules > 0 && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Zones Per Module
                    <span className={styles.helpText}>
                      How many lighting zones does each ITC module control?
                    </span>
                  </label>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioCard}>
                      <input
                        type="radio"
                        name="zones-per-module"
                        value="2"
                        checked={accessories.itcLighting.zonesPerModule === 2}
                        onChange={() => updateItcLighting({ zonesPerModule: 2 })}
                      />
                      <div className={styles.radioContent}>
                        <div className={styles.radioIcon}>2</div>
                        <div>
                          <strong>2 Zones</strong>
                          <span>
                            {accessories.itcLighting.modules}{' '}
                            {accessories.itcLighting.modules === 1 ? 'module' : 'modules'} ={' '}
                            {accessories.itcLighting.modules * 2} total zones
                          </span>
                        </div>
                      </div>
                    </label>

                    <label className={styles.radioCard}>
                      <input
                        type="radio"
                        name="zones-per-module"
                        value="4"
                        checked={accessories.itcLighting.zonesPerModule === 4}
                        onChange={() => updateItcLighting({ zonesPerModule: 4 })}
                      />
                      <div className={styles.radioContent}>
                        <div className={styles.radioIcon}>4</div>
                        <div>
                          <strong>4 Zones</strong>
                          <span>
                            {accessories.itcLighting.modules}{' '}
                            {accessories.itcLighting.modules === 1 ? 'module' : 'modules'} ={' '}
                            {accessories.itcLighting.modules * 4} total zones
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Summary Section */}
        <section className={styles.summarySector}>
          <h3>📋 Accessories Summary</h3>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Control Keypads</div>
              <div className={styles.summaryValue}>
                {accessories.keypad.enabled ? (
                  <>
                    {accessories.keypad.count} keypad{accessories.keypad.count > 1 ? 's' : ''} (
                    {accessories.keypad.count * accessories.keypad.buttonsPerKeypad} buttons)
                  </>
                ) : (
                  'Disabled'
                )}
              </div>
            </div>

            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Awning</div>
              <div className={styles.summaryValue}>
                {accessories.awning.enabled ? (
                  <>
                    {accessories.awning.controlType.toUpperCase()}
                    {accessories.awning.light && ' + LED'}
                  </>
                ) : (
                  'Disabled'
                )}
              </div>
            </div>

            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Slide-Outs</div>
              <div className={styles.summaryValue}>
                {accessories.slides.enabled ? (
                  <>
                    {accessories.slides.controlType.toUpperCase()}
                    {accessories.slides.keypadSecured && ' 🔒'}
                  </>
                ) : (
                  'Disabled'
                )}
              </div>
            </div>

            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>ITC Lighting</div>
              <div className={styles.summaryValue}>
                {accessories.itcLighting.enabled ? (
                  accessories.itcLighting.modules > 0 ? (
                    <>
                      {accessories.itcLighting.modules}{' '}
                      {accessories.itcLighting.modules === 1 ? 'module' : 'modules'} (
                      {accessories.itcLighting.modules * accessories.itcLighting.zonesPerModule}{' '}
                      zones)
                    </>
                  ) : (
                    'Enabled (no modules)'
                  )
                ) : (
                  'Disabled'
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
