"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useGallery() {
  const trpc = useTRPC();
  return useQuery(trpc.gallery.get.queryOptions());
}
