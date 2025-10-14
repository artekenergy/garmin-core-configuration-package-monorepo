/**
 * Signal State Management
 *
 * Central registry for signal values received from EmpirBus hardware.
 * Uses Preact signals for reactive state updates.
 *
 * ES2017 compliant.
 */

import { signal, Signal } from '@preact/signals';
import type { EmpirBusMessage } from '../adapters/websocket-adapter';

/**
 * Signal value types
 */
export interface SignalState {
  value: any;
  lastUpdated: number;
}

export interface ToggleState {
  state: boolean;
  lastUpdated: number;
}

export interface DimmerState {
  index: number;
  value: number; // 0-100%
  lastUpdated: number;
}

export interface NumericState {
  raw: number;
  lastUpdated: number;
}

/**
 * Global signal state registry
 * signalId -> Signal<SignalState>
 */
const signalStateSignals = new Map<number, Signal<SignalState | null>>();

/**
 * Get or create a reactive signal for a given signal ID
 */
export function getSignalState(signalId: number): Signal<SignalState | null> {
  let sig = signalStateSignals.get(signalId);
  if (!sig) {
    sig = signal<SignalState | null>(null);
    signalStateSignals.set(signalId, sig);
  }
  return sig;
}

/**
 * Update signal state
 */
export function updateSignalState(signalId: number, value: any): void {
  const sig = getSignalState(signalId);
  sig.value = {
    value: value,
    lastUpdated: Date.now(),
  };
}

/**
 * Parse MFD STATUS message and update state
 * Message type 16 with various command types
 */
export function handleMfdStatusMessage(msg: EmpirBusMessage): void {
  if (msg.messagetype !== 16) {
    return;
  }

  console.log('[Signal-State] Processing Type 16 message:', msg);

  if (!msg.data || msg.data.length < 2) {
    console.warn('[Signal-State] Invalid Type 16 message - insufficient data');
    return;
  }

  const lo = msg.data[0];
  const hi = msg.data[1];
  if (typeof lo !== 'number' || typeof hi !== 'number') {
    return;
  }

  const signalId = lo | (hi << 8);

  switch (msg.messagecmd) {
    case 1: {
      // Toggle/button state (cmd 1)
      // data: [lo, hi, state]
      if (msg.data.length >= 3) {
        const stateValue = msg.data[2] === 1;
        console.log(`[Signal-State] Signal ${signalId} Toggle: ${stateValue ? 'ON' : 'OFF'}`);
        const state: ToggleState = {
          state: stateValue,
          lastUpdated: Date.now(),
        };
        updateSignalState(signalId, state);
      }
      break;
    }

    case 3: {
      // Dimmer value (cmd 3)
      // data: [lo, hi, index, valueLo, valueHi]
      if (msg.data.length >= 5) {
        const index = msg.data[2] || 0;
        const valLo = msg.data[3];
        const valHi = msg.data[4];
        if (typeof valLo === 'number' && typeof valHi === 'number') {
          const rawValue = valLo | (valHi << 8);
          // Normalize: values > 100 are in 0.1% units (e.g., 1000 = 100.0%)
          const percent = rawValue > 100 ? rawValue / 10 : rawValue;
          const clampedPercent = Math.max(0, Math.min(100, percent));

          console.log(`[Signal-State] Signal ${signalId} Dimmer: ${clampedPercent}%`);
          
          const state: DimmerState = {
            index: index,
            value: clampedPercent,
            lastUpdated: Date.now(),
          };
          updateSignalState(signalId, state);
        }
      }
      break;
    }

    case 5: {
      // Numeric value (cmd 5)
      // Short format: [lo, hi, valLo, valHi]
      // Extended format: [lo, hi, r0, r1, valLo, valHi, meta0, meta1]
      const hasExtended = msg.data.length >= 8;
      let raw: number;

      if (hasExtended) {
        const valLo = msg.data[4];
        const valHi = msg.data[5];
        if (typeof valLo === 'number' && typeof valHi === 'number') {
          raw = (valLo | (valHi << 8)) >>> 0;
        } else {
          break;
        }
      } else if (msg.data.length >= 4) {
        const valLo = msg.data[2];
        const valHi = msg.data[3];
        if (typeof valLo === 'number' && typeof valHi === 'number') {
          raw = (valLo | (valHi << 8)) >>> 0;
        } else {
          break;
        }
      } else {
        break;
      }

      const state: NumericState = {
        raw: raw,
        lastUpdated: Date.now(),
      };
      updateSignalState(signalId, state);
      break;
    }

    default:
      // Unknown command type - store raw data
      updateSignalState(signalId, {
        raw: msg.data,
        lastUpdated: Date.now(),
      });
  }
}

/**
 * Clear all signal states (useful for testing or reset)
 */
export function clearAllSignalStates(): void {
  signalStateSignals.clear();
}

/**
 * Get all signal IDs that have state
 */
export function getAllSignalIds(): number[] {
  return Array.from(signalStateSignals.keys());
}

/**
 * Check if a signal has state
 */
export function hasSignalState(signalId: number): boolean {
  const sig = signalStateSignals.get(signalId);
  return sig !== undefined && sig.value !== null;
}
