/**
 * Image utilities.
 * @module images
 * @category Utils
 */

import { ENV } from '../config/env.js';

/**
 * Builds an absolute image URL using the configured IMG_BASE_URL.
 * @param {string} imagePath Relative path returned by upstream.
 * @returns {string|null} Encoded absolute URL or null when missing.
 */
export function buildImageUrl(imagePath) {
  if (!imagePath) return null;
  return ENV.IMG_BASE_URL + encodeURIComponent(String(imagePath));
}
