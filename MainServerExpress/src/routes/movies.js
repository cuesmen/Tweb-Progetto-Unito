/**
 * @openapi
 * tags:
 *   - name: Movies
 *     description: Operazioni sui film
 */

import express from 'express';
import { trySpringGet } from '../utils/helpers.js';
import { buildImageUrl } from '../utils/images.js';

const router = express.Router();

/**
 * @openapi
 * /api/movies/{id}:
 *   get:
 *     summary: Restituisce il dettaglio di un film
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del film
 *     responses:
 *       200:
 *         description: Dati del film
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1000048
 *                 name:
 *                   type: string
 *                   example: "Inception"
 *                 cast:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       actorId:
 *                         type: integer
 *                         example: 84742
 *                       name:
 *                         type: string
 *                         example: "Leonardo DiCaprio"
 *                       imageUrl:
 *                         type: string
 *                         example: "http://localhost:8080/actors/58.jpg"
 *       404:
 *         description: Film non trovato
 */
router.get('/movies/:id', async (req, res, next) => {
  try {
    const data = await trySpringGet(['/api/movies/:id', '/movies/:id'], req);
    if (!data) {
      return res.status(404).json({
        ok: false,
        data: null,
        error: { code: 'MOVIE_NOT_FOUND', message: 'Movie not found' },
      });
    }

    const enriched = {
      ...data,
      cast: Array.isArray(data?.cast)
        ? data.cast.map(c => ({
            ...c,
            imageUrl: c.imagePath ? buildImageUrl(c.imagePath) : null,
          }))
        : [],
    };

    res.json({ ok: true, data: enriched, error: null });
  } catch (e) {
    next(e);
  }
});


export default router;
