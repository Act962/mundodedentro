"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useDeleteTestimonial() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.testimonials.delete.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.testimonials.get.queryFilter()),
    }),
  );
}
