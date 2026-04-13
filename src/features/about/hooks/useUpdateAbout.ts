"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useUpdateAbout() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.about.update.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.about.get.queryFilter()),
    }),
  );
}
