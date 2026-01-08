import { spring } from '../services/springClient.js';

export async function trySpringGet(paths, req) {
  let lastErr = null;
  for (const p of paths) {
    let url = p;
    for (const [k, v] of Object.entries(req.params || {})) {
      url = url.replace(new RegExp(`:${k}\\b`, 'g'), encodeURIComponent(String(v)));
    }
    try {
      const { data } = await spring.get(url, { params: req.query });
      return data;
    } catch (err) {
      //console.log(err);
      lastErr = err;
      throw err;
    }
  }
  throw lastErr ?? new Error('Upstream not found');
}
