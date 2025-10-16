import axios from 'axios';
import { ENV } from '../config/env.js';

export const spring = axios.create({
  baseURL: ENV.SPRING_URL,
  timeout: 5000,
});
