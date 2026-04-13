import {
  BookOpen,
  Image,
  Info,
  Phone,
  Search,
  Settings,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  {
    label: "Configurações Gerais",
    href: "/admin/general",
    icon: Settings,
    description: "Nome, logo, WhatsApp, redes sociais",
  },
  {
    label: "Hero",
    href: "/admin/hero",
    icon: Sparkles,
    description: "Título, subtítulo, botões de ação",
  },
  {
    label: "Sobre",
    href: "/admin/about",
    icon: Info,
    description: "Texto institucional, missão e filosofia",
  },
  {
    label: "Serviços",
    href: "/admin/services",
    icon: BookOpen,
    description: "Adicionar, editar e remover serviços",
  },
  {
    label: "Galeria",
    href: "/admin/gallery",
    icon: Image,
    description: "Fotos do espaço com legenda e ordem",
  },
  {
    label: "Equipe",
    href: "/admin/team",
    icon: Users,
    description: "Profissionais, especialidades e fotos",
  },
  {
    label: "Depoimentos",
    href: "/admin/testimonials",
    icon: Star,
    description: "Avaliações de famílias atendidas",
  },
  {
    label: "Contato",
    href: "/admin/contact",
    icon: Phone,
    description: "Telefone, e-mail, endereço e mapa",
  },
  {
    label: "SEO",
    href: "/admin/seo",
    icon: Search,
    description: "Títulos, descrições e imagens Open Graph",
  },
];

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Painel Administrativo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie todo o conteúdo do site do Instituto Mundo de Dentro.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <section.icon className="size-4 text-primary" />
                  {section.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
