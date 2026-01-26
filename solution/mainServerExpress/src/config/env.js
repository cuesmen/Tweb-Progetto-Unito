/**
 * Environment configuration loader.
 * @module env
 * @category Config
 */

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Normalized environment values with sane defaults for local development.
 * @type {{PORT:number, SPA_ORIGIN:string, SPRING_URL:string, ENABLE_DOCS:string, IMG_BASE_URL:string, MIDDLE_SOCKET_URL:string, __dirname:string}}
 */
export const ENV = {
  // Server base
  PORT: process.env.PORT || 4000,
  SPA_ORIGIN: process.env.SPA_ORIGIN || 'http://localhost:5173',

  // Java Spring backend base URL
  SPRING_URL: process.env.SPRING_URL || 'http://localhost:8081',

  // Docs and images
  ENABLE_DOCS: process.env.ENABLE_DOCS ?? 'true',
  IMG_BASE_URL:
    (process.env.IMG_BASE_URL ||
      `${process.env.SPRING_URL || 'http://localhost:8081'}/`)
      .replace(/\/+$/, '') + '/',

  // Middle HTTP endpoint
  MIDDLE_URL: process.env.MIDDLE_URL || 'http://localhost:4001',
  // Middle layer Socket.IO endpoint
  MIDDLE_SOCKET_URL: process.env.MIDDLE_SOCKET_URL || 'http://localhost:4001',

  __dirname,
};
