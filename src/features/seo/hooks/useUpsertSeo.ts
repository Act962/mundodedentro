"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useUpsertSeo() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.seo.upsert.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.seo.getAll.queryFilter()),
    }),
  );
}
