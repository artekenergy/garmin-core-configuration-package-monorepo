/**
 * WebSocket State Management
 *
 * Global WebSocket adapter instance and connection state.
 * ES2017 compliant.
 */

import { signal } from '@preact/signals';
import { WebSocketAdapter } from '../adapters/websocket-adapter';
import { handleMfdStatusMessage } from './signal-state';

// Connection state signal
export const connectionStateSignal = signal<'connecting' | 'connected' | 'disconnected'>(
  'disconnected'
);

// Global WebSocket adapter instance
export let wsAdapter: WebSocketAdapter | null = null;

/**
 * Initialize WebSocket adapter
 */
export function initializeWebSocket(debug: boolean = false): void {
  if (wsAdapter) {
    console.warn('WebSocket adapter already initialized');
    return;
  }

  wsAdapter = new WebSocketAdapter({
    autoConnect: true,
    autoReconnect: true,
    debug: debug,
  });

  // Update connection state signal
  wsAdapter.onOpen(function () {
    connectionStateSignal.value = 'connected';
  });

  wsAdapter.onClose(function () {
    connectionStateSignal.value = 'disconnected';
  });

  wsAdapter.onError(function () {
    connectionStateSignal.value = 'disconnected';
  });

  // Handle incoming messages and update signal state
  wsAdapter.onMessage(function (message) {
    handleMfdStatusMessage(message);
  });

  // Set initial state
  const state = wsAdapter.getState();
  if (state === 'open') {
    connectionStateSignal.value = 'connected';
  } else if (state === 'connecting') {
    connectionStateSignal.value = 'connecting';
  } else {
    connectionStateSignal.value = 'disconnected';
  }
}

/**
 * Get WebSocket adapter instance
 */
export function getWebSocketAdapter(): WebSocketAdapter | null {
  return wsAdapter;
}
