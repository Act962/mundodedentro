"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useReorderTestimonials() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.testimonials.reorder.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.testimonials.get.queryFilter()),
    }),
  );
}
