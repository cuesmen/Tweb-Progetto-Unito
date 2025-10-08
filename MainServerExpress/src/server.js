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

app.get('/api/ping', (_req, res) => res.json({ ok: true }));



/** @param {string[]} paths @param {import('express').Request} req */
async function trySpringGet(paths, req) {
    let lastErr = null;
    for (const p of paths) {
      // sostituisci i params :id ecc.
      const id = (req.params && req.params.id) != null ? req.params.id : '';
      const url = p.replace(':id', encodeURIComponent(id));
      try {
        const { data } = await spring.get(url, { params: req.query });
        return data;
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404 || status === 400) {
          lastErr = err;
          continue;
        }
        throw err;
      }
    }
    throw lastErr ?? new Error('Upstream not found');
  }
  
  
  app.get('/api/movies/:id', async (req, res, next) => {
    try {
      const data = await trySpringGet(
        ['/api/movies/:id', '/movies/:id'], 
        req
      );
      res.json(data);
    } catch (e) { next(e); }
  });
  
  app.get('/api/lookup/genres', async (req, res, next) => {
    try {
      const data = await trySpringGet(
        ['/api/lookup/genres', '/api/genres', '/genres'],
        req
      );
      res.json(data);
    } catch (e) { next(e); }
  });
  
  app.get('/api/lookup/studios', async (req, res, next) => {
    try {
      const data = await trySpringGet(
        ['/api/lookup/studios', '/api/studios', '/studios'],
        req
      );
      res.json(data);
    } catch (e) { next(e); }
  });
  
  app.get('/api/lookup/countries', async (req, res, next) => {
    try {
      const data = await trySpringGet(
        ['/api/lookup/countries', '/api/countries', '/countries'],
        req
      );
      res.json(data);
    } catch (e) { next(e); }
  });
  
  app.get('/api/lookup/languages', async (req, res, next) => {
    try {
      const data = await trySpringGet(
        ['/api/lookup/languages', '/api/languages', '/languages'],
        req
      );
      res.json(data);
    } catch (e) { next(e); }
  });
  
  app.get('/api/lookup', async (_req, res, next) => {
    try {
      const [genres, studios, countries, languages] = await Promise.all([
        trySpringGet(['/api/lookup/genres', '/api/genres', '/genres'], _req),
        trySpringGet(['/api/lookup/studios', '/api/studios', '/studios'], _req),
        trySpringGet(['/api/lookup/countries', '/api/countries', '/countries'], _req),
        trySpringGet(['/api/lookup/languages', '/api/languages', '/languages'], _req),
      ]);
      res.json({ genres, studios, countries, languages });
    } catch (e) { next(e); }
  });
  


app.use((err, _req, res, _next) => {
  const status = err.response?.status || 500;
  const payload = err.response?.data || { message: err.message || 'INTERNAL_ERROR' };
  res.status(status).json({ error: payload });
});

const server = http.createServer(app);

const io = new SocketIOServer(server, { cors: { origin: SPA_ORIGIN } });
io.on('connection', (socket) => {
  socket.on('chat:message', (msg) => {
    io.emit('chat:message', { ...msg, ts: Date.now() }); // broadcast
  });
});

server.listen(PORT, () => {
  console.log(`Main Server on http://localhost:${PORT}`);
});
