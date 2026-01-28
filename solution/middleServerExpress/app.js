/**
 * Express entrypoint and Socket.IO setup for the MoviePoint gateway.
 * @module server
 * @category Root
 */

import express from 'express';
import cors from 'cors';
import logger from 'morgan';

import { ENV } from './src/config/env.js';
import { setupSwagger } from './src/config/swagger.js';

import reviewRoutes from './src/routes/review.js';

const app = express();

// logger
app.use(logger('dev'));

app.use(cors({ origin: ENV.SERVER_ORIGIN, credentials: true }));
app.use(express.json());

// custom request logger keep it for major debugging
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`, {
    params: req.params,
    query: req.query,
    body: Object.keys(req.body || {}).length ? req.body : undefined
  });
  next();
});

// routes
app.use('/api', reviewRoutes);

// error handler
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

if (ENV.ENABLE_DOCS === 'true') {
  setupSwagger(app);
}

export default app;
