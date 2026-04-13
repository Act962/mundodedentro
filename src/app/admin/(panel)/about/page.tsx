import { PageHeader } from "@/components/admin/PageHeader";
import { AboutForm } from "@/features/about/components/AboutForm";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Sobre"
        description="Texto institucional, filosofia e público-alvo."
      />
      <AboutForm />
    </div>
  );
}
