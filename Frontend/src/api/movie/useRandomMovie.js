import { useApiQuery } from "../useApiQuery";
import { MovieService } from "./movieService";
import Movie from "../../models/Movie";

export function useRandomMovie(enabled = false) {
  return useApiQuery({
    queryKey: ["movie", "random"],
    queryFn: ({ signal }) => MovieService.getRandomMovie({ signal }),
    select: (data) => (data ? Movie.fromApi(data) : null),
    enabled,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
