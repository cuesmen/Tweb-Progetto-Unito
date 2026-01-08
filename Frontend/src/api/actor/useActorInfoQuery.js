import { useApiQuery } from "../useApiQuery";
import { ActorInfoService } from "./actorInfoService";
import ActorInfo from "../../models/ActorInfo";

/**
 * Loads actor info with caching via useApiQuery.
 * @module api/actor/useActorInfoQuery
 * @category API
 * @param {string|number} id
 * @returns {Object} query result
 */
export function useActorInfoQuery(id) {
  return useApiQuery({
    queryKey: ["actorInfo", id],
    queryFn: async ({ signal }) => {
      try {
        return await ActorInfoService.getActorInfoById(id, { signal });
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404) return null;
        if (err?.name === "CanceledError" || err?.name === "AbortError") throw err;
        return null;
      }
    },
    select: (data) => (data ? ActorInfo.fromApi(data) : null),
    enabled: !!id,
    retry: 0,
    staleTime: Infinity,
    keepPreviousData: true,
  });
}
