import { PageHeader } from "@/components/admin/PageHeader";
import { ParentsForm } from "@/features/parents/components/ParentsForm";

export default function ParentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pais e Responsaveis"
        description="Abordagens explicadas e sinais de alerta exibidos na landing page."
      />
      <ParentsForm />
    </div>
  );
}
