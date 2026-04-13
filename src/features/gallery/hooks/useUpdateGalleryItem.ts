"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useUpdateGalleryItem() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.gallery.update.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.gallery.get.queryFilter()),
    }),
  );
}
