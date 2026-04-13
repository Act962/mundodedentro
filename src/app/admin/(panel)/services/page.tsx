import { PageHeader } from "@/components/admin/PageHeader";
import { ServicesList } from "@/features/services/components/ServicesList";

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Serviços"
        description="Gerencie os serviços exibidos no site. Marque como destaque para aparecer em primeiro."
      />
      <ServicesList />
    </div>
  );
}
