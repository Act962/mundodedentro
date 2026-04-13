import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const serviceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export const servicesRouter = createTRPCRouter({
  get: protectedProcedure.query(() =>
    prisma.service.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }],
    }),
  ),

  create: protectedProcedure
    .input(serviceSchema)
    .mutation(({ input }) => prisma.service.create({ data: input })),

  update: protectedProcedure
    .input(serviceSchema.extend({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const existing = await prisma.service.findUnique({ where: { id } });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Serviço não encontrado.",
        });
      }
      return prisma.service.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const existing = await prisma.service.findUnique({
        where: { id: input.id },
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Serviço não encontrado.",
        });
      }
      return prisma.service.delete({ where: { id: input.id } });
    }),

  reorder: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      await Promise.all(
        input.ids.map((id, index) =>
          prisma.service.update({ where: { id }, data: { order: index } }),
        ),
      );
      return { ok: true };
    }),
});
