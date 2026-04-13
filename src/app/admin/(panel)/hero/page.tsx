import { PageHeader } from "@/components/admin/PageHeader";
import { HeroForm } from "@/features/hero/components/HeroForm";

export default function HeroPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Hero"
        description="Título, subtítulo, botões de ação e imagem de fundo."
      />
      <HeroForm />
    </div>
  );
}
