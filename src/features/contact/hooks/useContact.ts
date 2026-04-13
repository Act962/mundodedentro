"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useContact() {
  const trpc = useTRPC();
  return useQuery(trpc.contact.get.queryOptions());
}
