import { useApiQuery } from "../useApiQuery";
import { MovieService } from "./movieService";
import Movie from "../../models/Movie";

/**
 * Query hook for a single movie by id.
 * @module useMovieQuery
 * @category API
 * @param {string|number} id
 */
export function useMovieQuery(id) {
  return useApiQuery({
    queryKey: ["movie", id],
    queryFn: async ({ signal }) => {
      try {
        return await MovieService.getMovieById(id, { signal });
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404) return null;
        // On other errors, bubble up so the UI can show a server/connectivity error.
        throw err;
      }
    },
    select: (data) => (data ? Movie.fromApi(data) : null),
    enabled: !!id,
    retry: 0,
    staleTime: Infinity,
    keepPreviousData: true,
  });
}
