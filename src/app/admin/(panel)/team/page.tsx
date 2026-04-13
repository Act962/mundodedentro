import { PageHeader } from "@/components/admin/PageHeader";
import { TeamList } from "@/features/team/components/TeamList";

export default function TeamPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Equipe"
        description="Profissionais, cargos, especialidades e fotos."
      />
      <TeamList />
    </div>
  );
}
