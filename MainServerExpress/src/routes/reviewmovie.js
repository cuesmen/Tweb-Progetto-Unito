/**
 * @openapi
 * tags:
 *   - name: Reviews
 *     description: Operazioni sui film
 */

import express from "express";
import { trySpringGet } from '../utils/helpers.js';

const router = express.Router();

/**
   * @openapi
   * /api/reviewmovie/{movie_id}:
   *   get:
   *     summary: Restituisce le review di un film
   *     tags: [Reviews]
   *     parameters:
   *       - in: path
   *         name: movie_id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del film
   *     responses:
   *       200:
   *         description: Elenco delle review del film
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                     example: 123
   *                   movieId:
   *                     type: integer
   *                     example: 42
   *                   critic_name:
   *                     type: string
   *                     example: "John Doe"
   *                   top_critic:
   *                     type: string
   *                     example: "true"
   *                   publisher_name:
   *                     type: string
   *                     example: "The Film Times"
   *                   review_type:
   *                     type: string
   *                     example: "fresh"
   *                   review_score:
   *                     type: string
   *                     example: "8/10"
   *                   review_date:
   *                     type: string
   *                     format: date
   *                     example: "2023-05-01"
   *                   review_content:
   *                     type: string
   *                     example: "Ottima fotografia e colonna sonora."
   *       404:
   *         description: Nessuna review trovata per il film
   */
router.get("/reviewmovie/:id", async (req, res, next) => {
  try {
    const data = await trySpringGet(["/api/reviewmovie/:id", "/reviewmovie/:id"], req);
    if (!data) {
      return res.status(404).json({
        ok: false,
        data: null,
        error: { code: "REVIEWMOVIE_NOT_FOUND", message: "Review not found" },
      });
    }

    res.json({ ok: true, data: data, error: null });
  } catch (e) {
    next(e);
  }
});

export default router;
