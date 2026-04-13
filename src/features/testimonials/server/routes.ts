import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const testimonialSchema = z.object({
  text: z.string().min(1),
  author: z.string().min(1),
  rating: z.number().int().min(1).max(5).default(5),
  photo: z.string().optional(),
  order: z.number().int().min(0).default(0),
});

export const testimonialsRouter = createTRPCRouter({
  get: protectedProcedure.query(() =>
    prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
  ),

  create: protectedProcedure
    .input(testimonialSchema)
    .mutation(({ input }) => prisma.testimonial.create({ data: input })),

  update: protectedProcedure
    .input(testimonialSchema.extend({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const existing = await prisma.testimonial.findUnique({ where: { id } });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Depoimento não encontrado.",
        });
      }
      return prisma.testimonial.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const existing = await prisma.testimonial.findUnique({
        where: { id: input.id },
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Depoimento não encontrado.",
        });
      }
      return prisma.testimonial.delete({ where: { id: input.id } });
    }),

  reorder: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      await Promise.all(
        input.ids.map((id, index) =>
          prisma.testimonial.update({ where: { id }, data: { order: index } }),
        ),
      );
      return { ok: true };
    }),
});
