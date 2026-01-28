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
 * @type {{PORT:number, SERVER_ORIGIN:string, ENABLE_DOCS:string, IMG_BASE_URL:string, MONGO_URI:string, MONGO_DB:string, __dirname:string}}
 */
export const ENV = {
  // Server base
  PORT: process.env.PORT || 4000,
  SERVER_ORIGIN: process.env.SERVER_ORIGIN || 'http://localhost:4000',
  // Docs and images
  ENABLE_DOCS: process.env.ENABLE_DOCS ?? 'true',
  IMG_BASE_URL:
    (process.env.IMG_BASE_URL ||
      `${process.env.SPRING_URL || 'http://localhost:8081'}/`)
      .replace(/\/+$/, '') + '/',

  // MongoDB configuration
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017',
  MONGO_DB: process.env.MONGO_DB || 'moviepoint',

  __dirname,
};
