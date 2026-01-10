/**
 * Tiny query cache and fetch helper used by useApiQuery.
 * @module queryClient
 * @category API
 */

/**
 * Creates an empty cache entry skeleton.
 * @returns {{status: string, data: any, error: any, staleAt: number, inflight: Promise<any>|null, isFetching: boolean, listeners: Set<Function>}}
 */
const createEmptyEntry = () => {
  return {
    status: "idle",
    data: undefined,
    error: null,
    staleAt: 0,
    inflight: null,
    isFetching: false,
    listeners: new Set(),
  };
};

class QueryCache {
  constructor() {
    this.store = new Map();
  }

  /**
   * Returns the cached entry for a key.
   * @param {string} key
   * @returns {Object|undefined}
   */
  get(key) {
    return this.store.get(key);
  }

  /**
   * Writes an entry and notifies subscribers.
   * @param {string} key
   * @param {object|function} updater - Object or updater function receiving previous entry.
   * @returns {object} next entry
   */
  write(key, updater) {
    const prev = this.store.get(key) || createEmptyEntry();
    const next = typeof updater === "function" ? updater(prev) : updater;
    this.store.set(key, next);
    next.listeners?.forEach((listener) => listener());
    return next;
  }

  /**
   * Subscribes to changes for a key.
   * @param {string} key
   * @param {Function} listener
   * @returns {Function} unsubscribe
   */
  subscribe(key, listener) {
    const entry = this.store.get(key) || createEmptyEntry();
    entry.listeners.add(listener);
    this.store.set(key, entry);
    return () => {
      entry.listeners.delete(listener);
      if (!entry.listeners.size && entry.status === "idle") {
        this.store.delete(key);
      }
    };
  }
}

export const queryCache = new QueryCache();

/**
 * Fetches data for a query key, handling deduplication, retries and caching.
 * @param {object} params
 * @param {string} params.key - Cache key.
 * @param {Function} params.queryFn - Async fetcher receiving { signal }.
 * @param {number} [params.staleTime=0] - Milliseconds before data considered stale; `Infinity` never stale.
 * @param {number} [params.retry=0] - Number of retry attempts.
 * @param {boolean} [params.keepPreviousData=true] - Preserve previous data while refetching.
 * @returns {Promise<any>} resolved data.
 */
export async function fetchQuery({
  key,
  queryFn,
  staleTime = 0,
  retry = 0,
  keepPreviousData = true,
}) {
  const base = queryCache.get(key) || createEmptyEntry();

  if (base.inflight) {
    return base.inflight;
  }

  const controller = new AbortController();

  const run = (async () => {
    let lastErr;

    const attempt = async () => {
      const res = await queryFn({ signal: controller.signal });

      if (res?.ok === false) {
        const err = new Error(res?.error?.message || "Unknown error");
        err.code = res?.error?.code;
        throw err;
      }

      return res?.data ?? res ?? null;
    };

    for (let i = 0; i <= retry; i++) {
      try {
        const data = await attempt();
        const nextEntry = {
          ...(queryCache.get(key) || base),
          status: "success",
          data,
          error: null,
          isFetching: false,
          inflight: null,
          staleAt:
            staleTime === Infinity
              ? Number.POSITIVE_INFINITY
              : staleTime <= 0
              ? Number.POSITIVE_INFINITY
              : Date.now() + staleTime,
        };
        queryCache.write(key, nextEntry);
        return data;
      } catch (err) {
        lastErr = err;
        if (i === retry) {
          const erroredEntry = {
            ...(queryCache.get(key) || base),
            status: "error",
            error: err,
            isFetching: false,
            inflight: null,
          };
          queryCache.write(key, erroredEntry);
        }
      }
    }

    throw lastErr;
  })();

  queryCache.write(key, (prev) => ({
    ...(prev || base),
    status:
      prev?.data !== undefined && keepPreviousData ? prev.status : "loading",
    isFetching: true,
    error: null,
    inflight: run,
    data: keepPreviousData ? prev?.data : undefined,
  }));

  return run;
}
