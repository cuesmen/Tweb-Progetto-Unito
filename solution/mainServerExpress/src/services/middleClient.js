/**
 * Axios client configured for the middle Express server.
 * @module middleClient
 * @category Services
 */

import axios from 'axios';
import { ENV } from '../config/env.js';

/** Shared Axios instance targeting MIDDLE_URL with a default timeout. */
export const axiosMiddleClient = axios.create({
  baseURL: ENV.MIDDLE_URL,
  timeout: 10000,
});
