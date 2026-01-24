import { useApiQuery } from "../useApiQuery";
import { MovieService } from "./movieService";
import Movie from "../../models/Movie";

/**
 * Query hook that fetches a random movie.
 * @module useRandomMovie
 * @category API
 * @param {boolean} [enabled=false]
 */
export function useRandomMovie(enabled = false) {
  return useApiQuery({
    queryKey: ["movie", "random"],
    queryFn: ({ signal }) => MovieService.getRandomMovie({ signal }),
    select: (data) => (data ? Movie.fromApi(data) : null),
    enabled,
    retry: 1,
  });
}
