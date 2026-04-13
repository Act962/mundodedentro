import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const updateSchema = z.object({
  tagline: z.string().min(1),
  description: z.string().min(1),
  ctaPrimary: z.string().min(1),
  ctaSecondary: z.string().min(1),
  whatsapp: z.string().min(1),
  bgImage: z.string().min(1),
});

export const heroRouter = createTRPCRouter({
  get: protectedProcedure.query(async () => {
    const hero = await prisma.heroContent.findFirst();
    if (!hero) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Conteúdo hero não encontrado. Execute o seed.",
      });
    }
    return hero;
  }),

  update: protectedProcedure.input(updateSchema).mutation(async ({ input }) => {
    const existing = await prisma.heroContent.findFirst();
    if (!existing) {
      return prisma.heroContent.create({ data: input });
    }
    return prisma.heroContent.update({
      where: { id: existing.id },
      data: input,
    });
  }),
});
