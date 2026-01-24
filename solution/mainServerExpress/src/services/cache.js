/**
 * In-memory caching layer for transient data.
 * @module cache
 * @category Services
 */

import NodeCache from 'node-cache';

/** NodeCache instance with 60s TTL and 120s cleanup interval. */
export const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });
