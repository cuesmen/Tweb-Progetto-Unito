import { useApiQuery } from "../useApiQuery";
import { SearchService } from "./searchService";

/**
 * Query hook for search results (movies + actors).
 * @module useSearchQuery
 * @category API
 * @param {string} query
 * @returns {Object} query result
 */
export function useSearchQuery(query) {
  return useApiQuery({
    queryKey: ["search", query],
    queryFn: ({ signal }) => SearchService.search(query, { signal }),
    select: (res) => res?.data ?? res ?? [],
    enabled: !!query && query.length >= 2,
    staleTime: 60 * 1000,
    keepPreviousData: true,
  });
}
