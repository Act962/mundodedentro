"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useUpdateService() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.services.update.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.services.get.queryFilter()),
    }),
  );
}
