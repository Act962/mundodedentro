"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useServices() {
  const trpc = useTRPC();
  return useQuery(trpc.services.get.queryOptions());
}
