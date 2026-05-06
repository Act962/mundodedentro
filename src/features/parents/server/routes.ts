import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const approachSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const updateSchema = z.object({
  badge: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  approaches: z.array(approachSchema).min(1),
  warningTitle: z.string().min(1),
  warningDescription: z.string().min(1),
  warningSignals: z.array(z.string().min(1)).min(1),
  warningFooter: z.string().min(1),
});

export const parentsRouter = createTRPCRouter({
  get: protectedProcedure.query(async () => {
    const parents = await prisma.parentsContent.findFirst();
    if (!parents) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Conteudo para Pais nao encontrado. Execute o seed.",
      });
    }
    return parents;
  }),

  update: protectedProcedure.input(updateSchema).mutation(async ({ input }) => {
    const existing = await prisma.parentsContent.findFirst();
    if (!existing) {
      return prisma.parentsContent.create({ data: input });
    }
    return prisma.parentsContent.update({
      where: { id: existing.id },
      data: input,
    });
  }),
});
