import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { fetchQuery, queryCache } from "./queryClient";

/**
 * Custom query hook built on the local query cache.
 * @module useApiQuery
 * @category API
 */

const defaultEntry = {
  status: "idle",
  data: undefined,
  error: null,
  isFetching: false,
  staleAt: 0,
  inflight: null,
};

/**
 * Hook that mirrors a subset of react-query features using the local query cache.
 * @param {object} params
 * @param {Array<string|number>} params.queryKey - Unique key for the query.
 * @param {Function} params.queryFn - Fetcher function receiving { signal }.
 * @param {Function} [params.select] - Optional selector for the fetched data.
 * @param {boolean} [params.enabled=true] - Whether the query is active.
 * @param {number} [params.retry=1] - Retry attempts on failure.
 * @param {boolean} [params.keepPreviousData=true] - Keep old data while refetching.
 * @param {number} [params.staleTime=60000] - Time in ms before data becomes stale.
 * @param {Function} [params.onError] - Error callback.
 */
export function useApiQuery({
  queryKey,
  queryFn,
  select,
  enabled = true,
  retry = 1,
  keepPreviousData = true,
  staleTime = 60_000,
  onError,
}) {
  const key = useMemo(() => queryKey.join("/"), [queryKey]);

  const subscribe = useCallback(
    (listener) => queryCache.subscribe(key, listener),
    [key]
  );

  const getSnapshot = useCallback(
    () => queryCache.get(key) || defaultEntry,
    [key]
  );

  const snapshot = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    if (!enabled) return;
    if (snapshot.inflight) return;

    const now = Date.now();
    const isStale = !snapshot.staleAt || now > snapshot.staleAt;
    const noData = typeof snapshot.data === "undefined";
    const shouldFetch =
      snapshot.status === "idle" ||
      snapshot.status === "error" ||
      (noData && snapshot.status !== "loading") ||
      isStale;

    if (!shouldFetch) return;

    fetchQuery({
      key,
      queryFn,
      retry,
      keepPreviousData,
      staleTime,
    }).catch((error) => {
      console.error(`API Query Error [${key}] →`, error);
      if (onError) onError(error);
    });
  }, [
    enabled,
    key,
    keepPreviousData,
    onError,
    queryFn,
    retry,
    snapshot.data,
    snapshot.inflight,
    snapshot.staleAt,
    snapshot.status,
    staleTime,
  ]);

  const refetch = useCallback(
    async () => {
      const data = await fetchQuery({
        key,
        queryFn,
        retry,
        keepPreviousData,
        staleTime,
      });
      return { data };
    },
    [keepPreviousData, key, queryFn, retry, staleTime]
  );

  const selectCacheRef = useRef({ raw: undefined, selected: null });

  if (snapshot.data !== selectCacheRef.current.raw) {
    selectCacheRef.current = {
      raw: snapshot.data,
      selected:
        select && snapshot.data !== undefined
          ? select(snapshot.data)
          : snapshot.data ?? null,
    };
  }

  const selectedData = selectCacheRef.current.selected;

  const isLoading = snapshot.status === "loading" && !snapshot.data;
  const isFetching = snapshot.isFetching;
  const isError = snapshot.status === "error";

  return {
    data: selectedData,
    error: snapshot.error,
    status: snapshot.status,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
}
