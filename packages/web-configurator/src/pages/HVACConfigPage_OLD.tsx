import { useSchema } from '../context/SchemaContext';
import type { HVACConfig } from '@gcg/schema';
import styles from './HVACConfigPage.module.css';

export default function HVACConfigPage() {
  const { schema, updateSchema } = useSchema();

  if (!schema) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No schema loaded</div>
      </div>
    );
  }

  const hvac = schema.hvac || {
    heating: {
      enabled: false,
      sources: { diesel: false, electric: false, engine: false },
      distribution: { floor: false, fans: false },
      hotWater: false,
      auxZone: false,
    },
    cooling: { enabled: false, brand: '' },
    ventilation: { enabled: false, fans: 1 },
  };

  const updateHVAC = (updates: Partial<HVACConfig>) => {
    updateSchema({
      ...schema,
      hvac: {
        ...hvac,
        ...updates,
      },
    });
  };

  const updateHeatingSource = (source: 'diesel' | 'electric' | 'engine', value: boolean) => {
    updateHVAC({
      heating: {
        ...hvac.heating,
        sources: {
          ...hvac.heating.sources,
          [source]: value,
        },
      },
    });
  };

  const updateHeatingDistribution = (type: 'floor' | 'fans', value: boolean) => {
    updateHVAC({
      heating: {
        ...hvac.heating,
        distribution: {
          ...hvac.heating.distribution,
          [type]: value,
        },
      },
    });
  };

  const updateHeatingOption = (option: 'hotWater' | 'auxZone', value: boolean) => {
    updateHVAC({
      heating: {
        ...hvac.heating,
        [option]: value,
      },
    });
  };

  const hasAnyCooling = hvac.cooling.brand !== '';
  const hasAnyHeatingSource =
    hvac.heating.sources.diesel || hvac.heating.sources.electric || hvac.heating.sources.engine;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>HVAC System Configuration</h2>
        <p className={styles.subtitle}>
          Configure heating, cooling, and ventilation systems for climate control
        </p>
      </header>

      <div className={styles.content}>
        {/* Heating Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>🔥 Heating System</h3>
            <p className={styles.sectionDescription}>
              Select heat sources, distribution methods, and additional heating features
            </p>
          </div>

          <div className={styles.subsection}>
            <h4 className={styles.subsectionTitle}>Heat Sources</h4>
            <div className={styles.optionGrid}>
              <label className={styles.checkboxCard}>
                <input
                  type="checkbox"
                  checked={hvac.heating.sources.diesel}
                  onChange={(e) => updateHeatingSource('diesel', e.target.checked)}
                />
                <div className={styles.checkboxContent}>
                  <div className={styles.checkboxIcon}>⛽</div>
                  <div className={styles.checkboxLabel}>
                    <strong>Diesel Heater</strong>
                    <span>Webasto/Espar hydronic heating</span>
                  </div>
                </div>
                <div
                  className={`${styles.checkmark} ${hvac.heating.sources.diesel ? styles.checked : ''}`}
                >
                  ✓
                </div>
              </label>

              <label className={styles.checkboxCard}>
                <input
                  type="checkbox"
                  checked={hvac.heating.sources.electric}
                  onChange={(e) => updateHeatingSource('electric', e.target.checked)}
                />
                <div className={styles.checkboxContent}>
                  <div className={styles.checkboxIcon}>⚡</div>
                  <div className={styles.checkboxLabel}>
                    <strong>Electric Heater</strong>
                    <span>Shore power electric heating</span>
                  </div>
                </div>
                <div
                  className={`${styles.checkmark} ${hvac.heating.sources.electric ? styles.checked : ''}`}
                >
                  ✓
                </div>
              </label>

              <label className={styles.checkboxCard}>
                <input
                  type="checkbox"
                  checked={hvac.heating.sources.engine}
                  onChange={(e) => updateHeatingSource('engine', e.target.checked)}
                />
                <div className={styles.checkboxContent}>
                  <div className={styles.checkboxIcon}>🚗</div>
                  <div className={styles.checkboxLabel}>
                    <strong>Engine Heat</strong>
                    <span>Coolant-based engine heat recirculation</span>
                  </div>
                </div>
                <div
                  className={`${styles.checkmark} ${hvac.heating.sources.engine ? styles.checked : ''}`}
                >
                  ✓
                </div>
              </label>
            </div>
          </div>

          {hasAnyHeatingSource && (
            <>
              <div className={styles.subsection}>
                <h4 className={styles.subsectionTitle}>Heat Distribution</h4>
                <div className={styles.optionGrid}>
                  <label className={styles.checkboxCard}>
                    <input
                      type="checkbox"
                      checked={hvac.heating.distribution.floor}
                      onChange={(e) => updateHeatingDistribution('floor', e.target.checked)}
                    />
                    <div className={styles.checkboxContent}>
                      <div className={styles.checkboxIcon}>🏠</div>
                      <div className={styles.checkboxLabel}>
                        <strong>Floor Heating</strong>
                        <span>Radiant floor heating system</span>
                      </div>
                    </div>
                    <div
                      className={`${styles.checkmark} ${hvac.heating.distribution.floor ? styles.checked : ''}`}
                    >
                      ✓
                    </div>
                  </label>

                  <label className={styles.checkboxCard}>
                    <input
                      type="checkbox"
                      checked={hvac.heating.distribution.fans}
                      onChange={(e) => updateHeatingDistribution('fans', e.target.checked)}
                    />
                    <div className={styles.checkboxContent}>
                      <div className={styles.checkboxIcon}>💨</div>
                      <div className={styles.checkboxLabel}>
                        <strong>Fan Distribution</strong>
                        <span>Forced air heating via fans</span>
                      </div>
                    </div>
                    <div
                      className={`${styles.checkmark} ${hvac.heating.distribution.fans ? styles.checked : ''}`}
                    >
                      ✓
                    </div>
                  </label>
                </div>
              </div>

              <div className={styles.subsection}>
                <h4 className={styles.subsectionTitle}>Additional Features</h4>
                <div className={styles.optionGrid}>
                  <label className={styles.checkboxCard}>
                    <input
                      type="checkbox"
                      checked={hvac.heating.hotWater}
                      onChange={(e) => updateHeatingOption('hotWater', e.target.checked)}
                    />
                    <div className={styles.checkboxContent}>
                      <div className={styles.checkboxIcon}>🚿</div>
                      <div className={styles.checkboxLabel}>
                        <strong>Hot Water</strong>
                        <span>Water heater integration</span>
                      </div>
                    </div>
                    <div
                      className={`${styles.checkmark} ${hvac.heating.hotWater ? styles.checked : ''}`}
                    >
                      ✓
                    </div>
                  </label>

                  <label className={styles.checkboxCard}>
                    <input
                      type="checkbox"
                      checked={hvac.heating.auxZone}
                      onChange={(e) => updateHeatingOption('auxZone', e.target.checked)}
                    />
                    <div className={styles.checkboxContent}>
                      <div className={styles.checkboxIcon}>🛏️</div>
                      <div className={styles.checkboxLabel}>
                        <strong>Auxiliary Zone</strong>
                        <span>Separate bedroom/rear heating zone</span>
                      </div>
                    </div>
                    <div
                      className={`${styles.checkmark} ${hvac.heating.auxZone ? styles.checked : ''}`}
                    >
                      ✓
                    </div>
                  </label>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Cooling Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>❄️ Air Conditioning</h3>
            <p className={styles.sectionDescription}>Select your A/C system brand</p>
          </div>

          <div className={styles.radioGroup}>
            <label className={styles.radioCard}>
              <input
                type="radio"
                name="cooling"
                value=""
                checked={hvac.cooling.brand === ''}
                onChange={() => updateHVAC({ cooling: { brand: '' } })}
              />
              <div className={styles.radioContent}>
                <div className={styles.radioIcon}>🚫</div>
                <div>
                  <strong>No A/C System</strong>
                  <span>No air conditioning installed</span>
                </div>
              </div>
            </label>

            <label className={styles.radioCard}>
              <input
                type="radio"
                name="cooling"
                value="recpro"
                checked={hvac.cooling.brand === 'recpro'}
                onChange={() => updateHVAC({ cooling: { brand: 'recpro' } })}
              />
              <div className={styles.radioContent}>
                <div className={styles.radioIcon}>🏭</div>
                <div>
                  <strong>RecPro</strong>
                  <span>RecPro RV air conditioner</span>
                </div>
              </div>
            </label>

            <label className={styles.radioCard}>
              <input
                type="radio"
                name="cooling"
                value="truma"
                checked={hvac.cooling.brand === 'truma'}
                onChange={() => updateHVAC({ cooling: { brand: 'truma' } })}
              />
              <div className={styles.radioContent}>
                <div className={styles.radioIcon}>🇩🇪</div>
                <div>
                  <strong>Truma</strong>
                  <span>Truma Aventa comfort A/C</span>
                </div>
              </div>
            </label>

            <label className={styles.radioCard}>
              <input
                type="radio"
                name="cooling"
                value="cruisencomfort"
                checked={hvac.cooling.brand === 'cruisencomfort'}
                onChange={() => updateHVAC({ cooling: { brand: 'cruisencomfort' } })}
              />
              <div className={styles.radioContent}>
                <div className={styles.radioIcon}>🌊</div>
                <div>
                  <strong>Cruise-n-Comfort</strong>
                  <span>Marine-grade rooftop A/C</span>
                </div>
              </div>
            </label>
          </div>
        </section>

        {/* Ventilation Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>💨 Ventilation</h3>
            <p className={styles.sectionDescription}>
              Configure roof ventilation fans (MaxxAir, Fantastic Fan, etc.)
            </p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fans" className={styles.label}>
              <strong>Number of Roof Fans</strong>
              <span className={styles.labelDescription}>
                How many powered roof ventilation fans are installed?
              </span>
            </label>
            <div className={styles.radioGroup}>
              <label className={styles.radioCard}>
                <input
                  type="radio"
                  name="fans"
                  value="0"
                  checked={hvac.ventilation.fans === 0}
                  onChange={() => updateHVAC({ ventilation: { fans: 0 } })}
                />
                <div className={styles.radioContent}>
                  <div className={styles.radioIcon}>0️⃣</div>
                  <div>
                    <strong>None</strong>
                    <span>No powered roof fans</span>
                  </div>
                </div>
              </label>

              <label className={styles.radioCard}>
                <input
                  type="radio"
                  name="fans"
                  value="1"
                  checked={hvac.ventilation.fans === 1}
                  onChange={() => updateHVAC({ ventilation: { fans: 1 } })}
                />
                <div className={styles.radioContent}>
                  <div className={styles.radioIcon}>1️⃣</div>
                  <div>
                    <strong>One Fan</strong>
                    <span>Single roof ventilation fan</span>
                  </div>
                </div>
              </label>

              <label className={styles.radioCard}>
                <input
                  type="radio"
                  name="fans"
                  value="2"
                  checked={hvac.ventilation.fans === 2}
                  onChange={() => updateHVAC({ ventilation: { fans: 2 } })}
                />
                <div className={styles.radioContent}>
                  <div className={styles.radioIcon}>2️⃣</div>
                  <div>
                    <strong>Two Fans</strong>
                    <span>Front and rear ventilation</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Summary Section */}
        <section className={styles.summarySector}>
          <h3>📋 HVAC Configuration Summary</h3>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Heating</div>
              <div className={styles.summaryValue}>
                {hasAnyHeatingSource ? (
                  <ul>
                    {hvac.heating.sources.diesel && <li>Diesel heater</li>}
                    {hvac.heating.sources.electric && <li>Electric heater</li>}
                    {hvac.heating.sources.engine && <li>Engine heat</li>}
                    {hvac.heating.distribution.floor && <li>+ Floor heating</li>}
                    {hvac.heating.distribution.fans && <li>+ Fan distribution</li>}
                    {hvac.heating.hotWater && <li>+ Hot water</li>}
                    {hvac.heating.auxZone && <li>+ Aux zone</li>}
                  </ul>
                ) : (
                  'No heating configured'
                )}
              </div>
            </div>

            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Cooling</div>
              <div className={styles.summaryValue}>
                {hasAnyCooling ? (
                  <>
                    {hvac.cooling.brand === 'recpro' && 'RecPro A/C'}
                    {hvac.cooling.brand === 'truma' && 'Truma Aventa'}
                    {hvac.cooling.brand === 'cruisencomfort' && 'Cruise-n-Comfort'}
                  </>
                ) : (
                  'No A/C system'
                )}
              </div>
            </div>

            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Ventilation</div>
              <div className={styles.summaryValue}>
                {hvac.ventilation.fans === 0 && 'No roof fans'}
                {hvac.ventilation.fans === 1 && '1 roof fan'}
                {hvac.ventilation.fans === 2 && '2 roof fans'}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
