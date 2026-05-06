"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useUpdateParents() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.parents.update.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.parents.get.queryFilter()),
    }),
  );
}
