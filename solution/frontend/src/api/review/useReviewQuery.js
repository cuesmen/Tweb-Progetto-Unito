import { useApiQuery } from "../useApiQuery";
import { ReviewService } from "./reviewService";
import Review from "../../models/Review";

/**
 * Loads reviews with caching via useApiQuery.
 * @module useReviewQuery
 * @category API
 * @param {string|number} id
 * @returns {Object} query result
 */
export function useReviewInfoQuery(id) {
  return useApiQuery({
    queryKey: ["reviewmovie", id],
    queryFn: async ({ signal }) => {
      try {
        return await ReviewService.getReviewsByMovieId(id, { signal });
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404) return [];
        if (err?.name === "CanceledError" || err?.name === "AbortError") throw err;
        return [];
      }
    },
    select: (data) =>
      Array.isArray(data)
        ? Review.listFromApi(data)
        : data
        ? [Review.fromApi(data)]
        : [],
    enabled: !!id,
    retry: 0,
    staleTime: Infinity,
    keepPreviousData: true,
  });
}
