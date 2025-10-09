import { useSchema } from '../context/SchemaContext';
import type { PlumbingConfig, PlumbingTank } from '@gcg/schema';
import styles from './PlumbingConfigPage.module.css';

export default function PlumbingConfigPage() {
  const { schema, updateSchema } = useSchema();

  if (!schema) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No schema loaded</div>
      </div>
    );
  }

  const plumbing = schema.plumbing || {
    enabled: true,
    monitoringSource: 'cerbo-gx' as const,
    count: 3,
    tanks: [
      { type: 'fresh' as const, name: '' },
      { type: 'waste' as const, name: '' },
      { type: 'black' as const, name: '' },
    ],
  };

  const updatePlumbing = (updates: Partial<PlumbingConfig>) => {
    updateSchema({
      ...schema,
      plumbing: {
        ...plumbing,
        ...updates,
      },
    });
  };

  const updateTankCount = (count: number) => {
    // Adjust tank array to match new count
    const currentTanks = [...plumbing.tanks];

    if (count > currentTanks.length) {
      // Add tanks
      const tanksToAdd = count - currentTanks.length;
      for (let i = 0; i < tanksToAdd; i++) {
        currentTanks.push({ type: 'fresh', name: '' });
      }
    } else if (count < currentTanks.length) {
      // Remove tanks from end
      currentTanks.splice(count);
    }

    updatePlumbing({
      count,
      tanks: currentTanks,
    });
  };

  const updateTank = (index: number, updates: Partial<PlumbingTank>) => {
    const newTanks = [...plumbing.tanks];
    newTanks[index] = { ...newTanks[index], ...updates } as PlumbingTank;
    updatePlumbing({ tanks: newTanks });
  };

  const moveTank = (index: number, direction: 'up' | 'down') => {
    const newTanks = [...plumbing.tanks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newTanks.length) {
      const temp = newTanks[index]!;
      newTanks[index] = newTanks[targetIndex]!;
      newTanks[targetIndex] = temp;
      updatePlumbing({ tanks: newTanks });
    }
  };

  const getTankIcon = (type: PlumbingTank['type']) => {
    switch (type) {
      case 'fresh':
        return '💧';
      case 'waste':
        return '🚰';
      case 'black':
        return '🚽';
    }
  };

  const getTankTypeLabel = (type: PlumbingTank['type']) => {
    switch (type) {
      case 'fresh':
        return 'Fresh Water';
      case 'waste':
        return 'Grey Water';
      case 'black':
        return 'Black Water';
    }
  };

  const tankCounts = {
    fresh: plumbing.tanks.filter((t) => t.type === 'fresh').length,
    waste: plumbing.tanks.filter((t) => t.type === 'waste').length,
    black: plumbing.tanks.filter((t) => t.type === 'black').length,
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Plumbing & Tank Monitoring</h2>
        <p className={styles.subtitle}>
          Configure water and waste tank monitoring (1-4 tanks supported)
        </p>
      </header>

      <div className={styles.content}>
        {/* Enable/Disable Section */}
        <section className={styles.section}>
          <div className={styles.toggleSection}>
            <div>
              <h3>Tank Monitoring System</h3>
              <p className={styles.sectionDescription}>
                Enable or disable tank level monitoring via RV-C sensors
              </p>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={plumbing.enabled}
                onChange={(e) => updatePlumbing({ enabled: e.target.checked })}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </section>

        {plumbing.enabled && (
          <>
            {/* Monitoring Source Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Tank Monitoring Source</h3>
                <p className={styles.sectionDescription}>
                  Select your tank level monitoring hardware interface
                </p>
              </div>

              <div className={styles.radioGroup}>
                <label className={styles.radioCard}>
                  <input
                    type="radio"
                    name="monitoringSource"
                    value="cerbo-gx"
                    checked={plumbing.monitoringSource === 'cerbo-gx'}
                    onChange={(e) =>
                      updatePlumbing({
                        monitoringSource: e.target.value as 'cerbo-gx' | 'seelevel',
                      })
                    }
                  />
                  <div className={styles.radioContent}>
                    <div>
                      <strong>Victron Cerbo GX</strong>
                      <span>Tank data from Victron Energy system via VE.Can/NMEA2000</span>
                    </div>
                  </div>
                </label>

                <label className={styles.radioCard}>
                  <input
                    type="radio"
                    name="monitoringSource"
                    value="seelevel"
                    checked={plumbing.monitoringSource === 'seelevel'}
                    onChange={(e) =>
                      updatePlumbing({
                        monitoringSource: e.target.value as 'cerbo-gx' | 'seelevel',
                      })
                    }
                  />
                  <div className={styles.radioContent}>
                    <div>
                      <strong>SeeLeveL SOUL</strong>
                      <span>Direct tank monitoring via SeeLeveL SOUL sensor system</span>
                    </div>
                  </div>
                </label>
              </div>
            </section>

            {/* Tank Count Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Number of Tanks</h3>
                <p className={styles.sectionDescription}>
                  How many tanks do you want to monitor? (1-4 tanks)
                </p>
              </div>

              <div className={styles.radioGroup}>
                {[1, 2, 3, 4].map((count) => (
                  <label key={count} className={styles.radioCard}>
                    <input
                      type="radio"
                      name="tankCount"
                      value={count}
                      checked={plumbing.count === count}
                      onChange={() => updateTankCount(count)}
                    />
                    <div className={styles.radioContent}>
                      <div className={styles.radioIcon}>{count}</div>
                      <div>
                        <strong>
                          {count} Tank{count > 1 ? 's' : ''}
                        </strong>
                        <span>
                          {count === 1 && 'Single tank monitoring'}
                          {count === 2 && 'Fresh + waste/black'}
                          {count === 3 && 'Fresh, grey, and black'}
                          {count === 4 && 'Multiple fresh or waste tanks'}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Tank Configuration Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Tank Configuration</h3>
                <p className={styles.sectionDescription}>
                  Configure each tank's type and optional name. Tanks appear in the HMI in this
                  order.
                </p>
              </div>

              <div className={styles.tankList}>
                {plumbing.tanks.map((tank, index) => (
                  <div key={index} className={styles.tankCard}>
                    <div className={styles.tankHeader}>
                      <div className={styles.tankNumber}>Tank {index + 1}</div>
                      <div className={styles.tankControls}>
                        <button
                          className={styles.moveButton}
                          onClick={() => moveTank(index, 'up')}
                          disabled={index === 0}
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          className={styles.moveButton}
                          onClick={() => moveTank(index, 'down')}
                          disabled={index === plumbing.tanks.length - 1}
                          title="Move down"
                        >
                          ↓
                        </button>
                      </div>
                    </div>

                    <div className={styles.tankBody}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          <strong>Tank Type</strong>
                        </label>
                        <div className={styles.tankTypeButtons}>
                          <button
                            className={`${styles.tankTypeButton} ${
                              tank.type === 'fresh' ? styles.active : ''
                            }`}
                            onClick={() => updateTank(index, { type: 'fresh' })}
                          >
                            <span>Fresh Water</span>
                          </button>
                          <button
                            className={`${styles.tankTypeButton} ${
                              tank.type === 'waste' ? styles.active : ''
                            }`}
                            onClick={() => updateTank(index, { type: 'waste' })}
                          >
                            <span>Grey Water</span>
                          </button>
                          <button
                            className={`${styles.tankTypeButton} ${
                              tank.type === 'black' ? styles.active : ''
                            }`}
                            onClick={() => updateTank(index, { type: 'black' })}
                          >
                            <span>Black Water</span>
                          </button>
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor={`tank-name-${index}`} className={styles.label}>
                          <strong>Custom Name</strong>
                          <span className={styles.optional}>(optional)</span>
                        </label>
                        <input
                          id={`tank-name-${index}`}
                          type="text"
                          className={styles.input}
                          placeholder={`e.g., "Main Tank", "Forward Tank"`}
                          value={tank.name}
                          onChange={(e) => updateTank(index, { name: e.target.value })}
                          maxLength={50}
                        />
                        <small className={styles.helpText}>
                          Leave blank to use default: "{getTankTypeLabel(tank.type)}"
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Summary Section */}
            <section className={styles.summarySector}>
              <h3>📋 Tank Configuration Summary</h3>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>Monitoring Source</div>
                  <div className={styles.summaryValue}>
                    {plumbing.monitoringSource === 'cerbo-gx'
                      ? 'Victron Cerbo GX'
                      : 'SeeLeveL SOUL'}
                  </div>
                </div>

                <div className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>Total Tanks</div>
                  <div className={styles.summaryValue}>{plumbing.count}</div>
                </div>

                <div className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>Fresh Water</div>
                  <div className={styles.summaryValue}>
                    {tankCounts.fresh === 0 ? (
                      'None'
                    ) : (
                      <>
                        {tankCounts.fresh} tank{tankCounts.fresh > 1 ? 's' : ''}
                      </>
                    )}
                  </div>
                </div>

                <div className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>Grey Water</div>
                  <div className={styles.summaryValue}>
                    {tankCounts.waste === 0 ? (
                      'None'
                    ) : (
                      <>
                        {tankCounts.waste} tank{tankCounts.waste > 1 ? 's' : ''}
                      </>
                    )}
                  </div>
                </div>

                <div className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>Black Water</div>
                  <div className={styles.summaryValue}>
                    {tankCounts.black === 0 ? (
                      'None'
                    ) : (
                      <>
                        {tankCounts.black} tank{tankCounts.black > 1 ? 's' : ''}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.tankSequence}>
                <h4>Display Order:</h4>
                <div className={styles.tankChips}>
                  {plumbing.tanks.map((tank, index) => (
                    <div key={index} className={styles.tankChip}>
                      <span className={styles.tankChipIcon}>{getTankIcon(tank.type)}</span>
                      <span className={styles.tankChipLabel}>
                        {tank.name || getTankTypeLabel(tank.type)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {!plumbing.enabled && (
          <section className={styles.disabledMessage}>
            <div className={styles.disabledIcon}>🚫</div>
            <h3>Tank Monitoring Disabled</h3>
            <p>
              Enable tank monitoring above to configure water and waste tank level sensors. Tank
              data will be read via RV-C protocol.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
