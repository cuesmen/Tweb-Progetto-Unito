import { useQuery } from "@tanstack/react-query";

export function useApiQuery({
  queryKey,
  queryFn,
  select,
  enabled = true,
  retry = 1,
  keepPreviousData = true,
  onError,
}) {
  return useQuery({
    queryKey,
    queryFn: async (ctx) => {
      const res = await queryFn(ctx);

      if (res?.ok === false) {
        const message = res?.error?.message || "Unknown error";
        const err = new Error(message);
        err.code = res?.error?.code;
        throw err;
      }

      const data = res?.data ?? res ?? null;
      return select ? select(data) : data;
    },
    enabled,
    retry,
    keepPreviousData,
    onError: (error) => {
      console.error(`❌ API Query Error [${queryKey.join("/")}] →`, error);
      if (onError) onError(error);
    },
  });
}
