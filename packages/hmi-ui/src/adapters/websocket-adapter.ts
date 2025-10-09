/**
 * WebSocket Adapter for EmpirBus Communication
 *
 * Manages WebSocket connection to EmpirBus controller with:
 * - Auto-reconnect with exponential backoff
 * - Heartbeat ACK to keep connection alive
 * - Message protocol handling
 *
 * ES2017 compliant.
 */

export interface WebSocketConfig {
  url?: string;
  autoConnect?: boolean;
  autoReconnect?: boolean;
  debug?: boolean;
}

export interface EmpirBusMessage {
  messagetype: number;
  messagecmd: number;
  size: number;
  data: number[];
}

export type MessageHandler = (message: EmpirBusMessage) => void;
export type ConnectionHandler = () => void;

// Protocol constants
const PROTOCOL = {
  systemCmd: 48,
  systemReq: 49,
  mfdStatus: 16,
  acknowledgement: 128,
  wduHeartbeat: 5,
  acknowledgementAck: 0,
};

const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;

export class WebSocketAdapter {
  private ws: WebSocket | null = null;
  private shouldAutoReconnect: boolean = true;
  private reconnectTimer: number | null = null;
  private reconnectAttempt: number = 0;
  private config: WebSocketConfig;

  private messageHandlers: MessageHandler[] = [];
  private openHandlers: ConnectionHandler[] = [];
  private closeHandlers: ConnectionHandler[] = [];
  private errorHandlers: ConnectionHandler[] = [];

  constructor(config: WebSocketConfig = {}) {
    this.config = {
      autoConnect: true,
      autoReconnect: true,
      debug: false,
      ...config,
    };

    this.shouldAutoReconnect = this.config.autoReconnect !== false;

    if (this.config.autoConnect) {
      this.connect();
    }
  }

  /**
   * Get WebSocket URL from current page location
   */
  private getWebSocketUrl(): string {
    if (this.config.url) {
      return this.config.url;
    }

    const isHttps = window.location.protocol === 'https:';
    const scheme = isHttps ? 'wss://' : 'ws://';
    const host = window.location.host;
    return scheme + host + '/ws';
  }

  /**
   * Log debug message
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[WebSocketAdapter]', ...args);
    }
  }

  /**
   * Clear reconnection timer
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Schedule reconnection with exponential backoff
   */
  private scheduleReconnect(evt?: CloseEvent): void {
    if (!this.shouldAutoReconnect) {
      this.log('Auto-reconnect disabled; skipping reconnect', {
        code: evt ? evt.code : null,
        reason: evt ? evt.reason : null,
      });
      return;
    }

    this.reconnectAttempt = Math.min(this.reconnectAttempt + 1, 10);
    const delay = Math.min(
      INITIAL_RECONNECT_DELAY * Math.pow(2, this.reconnectAttempt - 1),
      MAX_RECONNECT_DELAY
    );

    this.log('Scheduling reconnect in ' + Math.round(delay / 1000) + 's', {
      code: evt ? evt.code : null,
      reason: evt ? evt.reason : '',
    });

    this.clearReconnectTimer();
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  /**
   * Connect to WebSocket server
   */
  public connect(): void {
    this.shouldAutoReconnect = true;
    this.clearReconnectTimer();

    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)
    ) {
      this.log('Already connected or connecting');
      return;
    }

    const target = this.getWebSocketUrl();
    this.log('Connecting to', target);

    try {
      this.ws = new WebSocket(target);
    } catch (e) {
      const err = e as Error;
      this.log('WebSocket constructor error:', err.message || err);
      this.scheduleReconnect();
      return;
    }

    this.ws.addEventListener('open', () => {
      this.reconnectAttempt = 0;
      this.clearReconnectTimer();
      this.log('WebSocket connected');

      // Request WDU info on connect (handshake)
      this.send({
        messagetype: PROTOCOL.systemReq,
        messagecmd: 1,
        size: 3,
        data: [0, 0, 0],
      });

      // Notify handlers
      const handlers = this.openHandlers.slice();
      for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i];
        if (handler) {
          try {
            handler();
          } catch (e) {
            this.log('Error in open handler:', e);
          }
        }
      }
    });

    this.ws.addEventListener('message', (evt) => {
      try {
        const parsed = JSON.parse(evt.data) as EmpirBusMessage;
        this.log('Received message:', parsed);

        // Auto-ACK WDU heartbeat to keep connection alive
        if (
          parsed.messagetype === PROTOCOL.systemCmd &&
          parsed.messagecmd === PROTOCOL.wduHeartbeat
        ) {
          this.send({
            messagetype: PROTOCOL.acknowledgement,
            messagecmd: PROTOCOL.acknowledgementAck,
            size: 1,
            data: [0x00],
          });
        }

        // Notify handlers
        const handlers = this.messageHandlers.slice();
        for (let i = 0; i < handlers.length; i++) {
          const handler = handlers[i];
          if (handler) {
            try {
              handler(parsed);
            } catch (e) {
              this.log('Error in message handler:', e);
            }
          }
        }
      } catch (e) {
        this.log('Failed to parse message:', evt.data);
      }
    });

    this.ws.addEventListener('error', (evt) => {
      this.log('WebSocket error:', evt);

      // Notify handlers
      const handlers = this.errorHandlers.slice();
      for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i];
        if (handler) {
          try {
            handler();
          } catch (e) {
            this.log('Error in error handler:', e);
          }
        }
      }
    });

    this.ws.addEventListener('close', (evt) => {
      this.log('WebSocket closed', {
        code: evt.code,
        reason: evt.reason,
        wasClean: evt.wasClean,
      });

      // Notify handlers
      const handlers = this.closeHandlers.slice();
      for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i];
        if (handler) {
          try {
            handler();
          } catch (e) {
            this.log('Error in close handler:', e);
          }
        }
      }

      this.scheduleReconnect(evt);
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  public disconnect(): void {
    this.shouldAutoReconnect = false;
    this.reconnectAttempt = 0;
    this.clearReconnectTimer();

    if (this.ws) {
      try {
        this.ws.close(1000, 'client disconnect');
      } catch (e) {
        this.log('Error closing WebSocket:', e);
      }
    }
  }

  /**
   * Send a message to the server
   */
  public send(message: EmpirBusMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.log('Cannot send, WebSocket not open');
      return;
    }

    try {
      const payload = JSON.stringify(message);
      this.ws.send(payload);
      this.log('Sent message:', message);
    } catch (e) {
      this.log('Send error:', e);
    }
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get current connection state
   */
  public getState(): 'connecting' | 'open' | 'closing' | 'closed' {
    if (!this.ws) return 'closed';

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'open';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'closed';
      default:
        return 'closed';
    }
  }

  /**
   * Register message handler
   */
  public onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.push(handler);

    // Return unsubscribe function
    const self = this;
    return function () {
      const index = self.messageHandlers.indexOf(handler);
      if (index > -1) {
        self.messageHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Register connection open handler
   */
  public onOpen(handler: ConnectionHandler): () => void {
    this.openHandlers.push(handler);

    // Return unsubscribe function
    const self = this;
    return function () {
      const index = self.openHandlers.indexOf(handler);
      if (index > -1) {
        self.openHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Register connection close handler
   */
  public onClose(handler: ConnectionHandler): () => void {
    this.closeHandlers.push(handler);

    // Return unsubscribe function
    const self = this;
    return function () {
      const index = self.closeHandlers.indexOf(handler);
      if (index > -1) {
        self.closeHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Register error handler
   */
  public onError(handler: ConnectionHandler): () => void {
    this.errorHandlers.push(handler);

    // Return unsubscribe function
    const self = this;
    return function () {
      const index = self.errorHandlers.indexOf(handler);
      if (index > -1) {
        self.errorHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Subscribe to signal updates
   * Sends a subscription message (type 96, cmd 0) with signal IDs
   * Server will then push MFD STATUS messages (type 16) for subscribed signals
   */
  public subscribeToSignals(signalIds: number[]): void {
    if (!signalIds || signalIds.length === 0) {
      this.log('No signals to subscribe');
      return;
    }

    // Build data array: [lo1, hi1, lo2, hi2, ...]
    const data: number[] = [];
    for (let i = 0; i < signalIds.length; i++) {
      const id = signalIds[i];
      if (typeof id === 'number') {
        const lo = id & 0xff;
        const hi = (id >> 8) & 0xff;
        data.push(lo, hi);
      }
    }

    const message: EmpirBusMessage = {
      messagetype: 96, // Subscription request
      messagecmd: 0, // Subscribe action
      size: data.length,
      data: data,
    };

    this.log('Subscribing to ' + signalIds.length + ' signals');
    this.send(message);
  }

  /**
   * Extract signal ID from message data
   * Signal ID is encoded in bytes [0] (lo) and [1] (hi)
   */
  public static extractSignalId(data: number[]): number | null {
    if (!data || data.length < 2) {
      return null;
    }
    const lo = data[0];
    const hi = data[1];
    if (typeof lo !== 'number' || typeof hi !== 'number') {
      return null;
    }
    return lo | (hi << 8);
  }
}
