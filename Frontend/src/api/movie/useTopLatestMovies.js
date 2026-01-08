import { useApiQuery } from "../useApiQuery";
import { MovieService } from "./movieService";

/**
 * Accepts:
 * - { ok, data: [...] }
 * - { ok, data: { "0": {...}, "1": {...}, ..., "cast": [] } }
 * - direct array [...]
 * @private
 */
const mapPreviewList = (raw) => {
  // try to extract the actual payload
  const payload = raw?.data?.data ?? raw?.data ?? raw;

  if (Array.isArray(payload)) return payload;

  if (payload && typeof payload === "object") {
    // convert to array
    const values = Object.values(payload);
    // filter out non-object entries (like "cast" etc)
    return values.filter((it) => it && typeof it === "object" && "id" in it);
  }

  return [];
};

/**
 * Query hook for top-rated movies list.
 * @module useTopLatestMovies
 * @category API
 * @param {number} [limit=10]
 * @param {boolean} [enabled=true]
 */
export function useTopRatedMovies(limit = 10, enabled = true) {
  return useApiQuery({
    queryKey: ["movies", "top-rated", limit],
    queryFn: ({ signal }) => MovieService.getTopRated({ limit, signal }),
    select: mapPreviewList,
    enabled,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

/**
 * Query hook for latest movies list.
 * @module useTopLatestMovies
 * @category API
 * @param {number} [limit=10]
 * @param {boolean} [enabled=true]
 */
export function useLatestMovies(limit = 10, enabled = true) {
  return useApiQuery({
    queryKey: ["movies", "latest", limit],
    queryFn: ({ signal }) => MovieService.getLatest({ limit, signal }),
    select: mapPreviewList,
    enabled,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
