import { useApiQuery } from "../useApiQuery";
import { MovieService } from "./movieService";
import Movie from "../../models/Movie";

export function useMovieQuery(id) {
  return useApiQuery({
    queryKey: ["movie", id],
    queryFn: ({ signal }) => MovieService.getMovieById(id, { signal }),
    select: (data) => (data ? Movie.fromApi(data) : null),
    enabled: !!id,
  });
}