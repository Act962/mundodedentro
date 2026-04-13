import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database with existing site content...");

  // ─── General Settings ──────────────────────────────────────────────────────
  await prisma.generalSettings.upsert({
    where: { id: "seed-general" },
    create: {
      id: "seed-general",
      siteName: "Instituto Mundo de Dentro",
      tagline: "No Mundo de Dentro, cada cérebro conta uma história",
      logo: "/assets/logo_mundo_de_dentro.svg",
      whatsapp: "5586981181575",
      email: "contato@mundodedentro.com.br",
      hours: "Segunda a Sexta: 8h às 21h",
      location: "Teresina, Piauí",
      instagramUrl: "",
      facebookUrl: "",
    },
    update: {},
  });

  // ─── Hero Content ──────────────────────────────────────────────────────────
  await prisma.heroContent.upsert({
    where: { id: "seed-hero" },
    create: {
      id: "seed-hero",
      tagline: "No Mundo de Dentro, cada cérebro conta uma história",
      description:
        "Cuidamos do mundo interno de cada pessoa com ciência, acolhimento e fé. Neuropsicologia, neurofeedback e psicologia para crianças, adolescentes, adultos e suas famílias.",
      ctaPrimary: "Agendar Consulta",
      ctaSecondary: "Conhecer Serviços",
      whatsapp: "https://wa.me/5586981181575",
      bgImage: "/assets/hero-background.jpg",
    },
    update: {},
  });

  // ─── About Content ─────────────────────────────────────────────────────────
  await prisma.aboutContent.upsert({
    where: { id: "seed-about" },
    create: {
      id: "seed-about",
      title: "Nossa História",
      historyText:
        "Com mais de 20 anos de atuação, o Instituto Mundo de Dentro nasceu do compromisso com o desenvolvimento humano integral. Reunimos especialistas em neuropsicologia avançada, neurofeedback, psicologia infantojuvenil e psicopedagogia para oferecer cuidado completo às famílias de Teresina e região.",
      philosophyTitle: "Nossa Filosofia",
      philosophyText:
        "Cada pessoa carrega um universo interno único. Nossa missão é compreender esse universo, respeitando a singularidade de cada história e oferecendo suporte científico aliado ao acolhimento humano.",
      targetAudience:
        "Atendemos de 1 a 99 anos — crianças, adolescentes, adultos e famílias",
      yearsExperience: 20,
    },
    update: {},
  });

  // ─── Contact Info ──────────────────────────────────────────────────────────
  await prisma.contactInfo.upsert({
    where: { id: "seed-contact" },
    create: {
      id: "seed-contact",
      whatsapp: "(86) 98118-1575",
      email: "contato@mundodedentro.com.br",
      hours: "Segunda a Sexta: 8h às 21h",
      location: "Teresina, Piauí",
    },
    update: {},
  });

  // ─── SEO Settings ──────────────────────────────────────────────────────────
  await prisma.seoSettings.upsert({
    where: { page: "home" },
    create: {
      page: "home",
      title:
        "Instituto Mundo de Dentro | Neuropsicologia e Psicologia Infantil em Teresina",
      description:
        "Instituto Mundo de Dentro: Avaliação neuropsicológica, neurofeedback, psicologia infantil e orientação parental em Teresina, Piauí. Cuidando do mundo interno de cada pessoa com ciência e acolhimento.",
      ogImage: "/assets/logo_mundo_de_dentro.svg",
    },
    update: {},
  });

  // ─── Services ──────────────────────────────────────────────────────────────
  const featuredServices = [
    {
      title: "Avaliação Neuropsicológica",
      description:
        "Um 'mapa do cérebro' que mostra como a criança funciona: atenção, memória, linguagem, raciocínio, organização e comportamento.",
      icon: "Brain",
      featured: true,
      order: 0,
    },
    {
      title: "Neurofeedback",
      description:
        "Treina o cérebro como uma academia mental. A criança aprende a se concentrar melhor, controlar ansiedade e reduzir impulsividade.",
      icon: "Activity",
      featured: true,
      order: 1,
    },
    {
      title: "Psicologia Infantil e Adolescente",
      description:
        "Acompanhamento emocional e comportamental focado em autorregulação, habilidades sociais, emoções, rotina e autoestima.",
      icon: "Heart",
      featured: true,
      order: 2,
    },
    {
      title: "Sala de Estudo Assistido - TDAH",
      description:
        "Ambiente estruturado para organizar tarefas, revisar conteúdos, aprender métodos de estudo e manter a rotina escolar.",
      icon: "BookOpen",
      featured: true,
      order: 3,
    },
    {
      title: "Avaliação com Realidade Virtual",
      description:
        "Ferramentas modernas para observar atenção, impulsividade e comportamento em situações próximas da vida real.",
      icon: "Sparkles",
      featured: false,
      order: 4,
    },
    {
      title: "Consultoria Escolar",
      description:
        "Acompanhamento junto à escola para adaptações, comunicação e alinhamento das necessidades da criança.",
      icon: "School",
      featured: false,
      order: 5,
    },
    {
      title: "Orientação Parental",
      description:
        "Apoio direto à família: como organizar rotina, lidar com comportamentos difíceis, telas, sono, regras e combinados.",
      icon: "Users",
      featured: false,
      order: 6,
    },
    {
      title: "Núcleo de Dislexia",
      description:
        "Avaliação e intervenção completa para dislexia e transtornos de aprendizagem com apoio escolar.",
      icon: "GraduationCap",
      featured: false,
      order: 7,
    },
    {
      title: "Escola de Princesas/Príncipes",
      description:
        "Vivências de identidade, autoestima, etiqueta, habilidades sociais e valores para crianças.",
      icon: "Crown",
      featured: false,
      order: 8,
    },
    {
      title: "Grupos Terapêuticos",
      description:
        "Espaço seguro para trabalhar convivência, expressão emocional, cooperação e resolução de conflitos.",
      icon: "MessageCircle",
      featured: false,
      order: 9,
    },
  ];

  for (const service of featuredServices) {
    await prisma.service.upsert({
      where: { id: `seed-service-${service.order}` },
      create: { id: `seed-service-${service.order}`, ...service },
      update: {},
    });
  }

  // ─── Gallery Photos ────────────────────────────────────────────────────────
  const photos = [
    { src: "/assets/espaco-28.jpg", alt: "Sala infantil com mesa e brinquedos", label: "Sala Lúdica", order: 0 },
    { src: "/assets/espaco-35.jpg", alt: "Sala de atividades em grupo com mesa laranja", label: "Sala de Grupo", order: 1 },
    { src: "/assets/espaco-45.jpg", alt: "Consultório temático com decoração náutica", label: "Consultório", order: 2 },
    { src: "/assets/espaco-58.jpg", alt: "Sala de neurofeedback com estações individuais", label: "Neurofeedback", order: 3 },
    { src: "/assets/espaco-62.jpg", alt: "Consultório com ambiente acolhedor e sofás", label: "Consultório", order: 4 },
    { src: "/assets/espaco-66.jpg", alt: "Entrada temática Mundo de Dentro", label: "Recepção", order: 5 },
  ];

  for (const photo of photos) {
    await prisma.galleryPhoto.upsert({
      where: { id: `seed-photo-${photo.order}` },
      create: { id: `seed-photo-${photo.order}`, ...photo },
      update: {},
    });
  }

  // ─── Team Members ──────────────────────────────────────────────────────────
  const teamMembers = [
    {
      name: "Dra. Kennya Martins",
      role: "Psicóloga e Neuropsicóloga",
      specialties: ["Neurofeedback", "Psicologia Infantil", "Avaliação Neuropsicológica"],
      isLeader: true,
      photo: "/team/kennya-martins.jpg",
      order: 0,
    },
    {
      name: "Talita Iglesias",
      role: "Psicóloga e Neuropsicóloga",
      specialties: ["Neuropsicologia", "Avaliação"],
      isLeader: false,
      photo: "/team/talita-iglesias.jpg",
      order: 1,
    },
    {
      name: "Cecilia Sardinha",
      role: "Psicóloga",
      specialties: ["Orientação Parental"],
      isLeader: false,
      photo: null,
      order: 2,
    },
    {
      name: "Maura Gisele",
      role: "Pedagoga e Neuropsicopedagoga",
      specialties: ["Neuropsicopedagogia"],
      isLeader: false,
      photo: "/team/maura-gisele.jpg",
      order: 3,
    },
    {
      name: "Simone Rodrigues",
      role: "Recepcionista",
      specialties: ["Recepção"],
      isLeader: false,
      photo: "/team/simone-rodrigues.jpg",
      order: 4,
    },
    {
      name: "Isadora",
      role: "Recepcionista",
      specialties: ["Recepção"],
      isLeader: false,
      photo: "/team/isadora.jpg",
      order: 5,
    },
    {
      name: "Moisés Rêgo",
      role: "Tutor",
      specialties: ["Sala de Estudo Assistido"],
      isLeader: false,
      photo: "/team/moises-rego.jpg",
      order: 6,
    },
  ];

  for (const member of teamMembers) {
    await prisma.teamMember.upsert({
      where: { id: `seed-member-${member.order}` },
      create: { id: `seed-member-${member.order}`, ...member },
      update: {},
    });
  }

  // ─── Testimonials ──────────────────────────────────────────────────────────
  const testimonials = [
    {
      text: "O atendimento foi transformador para minha filha. Ela desenvolveu muito a autoestima e hoje enfrenta os desafios da escola com mais confiança.",
      author: "Mãe da Maria, 8 anos",
      rating: 5,
      order: 0,
    },
    {
      text: "A avaliação neuropsicológica nos deu clareza sobre as dificuldades do nosso filho. A equipe foi muito acolhedora e profissional.",
      author: "Pai do João, 10 anos",
      rating: 5,
      order: 1,
    },
    {
      text: "O neurofeedback mudou a rotina de casa. Meu filho está mais focado e menos ansioso. Recomendo muito!",
      author: "Mãe do Pedro, 12 anos",
      rating: 5,
      order: 2,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: `seed-testimonial-${testimonial.order}` },
      create: { id: `seed-testimonial-${testimonial.order}`, ...testimonial },
      update: {},
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
