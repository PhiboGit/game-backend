import { Server } from 'http';
import WebSocket from 'ws';
import { authenticate } from './authWebsocket.js';
import { JwtPayload } from '../types.js';
import { connectionManager } from './WsConnectionManager.js';
import { initConnection } from '../../game/connection/initConnection.js';

export function createWebSocketServer(server: Server) {
  const wss = new WebSocket.Server({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    // authenticate the connection with JWT
    authenticate(request)
      .then((jwtPayload: JwtPayload) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
          // pass the payload to the connection handler
          wss.emit('connection', ws, jwtPayload);
        });
      })
      .catch((err) => {
        console.log('JWT was rejected:', err.message);
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
      });
  });

  // Connection handler. Has the same parameter as the wss.emit on upgrade
  wss.on('connection', (ws: WebSocket, { characterName, username }: JwtPayload) => {
    // the manager is responsible for adding and removing connections and also for outgoing messages
    connectionManager.addConnection(characterName, ws);
    console.log(`User connected: ${username}, Character: ${characterName}`);

    initConnection(characterName)

    ws.on('message', (message) => {
      const characterName = connectionManager.getCharacterName(ws)
      if (!characterName) {
        console.log('Character not found for ws! Cannot process further. Closing ws! ', ws);
        ws.close();
      }
      console.log('received from %s: %s', characterName, message);

      //TODO: process incoming message
    });

    ws.on('close', () => {
      // clean up
      connectionManager.removeConnection(characterName, ws);
      console.log(`User disconnected: ${username}, Character: ${characterName}`);
    });
  });
}