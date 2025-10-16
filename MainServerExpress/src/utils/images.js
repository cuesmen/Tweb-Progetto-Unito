import { ENV } from '../config/env.js';

export function buildImageUrl(imagePath) {
  if (!imagePath) return null;
  return ENV.IMG_BASE_URL + encodeURIComponent(String(imagePath));
}
