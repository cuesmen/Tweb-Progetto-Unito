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
 * @type {{PORT:number, SPA_ORIGIN:string, SPRING_URL:string, ENABLE_DOCS:string, IMG_BASE_URL:string, MONGO_URI:string, MONGO_DB:string, MONGO_MAX_RETRIES:number, MONGO_MIN_POOL_SIZE:number, MONGO_MAX_POOL_SIZE:number, __dirname:string}}
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

  // MongoDB configuration
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017',
  MONGO_DB: process.env.MONGO_DB || 'appdb',
  MONGO_MAX_RETRIES: Number(process.env.MONGO_MAX_RETRIES ?? 5),
  MONGO_MIN_POOL_SIZE: Number(process.env.MONGO_MIN_POOL_SIZE ?? 0),
  MONGO_MAX_POOL_SIZE: Number(process.env.MONGO_MAX_POOL_SIZE ?? 20),

  __dirname,
};
