"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useUpdateHero() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.hero.update.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.hero.get.queryFilter()),
    }),
  );
}
