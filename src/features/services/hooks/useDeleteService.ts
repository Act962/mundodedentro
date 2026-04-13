"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useDeleteService() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.services.delete.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.services.get.queryFilter()),
    }),
  );
}
