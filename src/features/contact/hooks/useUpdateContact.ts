"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useUpdateContact() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.contact.update.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.contact.get.queryFilter()),
    }),
  );
}
