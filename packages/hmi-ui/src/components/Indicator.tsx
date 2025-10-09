/**
 * Indicator Component
 *
 * Status light/LED component:
 * - LED variant (simple status light)
 * - Badge variant (with text label)
 * - Icon variant (custom icon with state)
 *
 * Subscribes to Type 16, Cmd 1 toggle state signals.
 *
 * ES2017 compliant - no optional chaining or nullish coalescing.
 */

import { useComputed } from '@preact/signals';
import type { IndicatorComponent } from '@gcg/schema';
import { resolveBindingToChannelId } from '../utils/binding-resolver';
import { getSignalState, type ToggleState } from '../state/signal-state';

export interface IndicatorProps {
  component: IndicatorComponent;
  value?: boolean | 'warning' | 'error';
}

export function Indicator(props: IndicatorProps) {
  const { component, value } = props;

  // Check if binding is static type
  const binding = component.bindings && component.bindings.state;
  const isStaticBinding = binding && binding.type === 'static';

  // Resolve signal ID from binding (only for empirbus bindings)
  let signalId: number | null = null;
  if (binding && binding.type === 'empirbus') {
    signalId = resolveBindingToChannelId(binding);
  }

  // Subscribe to signal state for reactive updates (only for empirbus)
  const signalState = signalId !== null ? getSignalState(signalId) : null;

  // Compute current state from signal, static binding, or props
  const isActive = useComputed(function () {
    // First check for static binding value
    if (isStaticBinding && binding.type === 'static') {
      return binding.value === true;
    }

    // Then check signal state (empirbus binding)
    if (signalState && signalState.value) {
      const state = signalState.value.value as ToggleState;
      if (state && typeof state.state === 'boolean') {
        return state.state;
      }
    }

    // Fallback to props
    if (value === true) return true;
    if (value === false) return false;
    return false;
  });

  // Determine the state based on value
  let state = 'off';
  if (isActive.value) {
    state = 'on';
  } else if (value === 'warning') {
    state = 'warning';
  } else if (value === 'error') {
    state = 'error';
  }

  const variant = component.variant || 'led';
  const baseClass = 'gcg-indicator';
  const variantClass = baseClass + '--' + variant;
  const stateClass = baseClass + '--' + state;
  const className = [baseClass, variantClass, stateClass]
    .filter(function (c) {
      return c;
    })
    .join(' ');

  return (
    <div className="gcg-component-wrapper">
      <div className={className} role="status" aria-label={component.label}>
        <div className="gcg-indicator__light" />
        <span className="gcg-indicator__label">{component.label}</span>
      </div>
      {component.tooltip && <div className="gcg-component-tooltip">{component.tooltip}</div>}
    </div>
  );
}
