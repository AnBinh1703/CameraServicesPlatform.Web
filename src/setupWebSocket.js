import config from './api/config';

// ...existing code...

const setupWebSocket = () => {
  const socket = new WebSocket(config.wsUrl);
  // ...existing code...
};

export default setupWebSocket;
