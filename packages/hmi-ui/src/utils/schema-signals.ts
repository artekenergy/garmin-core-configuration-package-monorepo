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
  console.log('[Schema-Signals] Starting extraction from schema:', {
    hasHardware: !!schema.hardware,
    hasOutputs: !!(schema.hardware && schema.hardware.outputs),
    outputCount: schema.hardware && schema.hardware.outputs ? schema.hardware.outputs.length : 0,
  });

  const signals = new Set<number>();

  // Extract from hardware outputs
  if (schema.hardware && schema.hardware.outputs) {
    console.log('[Schema-Signals] Processing', schema.hardware.outputs.length, 'outputs');
    for (let i = 0; i < schema.hardware.outputs.length; i++) {
      const output = schema.hardware.outputs[i];
      if (!output) continue;

      console.log('[Schema-Signals] Output', i, ':', output.id, 'signals:', output.signals);

      // Get signal ID if present
      if (typeof output.signalId === 'number') {
        console.log('[Schema-Signals]   Adding signalId:', output.signalId);
        signals.add(output.signalId);
      }

      // Get signals from signals object
      if (output.signals) {
        const sigs = output.signals as any; // Type assertion for extended signal types
        if (typeof sigs.toggle === 'number') {
          console.log('[Schema-Signals]   Adding toggle:', sigs.toggle);
          signals.add(sigs.toggle);
        }
        if (typeof sigs.momentary === 'number') {
          console.log('[Schema-Signals]   Adding momentary:', sigs.momentary);
          signals.add(sigs.momentary);
        }
        if (typeof sigs.dimmer === 'number') {
          console.log('[Schema-Signals]   Adding dimmer:', sigs.dimmer);
          signals.add(sigs.dimmer);
        }
        if (typeof sigs.value === 'number') {
          console.log('[Schema-Signals]   Adding value:', sigs.value);
          signals.add(sigs.value);
        }
      }
    }
  } else {
    console.log('[Schema-Signals] No hardware.outputs found in schema');
  }

  console.log('[Schema-Signals] Total unique signals collected:', signals.size);

  // Convert to sorted array
  const signalArray = Array.from(signals);
  signalArray.sort(function (a, b) {
    return a - b;
  });

  return signalArray;
}

/**
 * Subscribe to all signals from hardware config file
 * This ensures we get feedback even if schema only has partial outputs configured
 */
export function subscribeToSchemaSignals(schema: UISchema): void {
  const wsAdapter = getWebSocketAdapter();
  if (!wsAdapter || !wsAdapter.isConnected()) {
    console.warn('[Schema-Signals] Cannot subscribe: WebSocket not connected');
    return;
  }

  // Try to load hardware-config.json to get ALL available signals
  fetch('/configuration/hardware-config.json')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Hardware config not found, falling back to schema signals');
      }
      return response.json();
    })
    .then(function (hardwareConfig) {
      console.log('[Schema-Signals] Loaded hardware config with', hardwareConfig.outputs?.length, 'outputs');
      
      // Extract ALL signals from hardware config
      const allSignals = new Set<number>();
      
      if (hardwareConfig.outputs) {
        hardwareConfig.outputs.forEach(function (output: any) {
          if (output.signals) {
            const sigs = output.signals;
            if (typeof sigs.toggle === 'number') allSignals.add(sigs.toggle);
            if (typeof sigs.momentary === 'number') allSignals.add(sigs.momentary);
            if (typeof sigs.dimmer === 'number') allSignals.add(sigs.dimmer);
            if (typeof sigs.value === 'number') allSignals.add(sigs.value);
          }
        });
      }
      
      const signalArray = Array.from(allSignals).sort(function (a, b) { return a - b; });
      
      console.log(
        '[Schema-Signals] Subscribing to ' + signalArray.length + ' signals from hardware-config.json:',
        signalArray
      );
      
      wsAdapter.subscribeToSignals(signalArray);
    })
    .catch(function (error) {
      // Fallback: use signals from schema
      console.warn('[Schema-Signals] Could not load hardware config:', error);
      console.log('[Schema-Signals] Falling back to schema signals');
      
      const signalIds = extractSignalIds(schema);
      console.log('[Schema-Signals] Extracted signal IDs from schema:', signalIds);

      if (signalIds.length === 0) {
        console.warn('[Schema-Signals] No signals found in schema to subscribe');
        return;
      }

      console.log(
        '[Schema-Signals] Subscribing to ' + signalIds.length + ' signals from schema:',
        signalIds
      );
      wsAdapter.subscribeToSignals(signalIds);
    });
}

/**
 * Setup auto-subscription when WebSocket connects
 */
export function setupAutoSubscription(schema: UISchema): () => void {
  console.log('[Schema-Signals] Setting up auto-subscription');

  const wsAdapter = getWebSocketAdapter();
  if (!wsAdapter) {
    console.warn('[Schema-Signals] WebSocket adapter not initialized');
    return function () {};
  }

  console.log('[Schema-Signals] WebSocket adapter found, isConnected:', wsAdapter.isConnected());

  // Subscribe on connection open
  const unsubscribe = wsAdapter.onOpen(function () {
    console.log('[Schema-Signals] WebSocket opened - subscribing to signals');
    subscribeToSchemaSignals(schema);
  });

  // If already connected, subscribe now
  if (wsAdapter.isConnected()) {
    console.log('[Schema-Signals] Already connected - subscribing now');
    subscribeToSchemaSignals(schema);
  } else {
    console.log('[Schema-Signals] Not connected yet - waiting for onOpen event');
  }

  return unsubscribe;
}
