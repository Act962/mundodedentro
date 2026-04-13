import { PageHeader } from "@/components/admin/PageHeader";
import { GalleryGrid } from "@/features/gallery/components/GalleryGrid";

export default function GalleryPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Galeria"
        description="Fotos do espaço. Use as setas para reordenar."
      />
      <GalleryGrid />
    </div>
  );
}
