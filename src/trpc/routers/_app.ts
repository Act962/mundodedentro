import { createTRPCRouter } from "../init";
import { generalRouter } from "@/features/general/server/routes";
import { heroRouter } from "@/features/hero/server/routes";
import { aboutRouter } from "@/features/about/server/routes";
import { servicesRouter } from "@/features/services/server/routes";
import { galleryRouter } from "@/features/gallery/server/routes";
import { teamRouter } from "@/features/team/server/routes";
import { testimonialsRouter } from "@/features/testimonials/server/routes";
import { contactRouter } from "@/features/contact/server/routes";
import { seoRouter } from "@/features/seo/server/routes";

export const appRouter = createTRPCRouter({
  general: generalRouter,
  hero: heroRouter,
  about: aboutRouter,
  services: servicesRouter,
  gallery: galleryRouter,
  team: teamRouter,
  testimonials: testimonialsRouter,
  contact: contactRouter,
  seo: seoRouter,
});

export type AppRouter = typeof appRouter;
