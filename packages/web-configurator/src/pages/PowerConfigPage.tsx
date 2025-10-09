import { useSchema } from '../context/SchemaContext';
import type { PowerConfig } from '@gcg/schema';
import styles from './PowerConfigPage.module.css';

export default function PowerConfigPage() {
  const { schema, updateSchema } = useSchema();

  if (!schema) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No schema loaded</div>
      </div>
    );
  }

  const power = schema.power || {
    dcCharging: { secondAlternator: false, orionXs: false },
    solar: { enabled: false, primaryArray: true, auxiliaryArray: false },
    batteryManagement: 'victron' as const,
    acLegs: 2,
    multiplus: { l1: false, l2: false },
  };

  const updatePower = (updates: Partial<PowerConfig>) => {
    updateSchema({
      ...schema,
      power: {
        ...power,
        ...updates,
      },
    });
  };

  const updateDcCharging = (field: 'secondAlternator' | 'orionXs', value: boolean) => {
    updatePower({
      dcCharging: {
        ...power.dcCharging,
        [field]: value,
      },
    });
  };

  const updateSolar = (updates: Partial<PowerConfig['solar']>) => {
    const newSolar = {
      ...power.solar,
      ...updates,
    };

    // When enabling solar, always enable primary array
    if (updates.enabled === true) {
      newSolar.primaryArray = true;
    }

    // When disabling solar, disable auxiliary array too
    if (updates.enabled === false) {
      newSolar.auxiliaryArray = false;
    }

    updatePower({
      solar: newSolar,
    });
  };

  const updateMultiplus = (leg: 'l1' | 'l2', value: boolean) => {
    updatePower({
      multiplus: {
        ...power.multiplus,
        [leg]: value,
      },
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Power System Configuration</h2>
        <p className={styles.subtitle}>
          Configure DC charging sources, AC power distribution, and inverter/charger settings
        </p>
      </header>

      <div className={styles.content}>
        {/* DC Charging Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>DC Charging Sources</h3>
            <p className={styles.sectionDescription}>
              Select additional DC charging sources beyond the primary alternator
            </p>
          </div>

          <div className={styles.optionGrid}>
            <label className={styles.checkboxCard}>
              <input
                type="checkbox"
                checked={power.dcCharging.secondAlternator}
                onChange={(e) => updateDcCharging('secondAlternator', e.target.checked)}
              />
              <div className={styles.checkboxContent}>
                <div className={styles.checkboxLabel}>
                  <strong>Second Alternator</strong>
                  <span>Dedicated house battery alternator</span>
                </div>
              </div>
              <div
                className={`${styles.checkmark} ${power.dcCharging.secondAlternator ? styles.checked : ''}`}
              >
                ✓
              </div>
            </label>

            <label className={styles.checkboxCard}>
              <input
                type="checkbox"
                checked={power.dcCharging.orionXs}
                onChange={(e) => updateDcCharging('orionXs', e.target.checked)}
              />
              <div className={styles.checkboxContent}>
                <div className={styles.checkboxLabel}>
                  <strong>Orion XS DC-DC Charger</strong>
                  <span>Victron smart DC-DC charger</span>
                </div>
              </div>
              <div
                className={`${styles.checkmark} ${power.dcCharging.orionXs ? styles.checked : ''}`}
              >
                ✓
              </div>
            </label>
          </div>

          {(power.dcCharging.secondAlternator || power.dcCharging.orionXs) && (
            <div className={styles.infoBox}>
              <strong>ℹ️ Note:</strong> DC charging sources will be monitored via EmpirBus signals.
              Ensure proper wiring and sensor configuration.
            </div>
          )}
        </section>

        {/* Solar Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleRow}>
              <div>
                <h3>Solar Power System</h3>
                <p className={styles.sectionDescription}>Configure solar array charging system</p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={power.solar.enabled}
                  onChange={(e) => updateSolar({ enabled: e.target.checked })}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          {power.solar.enabled && (
            <>
              <div className={styles.optionGrid}>
                <label className={styles.checkboxCard}>
                  <input
                    type="checkbox"
                    checked={power.solar.primaryArray}
                    disabled={true} // Always enabled when solar is on
                  />
                  <div className={styles.checkboxContent}>
                    <div className={styles.checkboxLabel}>
                      <strong>Primary Array</strong>
                      <span>Main solar array (always included)</span>
                    </div>
                  </div>
                  <div className={`${styles.checkmark} ${styles.checked}`}>✓</div>
                </label>

                <label className={styles.checkboxCard}>
                  <input
                    type="checkbox"
                    checked={power.solar.auxiliaryArray}
                    onChange={(e) => updateSolar({ auxiliaryArray: e.target.checked })}
                  />
                  <div className={styles.checkboxContent}>
                    <div className={styles.checkboxLabel}>
                      <strong>Auxiliary Array</strong>
                      <span>Additional solar array</span>
                    </div>
                  </div>
                  <div
                    className={`${styles.checkmark} ${power.solar.auxiliaryArray ? styles.checked : ''}`}
                  >
                    ✓
                  </div>
                </label>
              </div>

              <div className={styles.infoBox}>
                <strong>ℹ️ Note:</strong> Solar arrays will be monitored via Victron SmartSolar MPPT
                controllers connected to Venus GX/Cerbo GX.
              </div>
            </>
          )}
        </section>

        {/* Battery Management Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Battery Management System</h3>
            <p className={styles.sectionDescription}>
              Select your battery management system (BMS) brand
            </p>
          </div>

          <div className={styles.radioGroup}>
            <label className={styles.radioCard}>
              <input
                type="radio"
                name="batteryManagement"
                value="victron"
                checked={power.batteryManagement === 'victron'}
                onChange={() => updatePower({ batteryManagement: 'victron' })}
              />
              <div className={styles.radioContent}>
                <div>
                  <strong>Victron Energy</strong>
                  <span>SmartShunt & BMV battery monitors</span>
                </div>
              </div>
            </label>

            <label className={styles.radioCard}>
              <input
                type="radio"
                name="batteryManagement"
                value="expion"
                checked={power.batteryManagement === 'expion'}
                onChange={() => updatePower({ batteryManagement: 'expion' })}
              />
              <div className={styles.radioContent}>
                <div>
                  <strong>Expion360</strong>
                  <span>VPR 4Ever lithium batteries with BMS</span>
                </div>
              </div>
            </label>

            <label className={styles.radioCard}>
              <input
                type="radio"
                name="batteryManagement"
                value="battleborn"
                checked={power.batteryManagement === 'battleborn'}
                onChange={() => updatePower({ batteryManagement: 'battleborn' })}
              />
              <div className={styles.radioContent}>
                <div>
                  <strong>Battle Born</strong>
                  <span>LiFePO4 batteries with integrated BMS</span>
                </div>
              </div>
            </label>

            <label className={styles.radioCard}>
              <input
                type="radio"
                name="batteryManagement"
                value="discover"
                checked={power.batteryManagement === 'discover'}
                onChange={() => updatePower({ batteryManagement: 'discover' })}
              />
              <div className={styles.radioContent}>
                <div>
                  <strong>Discover Battery</strong>
                  <span>AES lithium batteries with BMS</span>
                </div>
              </div>
            </label>
          </div>

          <div className={styles.infoBox}>
            <strong>ℹ️ Note:</strong> Battery data will be monitored via{' '}
            {power.batteryManagement === 'victron' &&
              'VE.Direct or VE.Can connections to Venus GX/Cerbo GX'}
            {power.batteryManagement === 'expion' &&
              'CAN bus integration with proprietary Expion protocol'}
            {power.batteryManagement === 'battleborn' && 'Bluetooth or CAN bus monitoring system'}
            {power.batteryManagement === 'discover' && 'RS485 or CAN bus communication protocol'}.
          </div>
        </section>

        {/* AC Power Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>AC Power Distribution</h3>
            <p className={styles.sectionDescription}>
              Configure shore power and AC distribution legs
            </p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="acLegs" className={styles.label}>
              <strong>Number of AC Legs</strong>
              <span className={styles.labelDescription}>
                Single-phase (1 leg) or split-phase (2 legs) AC distribution
              </span>
            </label>
            <div className={styles.radioGroup}>
              <label className={styles.radioCard}>
                <input
                  type="radio"
                  name="acLegs"
                  value="1"
                  checked={power.acLegs === 1}
                  onChange={() => updatePower({ acLegs: 1 })}
                />
                <div className={styles.radioContent}>
                  <div>
                    <strong>Single-Phase</strong>
                    <span>120V single leg (European/small systems)</span>
                  </div>
                </div>
              </label>

              <label className={styles.radioCard}>
                <input
                  type="radio"
                  name="acLegs"
                  value="2"
                  checked={power.acLegs === 2}
                  onChange={() => updatePower({ acLegs: 2 })}
                />
                <div className={styles.radioContent}>
                  <div>
                    <strong>Split-Phase</strong>
                    <span>120/240V dual legs (North American standard)</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Multiplus Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Multiplus Inverter/Charger</h3>
            <p className={styles.sectionDescription}>
              Configure Victron Multiplus units for each AC leg
            </p>
          </div>

          <div className={styles.optionGrid}>
            <label className={styles.checkboxCard}>
              <input
                type="checkbox"
                checked={power.multiplus.l1}
                onChange={(e) => updateMultiplus('l1', e.target.checked)}
              />
              <div className={styles.checkboxContent}>
                <div className={styles.checkboxLabel}>
                  <strong>Multiplus L1</strong>
                  <span>Inverter/charger on first AC leg</span>
                </div>
              </div>
              <div className={`${styles.checkmark} ${power.multiplus.l1 ? styles.checked : ''}`}>
                ✓
              </div>
            </label>

            <label
              className={`${styles.checkboxCard} ${power.acLegs === 1 ? styles.disabled : ''}`}
            >
              <input
                type="checkbox"
                checked={power.multiplus.l2}
                onChange={(e) => updateMultiplus('l2', e.target.checked)}
                disabled={power.acLegs === 1}
              />
              <div className={styles.checkboxContent}>
                <div className={styles.checkboxLabel}>
                  <strong>Multiplus L2</strong>
                  <span>
                    {power.acLegs === 1
                      ? 'Requires 2 AC legs'
                      : 'Inverter/charger on second AC leg'}
                  </span>
                </div>
              </div>
              <div className={`${styles.checkmark} ${power.multiplus.l2 ? styles.checked : ''}`}>
                ✓
              </div>
            </label>
          </div>

          {(power.multiplus.l1 || power.multiplus.l2) && (
            <div className={styles.infoBox}>
              <strong>ℹ️ Note:</strong> Multiplus units require VE.Bus connection to Venus GX/Cerbo
              GX for monitoring and control.
            </div>
          )}
        </section>

        {/* Summary Section */}
        <section className={styles.summarySector}>
          <h3>📋 Configuration Summary</h3>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>DC Charging Sources</div>
              <div className={styles.summaryValue}>
                {power.dcCharging.secondAlternator || power.dcCharging.orionXs ? (
                  <ul>
                    <li>Primary Alternator (standard)</li>
                    {power.dcCharging.secondAlternator && <li>Second Alternator</li>}
                    {power.dcCharging.orionXs && <li>Orion XS DC-DC Charger</li>}
                  </ul>
                ) : (
                  'Primary Alternator only'
                )}
              </div>
            </div>

            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Solar Power</div>
              <div className={styles.summaryValue}>
                {power.solar.enabled ? (
                  <ul>
                    <li>Primary Array</li>
                    {power.solar.auxiliaryArray && <li>Auxiliary Array</li>}
                  </ul>
                ) : (
                  'Not configured'
                )}
              </div>
            </div>

            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Battery Management</div>
              <div className={styles.summaryValue}>
                {power.batteryManagement === 'victron' && 'Victron Energy'}
                {power.batteryManagement === 'expion' && 'Expion360'}
                {power.batteryManagement === 'battleborn' && 'Battle Born'}
                {power.batteryManagement === 'discover' && 'Discover Battery'}
              </div>
            </div>

            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>AC Power</div>
              <div className={styles.summaryValue}>
                {power.acLegs === 1 ? 'Single-Phase (1 leg)' : 'Split-Phase (2 legs)'}
              </div>
            </div>

            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Inverter/Chargers</div>
              <div className={styles.summaryValue}>
                {power.multiplus.l1 || power.multiplus.l2 ? (
                  <ul>
                    {power.multiplus.l1 && <li>Multiplus L1</li>}
                    {power.multiplus.l2 && <li>Multiplus L2</li>}
                  </ul>
                ) : (
                  'None configured'
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
