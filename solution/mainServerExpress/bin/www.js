#!/usr/bin/env node

/**
 * Server startup (Express + Socket.IO)
 */

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from '../app.js';
import { ENV } from '../src/config/env.js';
import { useChatSocket } from '../src/socket-io/chat.js';

const port = ENV.PORT || 3000;

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: ENV.SPA_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);
io.on('connection', useChatSocket(io));

server.listen(port, () => {
  console.log(`Gateway running on http://localhost:${port}`);
});

// graceful shutdown
const shutdown = (signal) => {
  console.log(`\n${signal} received, shutting down...`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
