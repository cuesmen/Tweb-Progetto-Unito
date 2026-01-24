/**
 * Axios client configured for the Spring backend.
 * @module client
 * @category Services
 */

import axios from 'axios';
import { ENV } from '../config/env.js';

/** Shared Axios instance targeting SPRING_URL with a default timeout. */
export const axiosClient = axios.create({
  baseURL: ENV.SPRING_URL,
  timeout: 10000,
});
