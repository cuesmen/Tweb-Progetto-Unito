import { fileURLToPath } from 'url';
import { dirname } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ENV = {
  PORT: process.env.PORT || 4000,
  SPA_ORIGIN: process.env.SPA_ORIGIN || 'http://localhost:5173',
  SPRING_URL: process.env.SPRING_URL || 'http://localhost:8081',
  ENABLE_DOCS: process.env.ENABLE_DOCS ?? 'true',
  IMG_BASE_URL: (process.env.IMG_BASE_URL || `${process.env.SPRING_URL || 'http://localhost:8081'}/`).replace(/\/+$/, '') + '/',
  __dirname,
};
