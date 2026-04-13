import type { Metadata } from "next";
import About from "@/components/landing/About";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";
import Gallery from "@/components/landing/Gallery";
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import ParentsSection from "@/components/landing/ParentsSection";
import Services from "@/components/landing/Services";
import Team from "@/components/landing/Team";
import Testimonials from "@/components/landing/Testimonials";
import WhatsAppButton from "@/components/landing/WhatsAppButton";
import prisma from "@/lib/prisma";

async function getPageData() {
  const [
    heroResult,
    generalResult,
    aboutResult,
    contactResult,
    teamResult,
    testimonialsResult,
    servicesResult,
    photosResult,
  ] = await Promise.allSettled([
    prisma.heroContent.findFirst(),
    prisma.generalSettings.findFirst(),
    prisma.aboutContent.findFirst(),
    prisma.contactInfo.findFirst(),
    prisma.teamMember.findMany({
      orderBy: [{ isLeader: "desc" }, { order: "asc" }],
    }),
    prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
    prisma.service.findMany({ orderBy: { order: "asc" } }),
    prisma.galleryPhoto.findMany({ orderBy: { order: "asc" } }),
  ]);

  return {
    hero: heroResult.status === "fulfilled" ? heroResult.value : null,
    general: generalResult.status === "fulfilled" ? generalResult.value : null,
    about: aboutResult.status === "fulfilled" ? aboutResult.value : null,
    contact: contactResult.status === "fulfilled" ? contactResult.value : null,
    team: teamResult.status === "fulfilled" ? teamResult.value : [],
    testimonials:
      testimonialsResult.status === "fulfilled" ? testimonialsResult.value : [],
    services: servicesResult.status === "fulfilled" ? servicesResult.value : [],
    photos: photosResult.status === "fulfilled" ? photosResult.value : [],
  };
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await prisma.seoSettings.findFirst({ where: { page: "home" } });
    if (seo) {
      return {
        title: seo.title,
        description: seo.description,
        openGraph: seo.ogImage
          ? { title: seo.title, description: seo.description, images: [seo.ogImage] }
          : undefined,
      };
    }
  } catch {
    // fall through to defaults
  }
  return {
    title:
      "Instituto Mundo de Dentro | Neuropsicologia e Psicologia Infantil em Teresina",
    description:
      "Instituto Mundo de Dentro: Avaliação neuropsicológica, neurofeedback, psicologia infantil e orientação parental em Teresina, Piauí.",
  };
}

export default async function Home() {
  const { hero, general, about, contact, team, testimonials, services, photos } =
    await getPageData();

  const whatsappUrl = general?.whatsapp
    ? `https://wa.me/${general.whatsapp}`
    : "https://wa.me/5586981181575";

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar whatsapp={whatsappUrl} />
      <main>
        <div id="hero">
          <Hero
            tagline={hero?.tagline}
            description={hero?.description}
            ctaPrimary={hero?.ctaPrimary}
            ctaSecondary={hero?.ctaSecondary}
            whatsappUrl={hero?.whatsapp ?? whatsappUrl}
            bgImage={hero?.bgImage}
          />
        </div>
        <About
          historyText={about?.historyText}
          philosophyTitle={about?.philosophyTitle}
          philosophyText={about?.philosophyText}
          targetAudience={about?.targetAudience}
        />
        <Services services={services} />
        <ParentsSection />
        <Gallery photos={photos} />
        <Team members={team} />
        <Testimonials testimonials={testimonials} />
        <Contact
          whatsapp={contact?.whatsapp}
          whatsappUrl={whatsappUrl}
          email={contact?.email}
          hours={contact?.hours}
          location={contact?.location}
          mapEmbed={contact?.mapEmbed}
        />
      </main>
      <Footer
        siteName={general?.siteName}
        email={general?.email}
        hours={general?.hours}
        location={general?.location}
        instagramUrl={general?.instagramUrl ?? undefined}
        facebookUrl={general?.facebookUrl ?? undefined}
      />
      <WhatsAppButton whatsapp={whatsappUrl} />
    </div>
  );
}
