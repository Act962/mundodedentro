"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useCreateTeamMember() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.team.create.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.team.get.queryFilter()),
    }),
  );
}
