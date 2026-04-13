"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useUpdateTestimonial() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.testimonials.update.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.testimonials.get.queryFilter()),
    }),
  );
}
