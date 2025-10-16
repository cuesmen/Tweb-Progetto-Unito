import { useQuery } from "@tanstack/react-query";
import { SearchService } from "./searchService";


export function useSearchQuery(query) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: ({ signal }) => SearchService.search(query, { signal }),
    select: (res) => res?.data ?? [],
    enabled: !!query && query.length >= 2,
    staleTime: 60 * 1000,
    keepPreviousData: true,
  });
}
