import { PageHeader } from "@/components/admin/PageHeader";
import { SeoForm } from "@/features/seo/components/SeoForm";

export default function SeoPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="SEO"
        description="Título, descrição e imagem Open Graph por página."
      />
      <SeoForm />
    </div>
  );
}
