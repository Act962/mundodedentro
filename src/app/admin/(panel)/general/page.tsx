import { PageHeader } from "@/components/admin/PageHeader";
import { GeneralForm } from "@/features/general/components/GeneralForm";

export default function GeneralPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Configurações Gerais"
        description="Nome do instituto, logo, contato e redes sociais."
      />
      <GeneralForm />
    </div>
  );
}
