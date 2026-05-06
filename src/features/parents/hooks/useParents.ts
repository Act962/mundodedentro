"use client";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export type ParentsQueryData = {
  badge: string;
  title: string;
  description: string;
  approaches: unknown;
  warningTitle: string;
  warningDescription: string;
  warningSignals: string[];
  warningFooter: string;
};

export function useParents() {
  const trpc = useTRPC();
  return useQuery(
    trpc.parents.get.queryOptions(),
  ) as UseQueryResult<ParentsQueryData>;
}
