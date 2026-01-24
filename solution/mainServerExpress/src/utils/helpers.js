/**
 * Helper utilities.
 * @module helpers
 * @category Utils
 */

import { axiosClient } from '../services/client.js';

/** @typedef {object} ExpressRequest */

/**
 * Try a list of upstream paths against the backend, interpolating path params.
 * Throws the last error if all attempts fail.
 * @param {string[]} paths Candidate paths (with :params) to try in order.
 * @param {ExpressRequest} req Incoming request used for params/query.
 * @returns {Promise<any>} Upstream response payload.
 */
export async function tryAxiosGet(paths, req) {
  let lastErr = null;

  for (const p of paths) {
    let url = p;
    const params = req?.params || {};   // req can be null/undefined; default to empty object
    const query = req?.query;           // query is optional

    // interpolate path params like :id using provided params
    for (const [k, v] of Object.entries(params)) {
      url = url.replace(new RegExp(`:${k}\\b`, 'g'), encodeURIComponent(String(v)));
    }

    try {
      const { data } = await axiosClient.get(url, { params: query });
      return data;
    } catch (err) {
      lastErr = err;
      console.error('[AXIOS GET] failed', {
        url,
        status: err?.response?.status,
        code: err?.code,
        message: err?.message,
        params,
        query,
      });
      // keep trying the next candidate path
    }
  }

  // all attempts failed
  if (lastErr) throw lastErr;
  throw new Error('Upstream not found');
}
