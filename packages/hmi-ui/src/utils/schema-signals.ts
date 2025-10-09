/**
 * Schema Signal Extraction
 *
 * Utilities to extract signal IDs from schema and auto-subscribe.
 * ES2017 compliant.
 */

import type { UISchema } from '@gcg/schema';
import { getWebSocketAdapter } from '../state/websocket-state';

/**
 * Extract all signal IDs from schema hardware configuration
 */
export function extractSignalIds(schema: UISchema): number[] {
  const signals = new Set<number>();

  // Extract from hardware outputs
  if (schema.hardware && schema.hardware.outputs) {
    for (let i = 0; i < schema.hardware.outputs.length; i++) {
      const output = schema.hardware.outputs[i];
      if (!output) continue;

      // Get signal ID if present
      if (typeof output.signalId === 'number') {
        signals.add(output.signalId);
      }

      // Get signals from signals object
      if (output.signals) {
        if (typeof output.signals.toggle === 'number') {
          signals.add(output.signals.toggle);
        }
        if (typeof output.signals.momentary === 'number') {
          signals.add(output.signals.momentary);
        }
        if (typeof output.signals.dimmer === 'number') {
          signals.add(output.signals.dimmer);
        }
      }
    }
  }

  // Convert to sorted array
  const signalArray = Array.from(signals);
  signalArray.sort(function (a, b) {
    return a - b;
  });

  return signalArray;
}

/**
 * Subscribe to all signals defined in schema
 */
export function subscribeToSchemaSignals(schema: UISchema): void {
  const wsAdapter = getWebSocketAdapter();
  if (!wsAdapter || !wsAdapter.isConnected()) {
    console.warn('Cannot subscribe: WebSocket not connected');
    return;
  }

  const signalIds = extractSignalIds(schema);
  if (signalIds.length === 0) {
    console.warn('No signals found in schema to subscribe');
    return;
  }

  console.log('Subscribing to ' + signalIds.length + ' signals from schema');
  wsAdapter.subscribeToSignals(signalIds);
}

/**
 * Setup auto-subscription when WebSocket connects
 */
export function setupAutoSubscription(schema: UISchema): () => void {
  const wsAdapter = getWebSocketAdapter();
  if (!wsAdapter) {
    console.warn('WebSocket adapter not initialized');
    return function () {};
  }

  // Subscribe on connection open
  const unsubscribe = wsAdapter.onOpen(function () {
    subscribeToSchemaSignals(schema);
  });

  // If already connected, subscribe now
  if (wsAdapter.isConnected()) {
    subscribeToSchemaSignals(schema);
  }

  return unsubscribe;
}
