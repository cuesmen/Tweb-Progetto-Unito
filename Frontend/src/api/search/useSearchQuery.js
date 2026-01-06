import { useApiQuery } from "../useApiQuery";
import { SearchService } from "./searchService";

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
