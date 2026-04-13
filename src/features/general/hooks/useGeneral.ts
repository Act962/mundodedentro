"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useGeneral() {
  const trpc = useTRPC();
  return useQuery(trpc.general.get.queryOptions());
}
