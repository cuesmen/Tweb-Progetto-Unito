/**
 * Axios client configured for the Spring backend.
 * @module springClient
 * @category Services
 */

import axios from 'axios';
import { ENV } from '../config/env.js';

/** Shared Axios instance targeting SPRING_URL with a default timeout. */
export const spring = axios.create({
  baseURL: ENV.SPRING_URL,
  timeout: 5000,
});
