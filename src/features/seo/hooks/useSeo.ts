"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useSeoAll() {
  const trpc = useTRPC();
  return useQuery(trpc.seo.getAll.queryOptions());
}
