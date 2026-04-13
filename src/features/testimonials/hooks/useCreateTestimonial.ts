"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useCreateTestimonial() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.testimonials.create.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.testimonials.get.queryFilter()),
    }),
  );
}
