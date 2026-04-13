"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useCreateService() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.services.create.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.services.get.queryFilter()),
    }),
  );
}
