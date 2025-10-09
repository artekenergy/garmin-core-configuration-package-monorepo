import { ValidationResult } from '@gcg/schema';
import type { ChannelValidationError } from '../utils/channelValidation';
import styles from './ErrorModal.module.css';

interface ErrorModalProps {
  validationResult: ValidationResult;
  channelErrors?: ChannelValidationError[]; // Optional channel binding errors
  onClose: () => void;
}

export default function ErrorModal({
  validationResult,
  channelErrors = [],
  onClose,
}: ErrorModalProps) {
  if (validationResult.success && channelErrors.length === 0) return null;

  const errors = validationResult.success ? [] : validationResult.errors;

  const totalErrors = errors.length + channelErrors.length;

  // Group schema validation errors by category based on path
  const groupedErrors = errors.reduce(
    (acc, error) => {
      const category = error.path[0] || 'general';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(error);
      return acc;
    },
    {} as Record<string, typeof errors>
  );

  const getCategoryIcon = (category: string): string => {
    const iconMap: Record<string, string> = {
      hardware: '🔌',
      power: '🔋',
      hvac: '❄️',
      plumbing: '💧',
      accessories: '🔧',
      tabs: '📑',
      home: '🏠',
      lightingTab: '💡',
      metadata: 'ℹ️',
      general: '⚠️',
    };
    return iconMap[category] || '⚠️';
  };

  const getCategoryTitle = (category: string): string => {
    const titleMap: Record<string, string> = {
      hardware: 'Hardware Configuration',
      power: 'Power System',
      hvac: 'HVAC System',
      plumbing: 'Plumbing System',
      accessories: 'Accessories',
      tabs: 'Tabs & Sections',
      home: 'Home Tab',
      lightingTab: 'Lighting Tab',
      metadata: 'Project Metadata',
      general: 'General Errors',
    };
    return titleMap[category] || category;
  };

  const formatPath = (path: string[]): string => {
    if (path.length === 0) return 'Root';

    // Enhance path with more context
    const formattedParts = path.map((part, index) => {
      // Check if part is a number (array index)
      if (!isNaN(Number(part))) {
        const prevPart = path[index - 1];
        // Add context for common arrays
        if (prevPart === 'outputs') return `Channel #${Number(part) + 1}`;
        if (prevPart === 'tanks') return `Tank #${Number(part) + 1}`;
        if (prevPart === 'sections') return `Section #${Number(part) + 1}`;
        if (prevPart === 'components') return `Component #${Number(part) + 1}`;
        if (prevPart === 'tabs') return `Tab #${Number(part) + 1}`;
        if (prevPart === 'genesisBoards') return `Board #${Number(part) + 1}`;
        if (prevPart === 'halfBridgePairs') return `Pair #${Number(part) + 1}`;
        return `[${part}]`; // Generic array index
      }

      // Capitalize and format field names
      return part
        .split(/(?=[A-Z])/)
        .join(' ')
        .replace(/^./, (str) => str.toUpperCase());
    });

    return formattedParts.join(' → ');
  };

  const getFixSuggestion = (error: (typeof errors)[0]): string | null => {
    const path = error.path;
    const message = error.message.toLowerCase();
    const code = error.code;

    // Hardware-specific suggestions
    if (path[0] === 'hardware') {
      if (path.includes('outputs') && message.includes('label')) {
        return 'Go to Hardware Configuration page and provide a descriptive label for this output channel.';
      }
      if (path.includes('outputs') && message.includes('control')) {
        return 'Go to Hardware Configuration page and select a valid control type (toggle, momentary, dimmer, etc.).';
      }
      if (message.includes('genesis') && message.includes('board')) {
        return 'Go to Hardware Configuration page and set the correct number of Genesis boards (0-4).';
      }
      if (path.includes('halfBridgePairs')) {
        return 'Go to Hardware Configuration page and ensure half-bridge pairs are properly configured with valid output IDs.';
      }
    }

    // Power-specific suggestions
    if (path[0] === 'power') {
      if (message.includes('battery')) {
        return 'Go to Power Configuration page and configure your battery management system settings.';
      }
      if (message.includes('solar')) {
        return 'Go to Power Configuration page and configure your solar array settings if enabled.';
      }
      if (message.includes('multiplus')) {
        return 'Go to Power Configuration page and configure your MultiPlus inverter/charger settings.';
      }
    }

    // HVAC-specific suggestions
    if (path[0] === 'hvac') {
      if (message.includes('heating')) {
        return 'Go to HVAC Configuration page and configure your heating system sources and distribution.';
      }
      if (message.includes('cooling')) {
        return 'Go to HVAC Configuration page and select your air conditioning brand and model.';
      }
      if (message.includes('ventilation')) {
        return 'Go to HVAC Configuration page and set the number of ventilation fans (1-4).';
      }
    }

    // Plumbing-specific suggestions
    if (path[0] === 'plumbing') {
      if (path.includes('tanks') && message.includes('type')) {
        return 'Go to Plumbing Configuration page and select a valid tank type (fresh, waste, black, gray, fuel).';
      }
      if (message.includes('monitoring')) {
        return 'Go to Plumbing Configuration page and select your tank monitoring source (Cerbo GX or ITC).';
      }
      if (path.includes('count')) {
        return 'Go to Plumbing Configuration page and ensure the tank count matches the number of tanks configured.';
      }
    }

    // Accessories-specific suggestions
    if (path[0] === 'accessories') {
      if (path.includes('keypad')) {
        return 'Go to Accessories Configuration page and configure your keypad settings (count and buttons per keypad).';
      }
      if (path.includes('itcLighting')) {
        return 'Go to Accessories Configuration page and configure your ITC lighting modules and zones.';
      }
      if (path.includes('awning')) {
        return 'Go to Accessories Configuration page and configure your awning control type (RVC or Relay).';
      }
      if (path.includes('slides')) {
        return 'Go to Accessories Configuration page and configure your slide-out control settings.';
      }
    }

    // Tab/Section-specific suggestions
    if (path[0] === 'tabs' || path[0] === 'home' || path[0] === 'lightingTab') {
      if (message.includes('section') && message.includes('type')) {
        return 'Go to Editor page and set a valid section type (switching, signal-values, or image).';
      }
      if (message.includes('title')) {
        return 'Go to Editor page and provide a title for this tab or section.';
      }
      if (path.includes('components') && message.includes('required')) {
        return 'Go to Editor page and add at least one component to this section, or disable the section.';
      }
    }

    // Metadata-specific suggestions
    if (path[0] === 'metadata') {
      if (message.includes('name')) {
        return 'Provide a descriptive name for your HMI configuration in the project settings.';
      }
      if (message.includes('version')) {
        return 'Provide a valid version number (e.g., "1.0.0") in the project settings.';
      }
    }

    // Generic suggestions based on error code
    if (code === 'invalid_type') {
      return 'The value type is incorrect. Check that numbers are entered as numbers, text as text, etc.';
    }
    if (code === 'too_small' || code === 'too_big') {
      return 'The value is outside the allowed range. Check the valid range for this field.';
    }
    if (code === 'invalid_enum_value') {
      return 'The value must be one of the predefined options. Select from the dropdown or valid choices.';
    }

    return null; // No specific suggestion available
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>⚠️ Schema Validation Errors</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.summary}>
            <p>
              Found <strong>{totalErrors}</strong> {totalErrors === 1 ? 'error' : 'errors'} that
              must be fixed before the schema can be compiled.
            </p>
            {errors.length > 0 && (
              <p>
                <strong>{errors.length}</strong> schema validation{' '}
                {errors.length === 1 ? 'error' : 'errors'}
              </p>
            )}
            {channelErrors.length > 0 && (
              <p>
                <strong>{channelErrors.length}</strong> channel binding{' '}
                {channelErrors.length === 1 ? 'error' : 'errors'}
              </p>
            )}
          </div>

          <div className={styles.errorGroups}>
            {/* Channel Binding Errors */}
            {channelErrors.length > 0 && (
              <div className={styles.errorGroup}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryIcon}>🔗</span>
                  <h3>Channel Binding Errors</h3>
                  <span className={styles.errorCount}>{channelErrors.length}</span>
                </div>

                <ul className={styles.errorList}>
                  {channelErrors.map((error, index) => (
                    <li key={index} className={styles.errorItem}>
                      <div className={styles.errorMessage}>{error.reason}</div>
                      <div className={styles.errorPath}>
                        <span className={styles.pathLabel}>Component:</span> {error.componentLabel}{' '}
                        ({error.componentId})
                      </div>
                      <div className={styles.errorPath}>
                        <span className={styles.pathLabel}>Location:</span> Tab: {error.tabId} →
                        Section: {error.sectionId}
                      </div>
                      <div className={styles.errorPath}>
                        <span className={styles.pathLabel}>Binding:</span> {error.bindingPath}
                      </div>
                      <div className={styles.fixSuggestion}>
                        <span className={styles.fixIcon}>💡</span>
                        <span className={styles.fixText}>
                          Go to the Editor page and update the component's channel binding to
                          reference a valid channel from your hardware config. You can upload a
                          hardware-config.json file in the Hardware Configuration page.
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Schema Validation Errors */}
            {Object.entries(groupedErrors).map(([category, categoryErrors]) => (
              <div key={category} className={styles.errorGroup}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryIcon}>{getCategoryIcon(category)}</span>
                  <h3>{getCategoryTitle(category)}</h3>
                  <span className={styles.errorCount}>{categoryErrors.length}</span>
                </div>

                <ul className={styles.errorList}>
                  {categoryErrors.map((error, index) => {
                    const fixSuggestion = getFixSuggestion(error);

                    return (
                      <li key={index} className={styles.errorItem}>
                        <div className={styles.errorMessage}>{error.message}</div>
                        {error.path.length > 0 && (
                          <div className={styles.errorPath}>
                            <span className={styles.pathLabel}>Location:</span>{' '}
                            {formatPath(error.path)}
                          </div>
                        )}
                        {fixSuggestion && (
                          <div className={styles.fixSuggestion}>
                            <span className={styles.fixIcon}>💡</span>
                            <span className={styles.fixText}>{fixSuggestion}</span>
                          </div>
                        )}
                        {error.code && (
                          <div className={styles.errorCode}>
                            <span className={styles.codeLabel}>Error Code:</span> {error.code}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <p className={styles.footerNote}>
              💡 <strong>Tip:</strong> Navigate to the relevant configuration page to fix these
              errors. Most errors can be resolved by providing required values or correcting invalid
              inputs.
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.closeButtonBottom} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
