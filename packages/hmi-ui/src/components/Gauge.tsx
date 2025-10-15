/**
 * Gauge Component
 *
 * Read-only numeric display for sensor values:
 * - Circular gauge (dial/arc)
 * - Linear gauge (progress bar)
 * - Numeric display (just the value)
 *
 * Subscribes to Type 16, Cmd 5 numeric signals.
 *
 * ES2017 compliant - no optional chaining or nullish coalescing.
 */

import { useComputed } from '@preact/signals';
import type { GaugeComponent } from '@gcg/schema';
import { resolveBindingToChannelId } from '../utils/binding-resolver';
import { getSignalState, type NumericState } from '../state/signal-state';

interface GaugeProps {
  component: GaugeComponent;
  value?: number;
}

export function Gauge(props: GaugeProps) {
  const { component, value } = props;

  // Resolve signal ID from binding
  // For gauges, we don't specify an action since they're read-only
  // The binding should directly reference the sensor signal ID
  let signalId: number | null = null;
  if (component.bindings && component.bindings.value) {
    signalId = resolveBindingToChannelId(component.bindings.value);
  }

  // Subscribe to signal state for reactive updates
  const signalState = signalId !== null ? getSignalState(signalId) : null;

  // Heuristic scaling based on channel ID
  function toSigned16(n: number): number {
    return n >= 0x8000 ? n - 0x10000 : n;
  }

  function scaleNumeric(raw: number): number {
    // If binding is present and is a string channel, use its name to infer scaling
    const ch = component.bindings?.value && (component.bindings.value as any).channel;
    const channelId = typeof ch === 'string' ? ch : '';

    const id = channelId.toLowerCase();
    // Default: no scaling
    let scaled = raw;

    if (id.includes('voltage')) {
      // mV -> V
      scaled = raw / 1000;
    } else if (id.includes('amperage') || id.includes('current')) {
      // mA (signed) -> A
      scaled = toSigned16(raw) / 1000;
    } else if (id.includes('state-of-charge') || id.includes('soc')) {
      // Assume 0.1% or 0.01% like other sensors; start with /1000 and clamp 0-100
      const soc = raw / 1000;
      if (soc < 0) return 0;
      if (soc > 100) return 100;
      scaled = soc;
    }

    return scaled;
  }

  // Compute current value from signal state or props
  const currentValue = useComputed(function () {
    if (signalState && signalState.value) {
      const state = signalState.value.value as NumericState;
      if (state && typeof state.raw === 'number') {
        return scaleNumeric(state.raw);
      }
    }
    return value !== undefined ? value : 0;
  });

  // Component configuration
  const variant = component.variant || 'numeric';
  const min = component.min !== undefined ? component.min : 0;
  const max = component.max !== undefined ? component.max : 100;
  const unit = component.unit || '';
  const decimals = component.decimals !== undefined ? component.decimals : 0;

  // Format the display value
  const formattedValue =
    decimals > 0 ? currentValue.value.toFixed(decimals) : Math.round(currentValue.value).toString();

  // Calculate percentage for gauges (0-100)
  const percentage = Math.max(0, Math.min(100, ((currentValue.value - min) / (max - min)) * 100));

  // Build class names
  const baseClass = 'gcg-gauge';
  const variantClass = baseClass + '--' + variant;
  const className = [baseClass, variantClass].join(' ');

  // Render based on variant
  return (
    <div className="gcg-component-wrapper">
      <div
        className={className}
        role="meter"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue.value}
      >
        {variant === 'circular' && (
          <div className="gcg-gauge__circular">
            <svg className="gcg-gauge__svg" viewBox="0 0 100 100">
              {/* Background arc */}
              <path
                className="gcg-gauge__track"
                d="M 10,50 A 40,40 0 1,1 90,50"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Value arc */}
              <path
                className="gcg-gauge__fill"
                d="M 10,50 A 40,40 0 1,1 90,50"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={String(percentage * 2.51) + ' 251'}
              />
            </svg>
            <div className="gcg-gauge__value-container">
              <span className="gcg-gauge__value">{formattedValue}</span>
              {unit && <span className="gcg-gauge__unit">{unit}</span>}
            </div>
            <label className="gcg-gauge__label">{component.label}</label>
          </div>
        )}

        {variant === 'linear' && (
          <div className="gcg-gauge__linear">
            <label className="gcg-gauge__label">{component.label}</label>
            <div className="gcg-gauge__track-container">
              <div className="gcg-gauge__track">
                <div
                  className="gcg-gauge__fill"
                  style={{
                    width: percentage + '%',
                  }}
                />
              </div>
              <div className="gcg-gauge__value-container">
                <span className="gcg-gauge__value">{formattedValue}</span>
                {unit && <span className="gcg-gauge__unit">{unit}</span>}
              </div>
            </div>
          </div>
        )}

        {variant === 'numeric' && (
          <div className="gcg-gauge__numeric">
            <label className="gcg-gauge__label">{component.label}</label>
            <div className="gcg-gauge__value-container">
              <span className="gcg-gauge__value">{formattedValue}</span>
              {unit && <span className="gcg-gauge__unit">{unit}</span>}
            </div>
          </div>
        )}
      </div>

      {component.tooltip && <div className="gcg-component-tooltip">{component.tooltip}</div>}
    </div>
  );
}
