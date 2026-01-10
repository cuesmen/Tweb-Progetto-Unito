/**
 * Actor routes.
 * @module actors
 * @category Routes
 */

import express from 'express';
import { trySpringGet } from '../utils/helpers.js';
import { buildImageUrl } from '../utils/images.js';
import { genderTextOf } from '../utils/gender.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Actors
 *     description: Actor information
 */

/**
 * @openapi
 * /api/actors/{actorId}/info:
 *   get:
 *     summary: Return actor details
 *     tags: [Actors]
 *     parameters:
 *       - in: path
 *         name: actorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Actor ID
 *     responses:
 *       200:
 *         description: Actor detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 actorId:
 *                   type: integer
 *                   example: 84742
 *                 name:
 *                   type: string
 *                   example: "Leonardo DiCaprio"
 *                 biography:
 *                   type: string
 *                 genderText:
 *                   type: string
 *                   example: "Male"
 *                 imageUrl:
 *                   type: string
 *                   example: "http://localhost:8080/58.jpg"
 *       404:
 *         description: Actor not found
 */
router.get('/actors/:actorId/info', async (req, res, next) => {
  try {
    const data = await trySpringGet(
      ['/api/actors/:actorId/info', '/actors/:actorId/info'],
      req
    );

    if (!data) {
      return res.status(404).json({
        ok: false,
        data: null,
        error: {
          code: 'ACTOR_NOT_FOUND',
          message: `Actor not found for id=${req.params.actorId}`,
        },
      });
    }

    const enriched = {
      ...data,
      imageUrl: buildImageUrl(data?.imagePath),
      genderText: genderTextOf(data?.gender),
    };

    res.json({ ok: true, data: enriched, error: null });
  } catch (e) {
    next(e);
  }
});


export default router;
