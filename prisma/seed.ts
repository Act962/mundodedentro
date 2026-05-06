import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import { PrismaClient } from "../src/generated/prisma/client";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Parents section only...");

  await prisma.parentsContent.upsert({
    where: { id: "seed-parents" },
    create: {
      id: "seed-parents",
      badge: "Para Pais e Responsaveis",
      title: "Entendendo Cada Abordagem",
      description:
        "Sabemos que pode ser dificil entender as diferentes abordagens. Preparamos explicacoes simples para ajudar voce.",
      approaches: [
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
      ],
      warningTitle: "Sinais de Alerta",
      warningDescription:
        "Alguns sinais podem indicar que seu filho(a) pode se beneficiar de uma avaliacao:",
      warningSignals: [
        "Dificuldade de concentracao e atencao nas atividades",
        "Problemas de comportamento em casa ou na escola",
        "Dificuldades na leitura, escrita ou matematica",
        "Ansiedade, medos ou mudancas de humor frequentes",
        "Dificuldade em fazer amigos ou manter relacionamentos",
        "Agitacao excessiva ou dificuldade em ficar parado",
        "Resistencia para ir a escola ou fazer tarefas",
        "Baixa autoestima ou falta de motivacao",
      ],
      warningFooter:
        "Se voce identificou algum desses sinais, estamos aqui para ajudar. Entre em contato para uma conversa inicial sem compromisso.",
    },
    update: {},
  });

  console.log("Parents seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
