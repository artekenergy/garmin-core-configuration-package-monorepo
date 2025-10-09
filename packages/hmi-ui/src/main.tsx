import { render } from 'preact';
import { App } from './App';
import { initializeWebSocket } from './state/websocket-state';
import './styles/main.css';

// Initialize WebSocket connection
const isDebug =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
initializeWebSocket(isDebug);

// Get root element
const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

// Render app
render(<App />, root);
