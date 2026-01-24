/**
 * Express entrypoint and Socket.IO setup for the MoviePoint gateway.
 * @module server
 * @category Root
 */

import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { ENV } from './src/config/env.js';
import { setupSwagger } from './src/config/swagger.js';
import { connectMongoose, closeMongoose } from './src/database/database.js';
import { useChatSocket } from './src/socket-io/chat.js';

import systemRoutes from './src/routes/system.js';

const app = express();
app.use(cors({ origin: ENV.SPA_ORIGIN, credentials: true }));
app.use(express.json());

app.use((req, _res, next) => {
  console.log(
    `[REQ] ${req.method} ${req.originalUrl}`,
    {
      params: req.params,
      query: req.query,
      body: Object.keys(req.body || {}).length ? req.body : undefined
    }
  );
  next();
});

app.use('/api', systemRoutes);

app.use((err, _req, res, _next) => {
  if (
    err?.name === 'AbortError' ||
    err?.code === 'ECONNRESET' ||
    err?.code === 'ERR_CANCELED' ||
    err?.message?.toLowerCase()?.includes('aborted')
  ) {
    return res.status(499).end();
  }

  if (err.response) {
    return res.status(err.response.status || 502).json({
      ok: false,
      data: null,
      error: {
        code: err.code || 'UPSTREAM_ERROR',
        message:
          err.response.data?.message ||
          err.response.data?.error ||
          err.message,
      },
    });
  }

  console.error('INTERNAL ERROR:', err);

  res.status(err.statusCode || 500).json({
    ok: false,
    data: null,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Unexpected server error',
    },
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

io.on('connection', useChatSocket(io));

server.listen(ENV.PORT, () => {
  connectMongoose().then(() => {
    console.log(`Gateway running on http://localhost:${ENV.PORT}`);
  }).catch((err) => {
    console.error('Mongo connection failed:', err);
  });
});

const shutdown = async (signal) => {
  console.log(`\n${signal} received, closing...`);
  await closeMongoose();
  server.close(() => process.exit(0));
};


process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
