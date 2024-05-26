import WebSocket from 'ws';

class WsConnectionManager {
  // A user(characterName) can have multiple open connections.
  // They are all notified when a new message is is send.
  // for Outgoing messages
  private connections: Map<string, Set<WebSocket>> = new Map();

  // for Incoming messages
  private wsCharacterMap: Map<WebSocket, string> = new Map();

  addConnection(characterName: string, ws: WebSocket) {
    if (!this.connections.has(characterName)) {
      this.connections.set(characterName, new Set());
    }
    this.connections.get(characterName)!.add(ws);

    this.wsCharacterMap.set(ws, characterName);
  }

  removeConnection(characterName: string, ws: WebSocket) {
    const characterConnections = this.connections.get(characterName);
    if (characterConnections) {
      characterConnections.delete(ws);
      if (characterConnections.size === 0) {
        this.connections.delete(characterName);
      }
    }

    this.wsCharacterMap.delete(ws);
  }

  getCharacterName(ws: WebSocket) {
    return this.wsCharacterMap.get(ws);
  }

  sendMessage(characterName: string, message: string) {
    const characterConnections = this.connections.get(characterName);
    if (characterConnections) {
      characterConnections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    }
  }

  broadcastToAll(message: string) {
    this.connections.forEach((characterConnections) => {
      characterConnections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    });
  }
}

// Export a singleton instance of ConnectionManager
export const connectionManager = new WsConnectionManager();
