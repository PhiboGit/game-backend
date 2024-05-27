import connectDB from './db.js';
import app from './app/app.js';
import dotenv from 'dotenv';
import { createWebSocketServer } from './app/websocket/websocket.js';

dotenv.config();

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initialize WebSocket server
createWebSocketServer(server);