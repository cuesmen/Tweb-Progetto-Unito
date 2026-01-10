/**
 * Oscar awards routes.
 * @module oscarawards
 * @category Routes
 */

import express from "express";
import { trySpringGet } from "../utils/helpers.js";

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: OscarAwards
 *     description: Oscar details for movies and actors
 */

/**
 * @openapi
 * /api/oscaraward/actor/{actor_id}:
 *   get:
 *     summary: Return Oscars obtained by an actor
 *     tags: [OscarAwards]
 *     parameters:
 *       - in: path
 *         name: actor_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Actor ID
 *     responses:
 *       200:
 *         description: Actor Oscars list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   yearFilm:
 *                     type: string
 *                     example: "1994"
 *                   yearCeremony:
 *                     type: string
 *                     example: "1995"
 *                   category:
 *                     type: string
 *                     example: "Best Actor"
 *                   name:
 *                     type: string
 *                     example: "Tom Hanks"
 *                   film:
 *                     type: string
 *                     example: "Forrest Gump"
 *                   winner:
 *                     type: boolean
 *                     example: true
 *                   actorId:
 *                     type: integer
 *                     example: 42
 *                   movieId:
 *                     type: integer
 *                     example: 100
 *       404:
 *         description: No Oscars found for the actor
 */
router.get("/oscaraward/actor/:actor_id", async (req, res, next) => {
  try {
    const data = await trySpringGet(
      ["/api/oscaraward/actor/:actor_id", "/oscaraward/actor/:actor_id"],
      req
    );

    if (!data) {
      return res.status(404).json({
        ok: false,
        data: null,
        error: { code: "OSCARAWARD_NOT_FOUND", message: "Oscar award not found" },
      });
    }

    res.json({ ok: true, data, error: null });
  } catch (e) {
    next(e);
  }
});

/**
 * @openapi
 * /api/oscaraward/movie/{movie_id}:
 *   get:
 *     summary: Return Oscars obtained by a movie
 *     tags: [OscarAwards]
 *     parameters:
 *       - in: path
 *         name: movie_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie Oscars list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   yearFilm:
 *                     type: string
 *                     example: "1994"
 *                   yearCeremony:
 *                     type: string
 *                     example: "1995"
 *                   category:
 *                     type: string
 *                     example: "Best Picture"
 *                   name:
 *                     type: string
 *                     example: "Forrest Gump"
 *                   film:
 *                     type: string
 *                     example: "Forrest Gump"
 *                   winner:
 *                     type: boolean
 *                     example: true
 *                   actorId:
 *                     type: integer
 *                     example: 42
 *                   movieId:
 *                     type: integer
 *                     example: 100
 *       404:
 *         description: No Oscars found for the movie
 */
router.get("/oscaraward/movie/:movie_id", async (req, res, next) => {
  try {
    const data = await trySpringGet(
      ["/api/oscaraward/movie/:movie_id", "/oscaraward/movie/:movie_id"],
      req
    );

    if (!data) {
      return res.status(404).json({
        ok: false,
        data: null,
        error: { code: "OSCARAWARD_NOT_FOUND", message: "Oscar award not found" },
      });
    }

    res.json({ ok: true, data, error: null });
  } catch (e) {
    next(e);
  }
});

export default router;
