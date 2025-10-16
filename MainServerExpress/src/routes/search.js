/**
 * @openapi
 * tags:
 *   - name: Search
 *     description: Ricerca di film e attori
 */

import express from 'express';
import { cache } from '../services/cache.js';
import { spring } from '../services/springClient.js';
import { ENV } from '../config/env.js';

const router = express.Router();

/**
 * @openapi
 * /api/search:
 *   get:
 *     summary: Effettua una ricerca di film e attori
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *           example: leo
 *         description: Testo di ricerca
 *     responses:
 *       200:
 *         description: Lista di risultati (film e attori)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   type:
 *                     type: string
 *                     enum: [movie, actor]
 *                   title:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *                     nullable: true
 *                     example: "http://localhost:8080/58.jpg"
 *       400:
 *         description: Query mancante
 */
router.get('/search', async (req, res, next) => {
  const query = req.query.query?.trim();
  if (!query) {
    return res.status(400).json({
      ok: false,
      data: null,
      error: { code: 'MISSING_QUERY', message: 'Query parameter is required' },
    });
  }

  const cacheKey = `search:${query.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json({ ok: true, data: cached, error: null });

  try {
    const { data } = await spring.get(`/api/search`, { params: { query } });

    const processed = Array.isArray(data)
      ? data.map(item => {
          if (item.type === 'actor' && item.imageUrl) {
            const cleanPath = item.imageUrl.replace(/^\/?actors\//, '');
            return { ...item, imageUrl: `${ENV.SPRING_URL}/${cleanPath}` };
          }
          return item;
        })
      : [];

    cache.set(cacheKey, processed);
    res.json({ ok: true, data: processed, error: null });
  } catch (err) {
    next(err);
  }
});


export default router;
