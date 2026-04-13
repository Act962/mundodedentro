import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const updateSchema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().min(1),
  logo: z.string().min(1),
  whatsapp: z.string().min(1),
  email: z.email(),
  hours: z.string().min(1),
  location: z.string().min(1),
  mapEmbed: z.string().optional(),
  instagramUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
});

export const generalRouter = createTRPCRouter({
  get: protectedProcedure.query(async () => {
    const settings = await prisma.generalSettings.findFirst();
    if (!settings) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Configurações gerais não encontradas. Execute o seed.",
      });
    }
    return settings;
  }),

  update: protectedProcedure.input(updateSchema).mutation(async ({ input }) => {
    const existing = await prisma.generalSettings.findFirst();
    if (!existing) {
      return prisma.generalSettings.create({ data: input });
    }
    return prisma.generalSettings.update({
      where: { id: existing.id },
      data: input,
    });
  }),
});
