import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const memberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  specialties: z.array(z.string().min(1)).min(1),
  photo: z.string().optional(),
  isLeader: z.boolean().default(false),
  bio: z.string().optional(),
  order: z.number().int().min(0).default(0),
});

export const teamRouter = createTRPCRouter({
  get: protectedProcedure.query(() =>
    prisma.teamMember.findMany({
      orderBy: [{ isLeader: "desc" }, { order: "asc" }],
    }),
  ),

  create: protectedProcedure
    .input(memberSchema)
    .mutation(({ input }) => prisma.teamMember.create({ data: input })),

  update: protectedProcedure
    .input(memberSchema.extend({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const existing = await prisma.teamMember.findUnique({ where: { id } });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profissional não encontrado.",
        });
      }
      return prisma.teamMember.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const existing = await prisma.teamMember.findUnique({
        where: { id: input.id },
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profissional não encontrado.",
        });
      }
      return prisma.teamMember.delete({ where: { id: input.id } });
    }),

  reorder: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      await Promise.all(
        input.ids.map((id, index) =>
          prisma.teamMember.update({ where: { id }, data: { order: index } }),
        ),
      );
      return { ok: true };
    }),
});
