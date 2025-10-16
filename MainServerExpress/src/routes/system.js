/**
 * @openapi
 * tags:
 *   - name: System
 *     description: Operazioni di sistema e healthcheck
 */

import express from 'express';
const router = express.Router();

/**
 * @openapi
 * /api/ping:
 *   get:
 *     summary: Verifica lo stato del gateway
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Gateway attivo
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
