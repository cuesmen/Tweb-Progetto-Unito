import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { ENV } from './config/env.js';
import { setupSwagger } from './config/swagger.js';

import systemRoutes from './routes/system.js';
import moviesRoutes from './routes/movies.js';
import actorsRoutes from './routes/actors.js';
import searchRoutes from './routes/search.js';

const app = express();
app.use(cors({ origin: ENV.SPA_ORIGIN, credentials: true }));
app.use(express.json());

app.use('/api', systemRoutes);
app.use('/api', moviesRoutes);
app.use('/api', actorsRoutes);
app.use('/api', searchRoutes);

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
const io = new SocketIOServer(server, { cors: { origin: ENV.SPA_ORIGIN } });
io.on('connection', (socket) => {
  socket.on('chat:message', (msg) => io.emit('chat:message', { ...msg, ts: Date.now() }));
});

server.listen(ENV.PORT, () => {
  console.log(`✅ Gateway running on http://localhost:${ENV.PORT}`);
});
