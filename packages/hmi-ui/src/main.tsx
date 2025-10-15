import { render } from 'preact';
import { App } from './App';
import { initializeWebSocket } from './state/websocket-state';
import './styles/main.css';

console.log('=== HMI UI STARTING ===');
console.log('Location:', window.location.href);

// Initialize WebSocket connection
const isDebug =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
console.log('Debug mode:', isDebug);
console.log('Initializing WebSocket...');
initializeWebSocket(isDebug);

// Get root element
const root = document.getElementById('root');
console.log('Root element found:', !!root);

if (!root) {
  console.error('ROOT ELEMENT NOT FOUND!');
  throw new Error('Root element not found');
}

console.log('Rendering app...');
// Render app
render(<App />, root);
console.log('App rendered successfully');
