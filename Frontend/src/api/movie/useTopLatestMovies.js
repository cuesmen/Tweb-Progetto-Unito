import { useApiQuery } from "../useApiQuery";
import { MovieService } from "./movieService";

/**
 * Accetta:
 * - { ok, data: [...] }
 * - { ok, data: { "0": {...}, "1": {...}, ..., "cast": [] } }
 * - direttamente un array
 */
const mapPreviewList = (raw) => {
  // prova a unwrappare varie forme
  const payload = raw?.data?.data ?? raw?.data ?? raw;

  if (Array.isArray(payload)) return payload;

  if (payload && typeof payload === "object") {
    // converte oggetto con chiavi numeriche in array
    const values = Object.values(payload);
    // filtra solo item che hanno un id (evita "cast": [])
    return values.filter((it) => it && typeof it === "object" && "id" in it);
  }

  return [];
};

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
