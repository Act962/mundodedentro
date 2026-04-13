"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useUpdateGeneral() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.general.update.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.general.get.queryFilter()),
    }),
  );
}
