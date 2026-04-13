import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const updateSchema = z.object({
  title: z.string().min(1),
  historyText: z.string().min(1),
  philosophyTitle: z.string().min(1),
  philosophyText: z.string().min(1),
  targetAudience: z.string().min(1),
  yearsExperience: z.number().int().min(0),
  photo: z.string().optional(),
});

export const aboutRouter = createTRPCRouter({
  get: protectedProcedure.query(async () => {
    const about = await prisma.aboutContent.findFirst();
    if (!about) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Conteúdo Sobre não encontrado. Execute o seed.",
      });
    }
    return about;
  }),

  update: protectedProcedure.input(updateSchema).mutation(async ({ input }) => {
    const existing = await prisma.aboutContent.findFirst();
    if (!existing) {
      return prisma.aboutContent.create({ data: input });
    }
    return prisma.aboutContent.update({
      where: { id: existing.id },
      data: input,
    });
  }),
});
