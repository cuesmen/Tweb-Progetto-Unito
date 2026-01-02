/**
 * @openapi
 * tags:
 *   - name: Movies
 *     description: Operazioni sui film
 */

import express from "express";
import { trySpringGet } from "../utils/helpers.js";
import { buildImageUrl } from "../utils/images.js";

function normalizePoster(p, fallbackPath) {
  if (!p && !fallbackPath) return null;
  if (p?.link) return p;
  if (p?.path) return { ...p, link: buildImageUrl(p.path) };
  if (fallbackPath)
    return { id: p?.id ?? null, link: buildImageUrl(fallbackPath) };
  return null;
}

function normalizePreviewItem(item) {
  const poster = normalizePoster(item.poster, item.posterPath);
  return {
    id: item.id,
    name: item.name,
    date: item.date ?? null,
    description: item.description ?? "",
    rating: item.rating ?? null,
    poster,
    ...item,
    poster,
  };
}

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
router.get("/movies/:id", async (req, res, next) => {
  try {
    const data = await trySpringGet(["/api/movies/:id", "/movies/:id"], req);
    if (!data) {
      return res.status(404).json({
        ok: false,
        data: null,
        error: { code: "MOVIE_NOT_FOUND", message: "Movie not found" },
      });
    }

    const enriched = {
      ...data,
      cast: Array.isArray(data?.cast)
        ? data.cast.map((c) => ({
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

/**
 * @openapi
 * /api/movies/random:
 *   get:
 *     summary: Restituisce un film casuale (shuffle)
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Campi da restituire (es. "id,name,date,description,rating,poster")
 *     responses:
 *       200:
 *         description: Film casuale
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, example: 1000048 }
 *                     name: { type: string, example: "Inception" }
 *                     date: { type: integer, example: 2010 }
 *                     description: { type: string, example: "A mind-bending thriller..." }
 *                     rating: { type: number, example: 4.5 }
 *                     poster:
 *                       type: object
 *                       properties:
 *                         id: { type: integer, example: 1000048 }
 *                         link: { type: string, example: "http://localhost:8080/posters/1000048.jpg" }
 *                 error:
 *                   nullable: true
 *       503:
 *         description: Upstream non disponibile
 */
router.get("/movies/random", async (req, res, next) => {
  try {
    const data = await trySpringGet(
      ["/api/movies/random", "/movies/random"],
      req
    );

    if (!data) {
      return res.status(503).json({
        ok: false,
        data: null,
        error: {
          code: "UPSTREAM_UNAVAILABLE",
          message: "Random movie upstream unavailable",
        },
      });
    }

    const normalizedPoster = (() => {
      const p = data.poster || {};
      if (p?.link) return p;
      if (p?.path) return { ...p, link: buildImageUrl(p.path) };
      if (data.posterPath)
        return { id: p?.id ?? null, link: buildImageUrl(data.posterPath) };
      return null;
    })();

    const enriched = {
      id: data.id,
      name: data.name,
      date: data.date ?? null,
      description: data.description ?? "",
      rating: data.rating ?? null,
      poster: normalizedPoster,
      ...data,
      poster: normalizedPoster,
    };

    res.set("Cache-Control", "no-store");
    return res.json({ ok: true, data: enriched, error: null });
  } catch (e) {
    return next(e);
  }
});

/**
 * @openapi
 * /api/movies/top-rated:
 *   get:
 *     summary: Restituisce i film con rating più alto (preview)
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Numero massimo di risultati
 *     responses:
 *       200:
 *         description: Lista dei film top rated (preview)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer, example: 1000048 }
 *                       name: { type: string, example: "Inception" }
 *                       date: { type: integer, example: 2010 }
 *                       description: { type: string, example: "A mind-bending thriller..." }
 *                       rating: { type: number, example: 4.8 }
 *                       poster:
 *                         type: object
 *                         properties:
 *                           id: { type: integer, example: 1000048 }
 *                           link: { type: string, example: "http://localhost:8080/posters/1000048.jpg" }
 *                 error: { nullable: true }
 *       503:
 *         description: Upstream non disponibile
 */
router.get("/movies/top-rated", async (req, res, next) => {
  try {
    const upstream = await trySpringGet(
      ["/api/movies/top-rated", "/movies/top-rated"],
      req
    );

    if (!upstream || !Array.isArray(upstream)) {
      return res.status(503).json({
        ok: false,
        data: null,
        error: {
          code: "UPSTREAM_UNAVAILABLE",
          message: "Top rated upstream unavailable",
        },
      });
    }

    const data = upstream.map(normalizePreviewItem);

    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=60");
    return res.json({ ok: true, data, error: null });
  } catch (e) {
    return next(e);
  }
});

/**
 * @openapi
 * /api/movies/latest:
 *   get:
 *     summary: Restituisce i film più recenti (preview)
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Numero massimo di risultati
 *     responses:
 *       200:
 *         description: Lista dei film più recenti (preview)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer }
 *                       name: { type: string }
 *                       date: { type: integer }
 *                       description: { type: string }
 *                       rating: { type: number }
 *                       poster:
 *                         type: object
 *                         properties:
 *                           id: { type: integer }
 *                           link: { type: string }
 *                 error: { nullable: true }
 *       503:
 *         description: Upstream non disponibile
 */
router.get("/movies/latest", async (req, res, next) => {
  try {
    const upstream = await trySpringGet(
      ["/api/movies/latest", "/movies/latest"],
      req
    );

    if (!upstream || !Array.isArray(upstream)) {
      return res.status(503).json({
        ok: false,
        data: null,
        error: {
          code: "UPSTREAM_UNAVAILABLE",
          message: "Latest upstream unavailable",
        },
      });
    }

    const data = upstream.map(normalizePreviewItem);

    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=60");
    return res.json({ ok: true, data, error: null });
  } catch (e) {
    return next(e);
  }
});

export default router;
