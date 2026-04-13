import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const updateSchema = z.object({
  whatsapp: z.string().min(1),
  email: z.email(),
  hours: z.string().min(1),
  location: z.string().min(1),
  mapEmbed: z.string().optional(),
});

export const contactRouter = createTRPCRouter({
  get: protectedProcedure.query(async () => {
    const contact = await prisma.contactInfo.findFirst();
    if (!contact) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Informações de contato não encontradas. Execute o seed.",
      });
    }
    return contact;
  }),

  update: protectedProcedure.input(updateSchema).mutation(async ({ input }) => {
    const existing = await prisma.contactInfo.findFirst();
    if (!existing) {
      return prisma.contactInfo.create({ data: input });
    }
    return prisma.contactInfo.update({
      where: { id: existing.id },
      data: input,
    });
  }),
});
