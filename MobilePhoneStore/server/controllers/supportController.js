const ApiError = require('../error/ApiError');
const WebSocket = require('ws');

class SupportController {
  constructor() {
    this.wss = new WebSocket.Server({ port: 8080 });
    this.clients = new Set();

    this.wss.on('connection', (ws) => {
      console.log('WebSocket connection established');
      this.clients.add(ws);

      ws.on('message', (message) => {
        console.log('Received message:', message);
        this.broadcastMessage(message);
      });

      ws.on('close', () => {
        console.log('WebSocket connection closed');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  broadcastMessage(message) {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  handleWebSocketConnection(req, res) {
    if (!this.wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
      this.wss.emit('connection', ws, req);
    })) {
      res.writeHead(400);
      res.end();
    }
  }
}

module.exports = new SupportController();