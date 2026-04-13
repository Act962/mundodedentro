import { z } from "zod";
import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const upsertSchema = z.object({
  page: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  ogImage: z.string().optional(),
});

export const seoRouter = createTRPCRouter({
  getAll: protectedProcedure.query(() =>
    prisma.seoSettings.findMany({ orderBy: { page: "asc" } }),
  ),

  getByPage: protectedProcedure
    .input(z.object({ page: z.string().min(1) }))
    .query(({ input }) =>
      prisma.seoSettings.findUnique({ where: { page: input.page } }),
    ),

  upsert: protectedProcedure.input(upsertSchema).mutation(({ input }) =>
    prisma.seoSettings.upsert({
      where: { page: input.page },
      create: input,
      update: input,
    }),
  ),
});
