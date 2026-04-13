"use client";

import {
  Activity,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronUp,
  Crown,
  GraduationCap,
  Heart,
  MessageCircle,
  School,
  Sparkles,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const ICON_MAP: Record<string, LucideIcon> = {
  Brain,
  Activity,
  Heart,
  BookOpen,
  Sparkles,
  School,
  Users,
  GraduationCap,
  Crown,
  MessageCircle,
  Star,
};

function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Star;
}

const FEATURED_COLORS = [
  { bg: "bg-brand-blue-light", icon: "text-primary" },
  { bg: "bg-brand-red-light", icon: "text-secondary" },
  { bg: "bg-brand-orange-light", icon: "text-accent" },
  { bg: "bg-brand-blue-light", icon: "text-primary" },
];

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  featured: boolean;
  order: number;
}

const DEFAULT_FEATURED: ServiceItem[] = [
  { id: "1", title: "Avaliação Neuropsicológica", description: "Um 'mapa do cérebro' que mostra como a criança funciona: atenção, memória, linguagem, raciocínio, organização e comportamento.", icon: "Brain", featured: true, order: 0 },
  { id: "2", title: "Neurofeedback", description: "Treina o cérebro como uma academia mental. A criança aprende a se concentrar melhor, controlar ansiedade e reduzir impulsividade.", icon: "Activity", featured: true, order: 1 },
  { id: "3", title: "Psicologia Infantil e Adolescente", description: "Acompanhamento emocional e comportamental focado em autorregulação, habilidades sociais, emoções, rotina e autoestima.", icon: "Heart", featured: true, order: 2 },
  { id: "4", title: "Sala de Estudo Assistido - TDAH", description: "Ambiente estruturado para organizar tarefas, revisar conteúdos, aprender métodos de estudo e manter a rotina escolar.", icon: "BookOpen", featured: true, order: 3 },
];

const DEFAULT_OTHER: ServiceItem[] = [
  { id: "5", title: "Avaliação com Realidade Virtual", description: "Ferramentas modernas para observar atenção, impulsividade e comportamento em situações próximas da vida real.", icon: "Sparkles", featured: false, order: 4 },
  { id: "6", title: "Consultoria Escolar", description: "Acompanhamento junto à escola para adaptações, comunicação e alinhamento das necessidades da criança.", icon: "School", featured: false, order: 5 },
  { id: "7", title: "Orientação Parental", description: "Apoio direto à família: como organizar rotina, lidar com comportamentos difíceis, telas, sono, regras e combinados.", icon: "Users", featured: false, order: 6 },
  { id: "8", title: "Núcleo de Dislexia", description: "Avaliação e intervenção completa para dislexia e transtornos de aprendizagem com apoio escolar.", icon: "GraduationCap", featured: false, order: 7 },
  { id: "9", title: "Escola de Princesas/Príncipes", description: "Vivências de identidade, autoestima, etiqueta, habilidades sociais e valores para crianças.", icon: "Crown", featured: false, order: 8 },
  { id: "10", title: "Grupos Terapêuticos", description: "Espaço seguro para trabalhar convivência, expressão emocional, cooperação e resolução de conflitos.", icon: "MessageCircle", featured: false, order: 9 },
];

interface ServicesProps {
  services?: ServiceItem[];
}

const Services = ({ services }: ServicesProps) => {
  const [showAll, setShowAll] = useState(false);

  const allServices = services && services.length > 0 ? services : [...DEFAULT_FEATURED, ...DEFAULT_OTHER];
  const featuredServices = allServices.filter((s) => s.featured);
  const otherServices = allServices.filter((s) => !s.featured);

  return (
    <section
      id="services"
      className="py-20 bg-background relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-brand-orange-light blob animate-float pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-brand-blue-light blob-2 animate-float-delayed pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-body mb-4">
            Nossos Serviços
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Como Podemos Ajudar
          </h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Oferecemos atendimentos presenciais e online, combinando ciência e
            acolhimento para cuidar do que realmente importa.
          </p>
        </div>

        {/* Featured Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {featuredServices.map((service, index) => {
            const Icon = getIcon(service.icon);
            const color = FEATURED_COLORS[index % FEATURED_COLORS.length];
            return (
              <div
                key={service.id}
                className="group relative bg-card rounded-3xl p-8 shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div
                  className={`absolute -right-8 -top-8 w-32 h-32 ${color.bg} blob opacity-50 group-hover:scale-125 transition-transform duration-500`}
                />
                <div className="relative z-10">
                  <div
                    className={`w-16 h-16 rounded-2xl ${color.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-8 h-8 ${color.icon}`} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground font-body leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Toggle more services */}
        {otherServices.length > 0 && (
          <>
            <div className="text-center mb-8">
              <Button
                variant="ghost"
                onClick={() => setShowAll(!showAll)}
                className="gap-2 text-primary hover:text-primary/80 hover:bg-primary/5"
              >
                {showAll ? (
                  <>
                    Ver menos serviços <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Ver todos os serviços <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Other Services */}
            {showAll && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {otherServices.map((service) => {
                  const Icon = getIcon(service.icon);
                  return (
                    <div
                      key={service.id}
                      className="bg-card rounded-2xl p-6 shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <h4 className="text-lg font-display font-semibold text-foreground mb-2">
                        {service.title}
                      </h4>
                      <p className="text-sm text-muted-foreground font-body">
                        {service.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Services;
