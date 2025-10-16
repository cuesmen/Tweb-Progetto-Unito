import { useApiQuery } from "../useApiQuery";
import { ActorInfoService } from "./actorInfoService";
import ActorInfo from "../../models/ActorInfo";


export function useActorInfoQuery(id) {
  return useApiQuery({
    queryKey: ["actorInfo", id],
    queryFn: ({ signal }) => ActorInfoService.getActorInfoById(id, { signal }),
    select: (data) => (data ? ActorInfo.fromApi(data) : null),
    enabled: !!id,
  });
}