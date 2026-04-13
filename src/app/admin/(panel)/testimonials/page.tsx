import { PageHeader } from "@/components/admin/PageHeader";
import { TestimonialsList } from "@/features/testimonials/components/TestimonialsList";

export default function TestimonialsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Depoimentos"
        description="Avaliações de famílias. Use as setas para reordenar."
      />
      <TestimonialsList />
    </div>
  );
}
