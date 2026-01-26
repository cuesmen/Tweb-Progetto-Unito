/**
 * Movie review routes (Mongo-backed).
 * @module reviewRoutes
 * @category Routes
 */

import express from 'express';
import { listReviewsByMovie, normalizeMovieId } from '../controllers/review.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Reviews
 *     description: Movie reviews stored in MongoDB
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
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       movie_id:
 *                         type: integer
 *                         example: 42
 *                       critic_name:
 *                         type: string
 *                         example: "John Doe"
 *                       top_critic:
 *                         type: boolean
 *                         example: true
 *                       publisher_name:
 *                         type: string
 *                         example: "The Film Times"
 *                       review_type:
 *                         type: string
 *                         example: "Fresh"
 *                       review_score:
 *                         type: string
 *                         example: "8/10"
 *                       review_date:
 *                         type: string
 *                         format: date
 *                         example: "2023-05-01"
 *                       review_content:
 *                         type: string
 *                         example: "Great cinematography and score."
 *                 error:
 *                   type: string
 *                   nullable: true
 *       400:
 *         description: Invalid movie id
 *       404:
 *         description: No reviews found for the movie
 */
router.get('/reviewmovie/:movieId', async (req, res, next) => {
  try {
    const movieId = normalizeMovieId(req.params.movieId);
    if (!movieId) {
      return res.status(400).json({
        ok: false,
        data: null,
        error: { code: 'BAD_MOVIE_ID', message: 'movie_id must be a positive integer' },
      });
    }

    const reviews = await listReviewsByMovie(movieId);

    if (!reviews.length) {
      return res.status(404).json({
        ok: false,
        data: null,
        error: { code: 'REVIEWS_NOT_FOUND', message: 'No reviews for this movie' },
      });
    }

    res.json({ ok: true, data: reviews, error: null });
  } catch (err) {
    next(err);
  }
});

export default router;
