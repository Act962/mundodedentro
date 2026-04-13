import { TRPCError, initTRPC } from "@trpc/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const cookieHeader = opts.headers.get("cookie") ?? "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").flatMap((part) => {
      const eq = part.indexOf("=");
      if (eq === -1) return [];
      const key = part.slice(0, eq).trim();
      const value = part.slice(eq + 1).trim();
      return [[key, value]];
    }),
  );

  const token = cookies[COOKIE_NAME];
  const admin = token ? await verifySessionToken(token) : null;
  return { isAdmin: !!admin };
};

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.isAdmin) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx });
});
