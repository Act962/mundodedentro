"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useTestimonials() {
  const trpc = useTRPC();
  return useQuery(trpc.testimonials.get.queryOptions());
}
