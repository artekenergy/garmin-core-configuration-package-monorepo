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
    const updatedHVAC = {
      ...hvac,
      ...updates,
    };

    // Auto-sync hvacTab subtabs based on HVAC system configuration
    const hvacTab = {
      heating: {
        enabled: updatedHVAC.heating.enabled,
        title: schema.hvacTab?.heating?.title || 'Heating',
        icon: schema.hvacTab?.heating?.icon || '🔥',
      },
      cooling: {
        enabled: updatedHVAC.cooling.enabled,
        title: schema.hvacTab?.cooling?.title || 'Cooling',
        icon: schema.hvacTab?.cooling?.icon || '❄️',
      },
      ventilation: {
        enabled: updatedHVAC.ventilation.enabled,
        title: schema.hvacTab?.ventilation?.title || 'Ventilation',
        icon: schema.hvacTab?.ventilation?.icon || '💨',
      },
    };

    updateSchema({
      ...schema,
      hvac: updatedHVAC,
      hvacTab,
    });
  };

  const updateHeating = (updates: Partial<HVACConfig['heating']>) => {
    updateHVAC({
      heating: {
        ...hvac.heating,
        ...updates,
      },
    });
  };

  const updateHeatingSource = (source: 'diesel' | 'electric' | 'engine', value: boolean) => {
    updateHeating({
      sources: {
        ...hvac.heating.sources,
        [source]: value,
      },
    });
  };

  const updateHeatingDistribution = (type: 'floor' | 'fans', value: boolean) => {
    updateHeating({
      distribution: {
        ...hvac.heating.distribution,
        [type]: value,
      },
    });
  };

  const updateHeatingOption = (option: 'hotWater' | 'auxZone', value: boolean) => {
    updateHeating({
      [option]: value,
    });
  };

  const updateCooling = (updates: Partial<HVACConfig['cooling']>) => {
    updateHVAC({
      cooling: {
        ...hvac.cooling,
        ...updates,
      },
    });
  };

  const updateVentilation = (updates: Partial<HVACConfig['ventilation']>) => {
    updateHVAC({
      ventilation: {
        ...hvac.ventilation,
        ...updates,
      },
    });
  };

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
            <div className={styles.titleRow}>
              <h3>Heating System</h3>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={hvac.heating.enabled}
                  onChange={(e) => updateHeating({ enabled: e.target.checked })}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <p className={styles.sectionDescription}>
              Select heat sources, distribution methods, and additional heating features
            </p>
          </div>

          {hvac.heating.enabled && (
            <>
              <div className={styles.subsection}>
                <h4 className={styles.subsectionTitle}>Heat Sources</h4>
                <div className={styles.toggleCardGrid}>
                  <div className={styles.toggleCard}>
                    <div className={styles.toggleCardContent}>
                      <div className={styles.toggleCardLabel}>
                        <strong>Diesel Heater</strong>
                        <span>Webasto/Espar hydronic heating</span>
                      </div>
                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={hvac.heating.sources.diesel}
                        onChange={(e) => updateHeatingSource('diesel', e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>

                  <div className={styles.toggleCard}>
                    <div className={styles.toggleCardContent}>
                      <div className={styles.toggleCardLabel}>
                        <strong>Electric Heater</strong>
                        <span>Shore power electric heating</span>
                      </div>
                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={hvac.heating.sources.electric}
                        onChange={(e) => updateHeatingSource('electric', e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>

                  <div className={styles.toggleCard}>
                    <div className={styles.toggleCardContent}>
                      <div className={styles.toggleCardLabel}>
                        <strong>Engine Heat</strong>
                        <span>Coolant-based engine heat recirculation</span>
                      </div>
                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={hvac.heating.sources.engine}
                        onChange={(e) => updateHeatingSource('engine', e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                </div>
              </div>

              {hasAnyHeatingSource && (
                <>
                  <div className={styles.subsection}>
                    <h4 className={styles.subsectionTitle}>Heat Distribution</h4>
                    <div className={styles.toggleCardGrid}>
                      <div className={styles.toggleCard}>
                        <div className={styles.toggleCardContent}>
                          <div className={styles.toggleCardLabel}>
                            <strong>Floor Heating</strong>
                            <span>In-floor radiant heating</span>
                          </div>
                        </div>
                        <label className={styles.switch}>
                          <input
                            type="checkbox"
                            checked={hvac.heating.distribution.floor}
                            onChange={(e) => updateHeatingDistribution('floor', e.target.checked)}
                          />
                          <span className={styles.slider}></span>
                        </label>
                      </div>

                      <div className={styles.toggleCard}>
                        <div className={styles.toggleCardContent}>
                          <div className={styles.toggleCardLabel}>
                            <strong>Forced Air Fans</strong>
                            <span>Ducted fan distribution system</span>
                          </div>
                        </div>
                        <label className={styles.switch}>
                          <input
                            type="checkbox"
                            checked={hvac.heating.distribution.fans}
                            onChange={(e) => updateHeatingDistribution('fans', e.target.checked)}
                          />
                          <span className={styles.slider}></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className={styles.subsection}>
                    <h4 className={styles.subsectionTitle}>Additional Features</h4>
                    <div className={styles.toggleCardGrid}>
                      <div className={styles.toggleCard}>
                        <div className={styles.toggleCardContent}>
                          <div className={styles.toggleCardLabel}>
                            <strong>Hot Water</strong>
                            <span>Aquahot/hydronic water heating</span>
                          </div>
                        </div>
                        <label className={styles.switch}>
                          <input
                            type="checkbox"
                            checked={hvac.heating.hotWater}
                            onChange={(e) => updateHeatingOption('hotWater', e.target.checked)}
                          />
                          <span className={styles.slider}></span>
                        </label>
                      </div>

                      <div className={styles.toggleCard}>
                        <div className={styles.toggleCardContent}>
                          <div className={styles.toggleCardLabel}>
                            <strong>Auxiliary Zone</strong>
                            <span>Separate bedroom/rear heating zone</span>
                          </div>
                        </div>
                        <label className={styles.switch}>
                          <input
                            type="checkbox"
                            checked={hvac.heating.auxZone}
                            onChange={(e) => updateHeatingOption('auxZone', e.target.checked)}
                          />
                          <span className={styles.slider}></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </section>

        {/* Cooling Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleRow}>
              <h3>Air Conditioning</h3>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={hvac.cooling.enabled}
                  onChange={(e) => updateCooling({ enabled: e.target.checked })}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <p className={styles.sectionDescription}>Select your A/C system brand</p>
          </div>

          {hvac.cooling.enabled && (
            <div className={styles.radioGroup}>
              <label className={styles.radioCard}>
                <input
                  type="radio"
                  name="cooling"
                  value="recpro"
                  checked={hvac.cooling.brand === 'recpro'}
                  onChange={() => updateCooling({ brand: 'recpro' })}
                />
                <div className={styles.radioContent}>
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
                  onChange={() => updateCooling({ brand: 'truma' })}
                />
                <div className={styles.radioContent}>
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
                  onChange={() => updateCooling({ brand: 'cruisencomfort' })}
                />
                <div className={styles.radioContent}>
                  <div>
                    <strong>Cruise-n-Comfort</strong>
                    <span>Marine-grade rooftop A/C</span>
                  </div>
                </div>
              </label>
            </div>
          )}
        </section>

        {/* Ventilation Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleRow}>
              <h3>Ventilation</h3>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={hvac.ventilation.enabled}
                  onChange={(e) => updateVentilation({ enabled: e.target.checked })}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <p className={styles.sectionDescription}>
              Configure roof ventilation fans (MaxxAir, Fantastic Fan, etc.)
            </p>
          </div>

          {hvac.ventilation.enabled && (
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
                    value="1"
                    checked={hvac.ventilation.fans === 1}
                    onChange={() => updateVentilation({ fans: 1 })}
                  />
                  <div className={styles.radioContent}>
                    <div className={styles.radioIcon}>1</div>
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
                    onChange={() => updateVentilation({ fans: 2 })}
                  />
                  <div className={styles.radioContent}>
                    <div className={styles.radioIcon}>2</div>
                    <div>
                      <strong>Two Fans</strong>
                      <span>Front and rear ventilation</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}
        </section>

        {/* Summary Section */}
        <section className={styles.summarySector}>
          <h3>📋 HVAC Configuration Summary</h3>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Heating</div>
              <div className={styles.summaryValue}>
                {hvac.heating.enabled ? (
                  hasAnyHeatingSource ? (
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
                    'Enabled (no sources selected)'
                  )
                ) : (
                  'Disabled'
                )}
              </div>
            </div>

            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Cooling</div>
              <div className={styles.summaryValue}>
                {hvac.cooling.enabled ? (
                  hvac.cooling.brand ? (
                    <>
                      {hvac.cooling.brand === 'recpro' && 'RecPro'}
                      {hvac.cooling.brand === 'truma' && 'Truma Aventa'}
                      {hvac.cooling.brand === 'cruisencomfort' && 'Cruise-n-Comfort'}
                    </>
                  ) : (
                    'Enabled (no brand selected)'
                  )
                ) : (
                  'Disabled'
                )}
              </div>
            </div>

            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Ventilation</div>
              <div className={styles.summaryValue}>
                {hvac.ventilation.enabled ? (
                  <>
                    {hvac.ventilation.fans} roof fan{hvac.ventilation.fans > 1 ? 's' : ''}
                  </>
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
