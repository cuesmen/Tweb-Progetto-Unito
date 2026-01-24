/**
 * System routes.
 * @module system
 * @category Routes
 */

import express from 'express';
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: System
 *     description: System operations and healthcheck
 */

/**
 * @openapi
 * /api/ping:
 *   get:
 *     summary: Check gateway health
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Gateway is up
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 */
router.get('/ping', (_req, res) => {
    res.json({ ok: true, data: { message: 'pong' }, error: null });
  });
  

export default router;
