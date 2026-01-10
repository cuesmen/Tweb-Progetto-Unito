/**
 * Express entrypoint and Socket.IO setup for the MoviePoint gateway.
 * @module server
 * @category Root
 */

import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { ENV } from './config/env.js';
import { setupSwagger } from './config/swagger.js';
import { closeMongo } from './mongodb/mongo.js';
import { useChatSocket } from './routes/mongo.js';

import systemRoutes from './routes/system.js';
import moviesRoutes from './routes/movies.js';
import actorsRoutes from './routes/actors.js';
import searchRoutes from './routes/search.js';
import mongoRoutes from './routes/mongo.js'; 
import reviewsRoutes from './routes/reviewmovie.js';
import oscarRoutes from './routes/oscarawards.js';

const app = express();
app.use(cors({ origin: ENV.SPA_ORIGIN, credentials: true }));
app.use(express.json());

app.use('/api', systemRoutes);
app.use('/api', moviesRoutes);
app.use('/api', actorsRoutes);
app.use('/api', searchRoutes);
app.use('/api', mongoRoutes);
app.use('/api', reviewsRoutes);
app.use('/api', oscarRoutes);

app.use((err, _req, res, _next) => {
  const status = err.response?.status || err.statusCode || 500;
  const message = err.response?.data?.message || err.message || 'INTERNAL_ERROR';
  const code = err.code || 'UNEXPECTED_ERROR';

  res.status(status).json({
    ok: false,
    data: null,
    error: { code, message },
  });
});

if (ENV.ENABLE_DOCS === 'true') setupSwagger(app);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: ENV.SPA_ORIGIN,        
    methods: ["GET", "POST"],
    credentials: true,             
  },
});

app.set('io', io);

// Socket rooms per chat: either "global" or "movie:<movieId>"
io.on('connection', (socket) => {
  socket.on('chat:join', (room) => {
    try {
      if (typeof room !== 'string') return;
      if (!room.startsWith('movie:') && room !== 'global') return;
      socket.join(room);
      socket.emit('chat:joined', { room });
    } catch {}
  });

  socket.on('chat:leave', (room) => {
    try {
      if (typeof room !== 'string') return;
      socket.leave(room);
      socket.emit('chat:left', { room });
    } catch {}
  });

  // socket-based chat handlers (send/list)
  useChatSocket(io)(socket);
});

server.listen(ENV.PORT, () => {
  console.log(`✅ Gateway running on http://localhost:${ENV.PORT}`);
});

const shutdown = async (signal) => {
  console.log(`\n${signal} received, closing...`);
  await closeMongo();
  server.close(() => process.exit(0));
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
