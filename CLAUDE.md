# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run Biome linter
pnpm format       # Format code with Biome
```

Database:
```bash
pnpm prisma migrate dev   # Run migrations
pnpm prisma generate      # Regenerate Prisma client after schema changes
pnpm prisma studio        # Open Prisma Studio GUI
```

Docker (local Postgres):
```bash
docker compose up -d      # Start local Postgres container
```

## Architecture

**Instituto Mundo de Dentro** — a psychology institute website with full-stack capabilities.

### Stack
- **Next.js 16** (App Router) with **React 19** and the React Compiler enabled (automatic memoization — do not add `useMemo`/`useCallback` manually)
- **tRPC 11** + **TanStack Query** for type-safe client↔server communication
- **Prisma 7** with the PG adapter against **PostgreSQL**
- **Tailwind CSS 4** + **shadcn/ui** component library (components in `src/components/ui/`)
- **Biome** for linting and formatting (not ESLint/Prettier)

### Key conventions

**tRPC**: All API logic lives in routers under `src/trpc/routers/`. The root router is `src/trpc/routers/_app.ts`. The single HTTP endpoint is `/api/trpc` (`src/app/api/trpc/[trpc]/route.ts`). Use `src/trpc/client.tsx` for client-side queries.

**Prisma client**: Import the singleton from `src/lib/prisma.ts`. Generated types are output to `src/generated/prisma/` — never edit that directory.

**Path alias**: `@/*` maps to `src/*`.

**Environment**: `.env` uses a managed Prisma Postgres URL (`prisma+postgres://`). The `docker-compose.yml` provides a local fallback on port 5432 (user/pass: `docker`, db: `mundodedentro_db`).

**Auth**: Cookie-based JWT admin auth via `jose`. `src/lib/auth.ts` is the signing/verification helper. Credentials come from env vars `ADMIN_EMAIL` + `ADMIN_PASSWORD`; `AUTH_SECRET` must be set for JWT signing. The middleware at `src/middleware.ts` guards all `/admin/*` routes except `/admin/login`.

**Admin panel**: Lives at `/admin`. Feature modules follow `src/features/[domain]/{server/routes.ts, hooks/, components/}`. All tRPC procedures in these routers use `protectedProcedure` (requires valid admin session). Domain routers are registered in `src/trpc/routers/_app.ts`.

**Forms**: `react-hook-form` + Zod validation. Use `zodResolver` from `src/lib/zodResolver.ts` (not `@hookform/resolvers/zod` directly — version-bridge wrapper for Zod v4.3+).

**Seeding**: `pnpm db:seed` runs `prisma/seed.ts` and populates the DB with the hardcoded landing page content.

**Prisma models**: `GeneralSettings`, `HeroContent`, `AboutContent`, `ContactInfo`, `SeoSettings` (singletons), `Service`, `GalleryPhoto`, `TeamMember`, `Testimonial` (CRUD lists). After schema changes: `pnpm db:migrate` then `pnpm prisma generate`.
