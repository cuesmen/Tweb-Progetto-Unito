import { useApiQuery } from "../useApiQuery";
import { OscarAwardService } from "./oscarAwardService";
import OscarAward from "../../models/OscarAward";

/**
 * Loads Oscar awards for either an actor or a movie (one of the two).
 * @module useOscarAwardQuery
 * @category API
 * @param {Object} params
 * @param {number} [params.actorId]
 * @param {number} [params.movieId]
 * @param {boolean} [params.enabled=true]
 */
export function useOscarAwardQuery({ actorId, movieId, enabled = true }) {
  const key = actorId ? ["oscaraward", "actor", actorId] : movieId ? ["oscaraward", "movie", movieId] : null;
  const fetcher = ({ signal }) => {
    if (actorId) return OscarAwardService.getByActorId(actorId, { signal });
    if (movieId) return OscarAwardService.getByMovieId(movieId, { signal });
    return Promise.resolve([]);
  };

  return useApiQuery({
    queryKey: key || ["oscaraward", "idle"],
    queryFn: async ({ signal }) => {
      try {
        return await fetcher({ signal });
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404) return [];
        if (err?.name === "CanceledError" || err?.name === "AbortError") throw err;
        return [];
      }
    },
    select: (data) => (Array.isArray(data) ? OscarAward.listFromApi(data) : []),
    enabled: enabled && !!(actorId || movieId),
    retry: 0,
    staleTime: Infinity,
    keepPreviousData: true,
  });
}
