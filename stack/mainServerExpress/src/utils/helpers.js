/**
 * Helper utilities.
 * @module helpers
 * @category Utils
 */

import { spring } from '../services/springClient.js';

/** @typedef {object} ExpressRequest */

/**
 * Try a list of upstream paths against the Spring backend, interpolating path params.
 * Throws the last error if all attempts fail.
 * @param {string[]} paths Candidate paths (with :params) to try in order.
 * @param {ExpressRequest} req Incoming request used for params/query.
 * @returns {Promise<any>} Upstream response payload.
 */
export async function trySpringGet(paths, req) {
  let lastErr = null;

  for (const p of paths) {
    let url = p;
    for (const [k, v] of Object.entries(req.params || {})) {
      url = url.replace(new RegExp(`:${k}\\b`, 'g'), encodeURIComponent(String(v)));
    }
    try {
      const { data } = await spring.get(url, { params: req.query });
      return data;
    } catch (err) {
      lastErr = err;
      // keep trying the next path
    }
  }

  // if we reach here, all attempts failed
  if (lastErr) throw lastErr;
  throw new Error('Upstream not found');
}