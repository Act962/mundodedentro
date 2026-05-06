import {
  Activity,
  AlertCircle,
  BookOpen,
  Brain,
  GraduationCap,
  Heart,
  Lightbulb,
  MessageCircle,
  School,
  Sparkles,
  Users,
} from "lucide-react";

type ParentApproach = {
  icon: string;
  title: string;
  description: string;
};

type ParentsSectionProps = {
  badge?: string;
  title?: string;
  description?: string;
  approaches?: ParentApproach[];
  warningTitle?: string;
  warningDescription?: string;
  warningSignals?: string[];
  warningFooter?: string;
};

const iconMap = {
  Activity,
  BookOpen,
  Brain,
  GraduationCap,
  Heart,
  Lightbulb,
  MessageCircle,
  School,
  Sparkles,
  Users,
};

const defaultApproaches = [
  {
    icon: "Heart",
    title: "Psicologia Infantil",
    description:
      "Ajuda a crianca a entender emocoes, melhorar comportamentos e desenvolver habilidades sociais por meio de brincadeiras e atividades ludicas.",
  },
  {
    icon: "Brain",
    title: "Neuropsicologia",
    description:
      "Mostra como a crianca funciona por dentro: atencao, memoria, linguagem, raciocinio, organizacao, comportamento e aprendizagem.",
  },
  {
    icon: "Lightbulb",
    title: "Neurofeedback",
    description:
      "Treina o cerebro, como uma academia mental. A crianca aprende a se concentrar melhor, controlar ansiedade e reduzir impulsividade.",
  },
  {
    icon: "BookOpen",
    title: "Sala de Estudo",
    description:
      "Ajuda a crianca com TDAH ou dificuldades escolares a organizar cadernos, realizar tarefas, se concentrar e criar rotina.",
  },
  {
    icon: "Users",
    title: "Orientacao Parental",
    description:
      "Apoio direto a familia: como organizar rotina, lidar com comportamentos dificeis, telas, sono, regras e combinados.",
  },
];

const defaultWarningSignals = [
  "Dificuldade de concentracao e atencao nas atividades",
  "Problemas de comportamento em casa ou na escola",
  "Dificuldades na leitura, escrita ou matematica",
  "Ansiedade, medos ou mudancas de humor frequentes",
  "Dificuldade em fazer amigos ou manter relacionamentos",
  "Agitacao excessiva ou dificuldade em ficar parado",
  "Resistencia para ir a escola ou fazer tarefas",
  "Baixa autoestima ou falta de motivacao",
];

const ParentsSection = ({
  badge = "Para Pais e Responsaveis",
  title = "Entendendo Cada Abordagem",
  description = "Sabemos que pode ser dificil entender as diferentes abordagens. Preparamos explicacoes simples para ajudar voce.",
  approaches = defaultApproaches,
  warningTitle = "Sinais de Alerta",
  warningDescription = "Alguns sinais podem indicar que seu filho(a) pode se beneficiar de uma avaliacao:",
  warningSignals = defaultWarningSignals,
  warningFooter = "Se voce identificou algum desses sinais, estamos aqui para ajudar. Entre em contato para uma conversa inicial sem compromisso.",
}: ParentsSectionProps) => {
  return (
    <section id="parents" className="py-20 bg-card relative overflow-hidden">
      <div className="absolute top-20 left-5 w-20 h-20 bg-brand-orange-light blob animate-float pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-28 h-28 bg-brand-red-light blob-2 animate-float-delayed pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-accent rounded-full text-accent-foreground text-sm font-body mb-4">
            {badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {approaches.map((approach) => {
            const Icon =
              iconMap[approach.icon as keyof typeof iconMap] ?? Heart;
            return (
              <div
                key={approach.title}
                className="bg-background rounded-2xl p-6 shadow-card hover:shadow-soft transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                  {approach.title}
                </h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  {approach.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-hero-gradient rounded-3xl p-8 md:p-12 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground">
              {warningTitle}
            </h3>
          </div>

          <p className="text-muted-foreground font-body mb-6">
            {warningDescription}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warningSignals.map((signal) => (
              <div
                key={signal}
                className="flex items-start gap-3 bg-card/80 rounded-xl p-4"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-foreground font-body">{signal}</span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-muted-foreground font-body">
            {warningFooter}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ParentsSection;
