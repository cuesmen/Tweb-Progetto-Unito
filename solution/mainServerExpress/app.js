/**
 * Express entrypoint and Socket.IO setup for the MoviePoint gateway.
 * @module server
 * @category Root
 */

import express from 'express';
import cors from 'cors';
import { ENV } from './src/config/env.js';
import { setupSwagger } from './src/config/swagger.js';

import systemRoutes from './src/routes/system.js';
import moviesRoutes from './src/routes/movies.js';
import actorsRoutes from './src/routes/actors.js';
import searchRoutes from './src/routes/search.js';
import reviewsRoutes from './src/routes/reviewmovie.js';
import oscarRoutes from './src/routes/oscarawards.js';
import logger from 'morgan'

const app = express();
// logger
app.use(logger('dev'));

app.use(cors({ origin: ENV.SPA_ORIGIN, credentials: true }));
app.use(express.json());

// routes
app.use('/api', systemRoutes);
app.use('/api', moviesRoutes);
app.use('/api', actorsRoutes);
app.use('/api', searchRoutes);
app.use('/api', reviewsRoutes);
app.use('/api', oscarRoutes);

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

  // Keep it for major debugging
  //console.error('INTERNAL ERROR:', err);

  res.status(err.statusCode || 500).json({
    ok: false,
    data: null,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Unexpected server error',
    },
  });
});


// error handler
app.use((err, _req, res, _next) => {
  //console.error('INTERNAL ERROR:', err);
  res.status(err.statusCode || 500).json({
    ok: false,
    error: err.message || 'Unexpected error'
  });
});

if (ENV.ENABLE_DOCS === 'true') {
  setupSwagger(app);
}

export default app;