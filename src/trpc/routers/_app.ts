import { aboutRouter } from "@/features/about/server/routes";
import { contactRouter } from "@/features/contact/server/routes";
import { galleryRouter } from "@/features/gallery/server/routes";
import { generalRouter } from "@/features/general/server/routes";
import { heroRouter } from "@/features/hero/server/routes";
import { parentsRouter } from "@/features/parents/server/routes";
import { seoRouter } from "@/features/seo/server/routes";
import { servicesRouter } from "@/features/services/server/routes";
import { teamRouter } from "@/features/team/server/routes";
import { testimonialsRouter } from "@/features/testimonials/server/routes";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  general: generalRouter,
  hero: heroRouter,
  about: aboutRouter,
  services: servicesRouter,
  gallery: galleryRouter,
  team: teamRouter,
  testimonials: testimonialsRouter,
  contact: contactRouter,
  parents: parentsRouter,
  seo: seoRouter,
});

export type AppRouter = typeof appRouter;
