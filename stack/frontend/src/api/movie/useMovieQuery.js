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
        // On any other error (including aborted), return null so cache goes success and stops refetch loop.
        return null;
      }
    },
    select: (data) => (data ? Movie.fromApi(data) : null),
    enabled: !!id,
    retry: 0,
    staleTime: Infinity,
    keepPreviousData: true,
  });
}
