import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const photoSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  label: z.string().min(1),
  order: z.number().int().min(0).default(0),
});

export const galleryRouter = createTRPCRouter({
  get: protectedProcedure.query(() =>
    prisma.galleryPhoto.findMany({ orderBy: { order: "asc" } }),
  ),

  create: protectedProcedure
    .input(photoSchema)
    .mutation(({ input }) => prisma.galleryPhoto.create({ data: input })),

  update: protectedProcedure
    .input(photoSchema.extend({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const existing = await prisma.galleryPhoto.findUnique({ where: { id } });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Foto não encontrada.",
        });
      }
      return prisma.galleryPhoto.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const existing = await prisma.galleryPhoto.findUnique({
        where: { id: input.id },
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Foto não encontrada.",
        });
      }
      return prisma.galleryPhoto.delete({ where: { id: input.id } });
    }),

  reorder: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      await Promise.all(
        input.ids.map((id, index) =>
          prisma.galleryPhoto.update({ where: { id }, data: { order: index } }),
        ),
      );
      return { ok: true };
    }),
});
