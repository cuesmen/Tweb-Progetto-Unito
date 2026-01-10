/**
 * Movie review routes.
 * @module reviewmovie
 * @category Routes
 */

import express from "express";
import { trySpringGet } from '../utils/helpers.js';

const router = express.Router();

/**
   * @openapi
   * tags:
   *   - name: Reviews
   *     description: Movie reviews
   */

/**
   * @openapi
   * /api/reviewmovie/{movie_id}:
   *   get:
   *     summary: Return reviews for a movie
   *     tags: [Reviews]
   *     parameters:
   *       - in: path
   *         name: movie_id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Movie ID
   *     responses:
   *       200:
   *         description: List of reviews for the movie
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
   *                     example: "Great cinematography and score."
   *       404:
   *         description: No reviews found for the movie
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
