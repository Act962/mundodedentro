"use client";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateGalleryItem } from "../hooks/useCreateGalleryItem";
import { useDeleteGalleryItem } from "../hooks/useDeleteGalleryItem";
import { useGallery } from "../hooks/useGallery";
import { useReorderGallery } from "../hooks/useReorderGallery";
import { useUpdateGalleryItem } from "../hooks/useUpdateGalleryItem";
import { GalleryItemForm, type GalleryItemFormData } from "./GalleryItemForm";

export function GalleryGrid() {
  const { data: photos, isLoading } = useGallery();
  const createItem = useCreateGalleryItem();
  const updateItem = useUpdateGalleryItem();
  const deleteItem = useDeleteGalleryItem();
  const reorder = useReorderGallery();

  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<
    (GalleryItemFormData & { id: string }) | null
  >(null);

  async function handleCreate(data: GalleryItemFormData) {
    try {
      await createItem.mutateAsync(data);
      toast.success("Foto adicionada.");
      setCreateOpen(false);
    } catch {
      toast.error("Erro ao adicionar foto.");
    }
  }

  async function handleUpdate(data: GalleryItemFormData) {
    if (!editItem) return;
    try {
      await updateItem.mutateAsync({ ...data, id: editItem.id });
      toast.success("Foto atualizada.");
      setEditItem(null);
    } catch {
      toast.error("Erro ao atualizar foto.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteItem.mutateAsync({ id });
      toast.success("Foto removida.");
    } catch {
      toast.error("Erro ao remover foto.");
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    if (!photos) return;
    const newOrder = [...photos.map((p) => p.id)];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
    try {
      await reorder.mutateAsync({ ids: newOrder });
    } catch {
      toast.error("Erro ao reordenar.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon /> Adicionar Foto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Foto</DialogTitle>
            </DialogHeader>
            <GalleryItemForm
              onSubmit={handleCreate}
              isPending={createItem.isPending}
              submitLabel="Adicionar"
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-lg" />
          ))}
        </div>
      )}

      {photos && photos.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          Nenhuma foto na galeria ainda.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {photos?.map((photo, index) => (
          <div
            key={photo.id}
            className="group relative overflow-hidden rounded-lg border bg-muted"
          >
            <div className="relative aspect-square">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex items-center justify-between border-t bg-card px-2 py-1.5">
              <span className="truncate text-xs text-muted-foreground">
                {photo.label}
              </span>
              <div className="flex shrink-0 items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  disabled={index === 0}
                  onClick={() => handleMove(index, "up")}
                >
                  <ArrowUpIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  disabled={index === (photos?.length ?? 0) - 1}
                  onClick={() => handleMove(index, "down")}
                >
                  <ArrowDownIcon />
                </Button>
                <Dialog
                  open={editItem?.id === photo.id}
                  onOpenChange={(open) => !open && setEditItem(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() =>
                        setEditItem({
                          id: photo.id,
                          src: photo.src,
                          alt: photo.alt,
                          label: photo.label,
                          order: photo.order,
                        })
                      }
                    >
                      <PencilIcon />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Foto</DialogTitle>
                    </DialogHeader>
                    {editItem && (
                      <GalleryItemForm
                        defaultValues={editItem}
                        onSubmit={handleUpdate}
                        isPending={updateItem.isPending}
                        submitLabel="Atualizar"
                      />
                    )}
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon-xs">
                      <Trash2Icon className="text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover foto?</AlertDialogTitle>
                      <AlertDialogDescription>
                        A foto &quot;{photo.label}&quot; será removida
                        permanentemente da galeria.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(photo.id)}
                        className="bg-destructive text-white hover:bg-destructive/90"
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
