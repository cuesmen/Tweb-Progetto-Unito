import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import axios from 'axios';
import { Server as SocketIOServer } from 'socket.io';

const PORT = process.env.PORT || 4000;
const SPA_ORIGIN = process.env.SPA_ORIGIN || 'http://localhost:5173';
const SPRING_URL = process.env.SPRING_URL || 'http://localhost:8080';

const spring = axios.create({ baseURL: SPRING_URL, timeout: 5000 });

const app = express();
app.use(cors({ origin: SPA_ORIGIN, credentials: true }));
app.use(express.json());

// REST per il frontend (Axios)
app.get('/api/ping', (_req, res) => res.json({ ok: true }));

// Esempio: pass-through verso Spring Boot
app.get('/api/players/:id', async (req, res, next) => {
  try {
    const { data } = await spring.get(`/players/${encodeURIComponent(req.params.id)}`);
    res.json(data);
  } catch (e) { next(e); }
});

// Error handler uniforme
app.use((err, _req, res, _next) => {
  const status = err.response?.status || 500;
  const payload = err.response?.data || { message: err.message || 'INTERNAL_ERROR' };
  res.status(status).json({ error: payload });
});

const server = http.createServer(app);

// WebSocket (chat/notifiche)
const io = new SocketIOServer(server, { cors: { origin: SPA_ORIGIN } });
io.on('connection', (socket) => {
  socket.on('chat:message', (msg) => {
    io.emit('chat:message', { ...msg, ts: Date.now() }); // broadcast
  });
});

server.listen(PORT, () => {
  console.log(`Main Server on http://localhost:${PORT}`);
});
