"use client";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PencilIcon,
  PlusIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
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
import { useCreateTestimonial } from "../hooks/useCreateTestimonial";
import { useDeleteTestimonial } from "../hooks/useDeleteTestimonial";
import { useReorderTestimonials } from "../hooks/useReorderTestimonials";
import { useTestimonials } from "../hooks/useTestimonials";
import { useUpdateTestimonial } from "../hooks/useUpdateTestimonial";
import { TestimonialForm, type TestimonialFormData } from "./TestimonialForm";

export function TestimonialsList() {
  const { data: testimonials, isLoading } = useTestimonials();
  const createItem = useCreateTestimonial();
  const updateItem = useUpdateTestimonial();
  const deleteItem = useDeleteTestimonial();
  const reorder = useReorderTestimonials();

  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<
    (TestimonialFormData & { id: string }) | null
  >(null);

  async function handleCreate(data: TestimonialFormData) {
    try {
      await createItem.mutateAsync(data);
      toast.success("Depoimento adicionado.");
      setCreateOpen(false);
    } catch {
      toast.error("Erro ao adicionar depoimento.");
    }
  }

  async function handleUpdate(data: TestimonialFormData) {
    if (!editItem) return;
    try {
      await updateItem.mutateAsync({ ...data, id: editItem.id });
      toast.success("Depoimento atualizado.");
      setEditItem(null);
    } catch {
      toast.error("Erro ao atualizar depoimento.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteItem.mutateAsync({ id });
      toast.success("Depoimento removido.");
    } catch {
      toast.error("Erro ao remover depoimento.");
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    if (!testimonials) return;
    const newOrder = [...testimonials.map((t) => t.id)];
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
              <PlusIcon /> Novo Depoimento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Depoimento</DialogTitle>
            </DialogHeader>
            <TestimonialForm
              onSubmit={handleCreate}
              isPending={createItem.isPending}
              submitLabel="Adicionar"
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      )}

      {testimonials && testimonials.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          Nenhum depoimento cadastrado ainda.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {testimonials?.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="flex items-start gap-3 rounded-lg border bg-card px-4 py-3"
          >
            <div className="flex flex-1 flex-col gap-1 min-w-0">
              <div className="flex items-center gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className="size-3 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <span className="text-xs font-medium">{testimonial.author}</span>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={index === 0}
                onClick={() => handleMove(index, "up")}
              >
                <ArrowUpIcon />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={index === (testimonials?.length ?? 0) - 1}
                onClick={() => handleMove(index, "down")}
              >
                <ArrowDownIcon />
              </Button>
              <Dialog
                open={editItem?.id === testimonial.id}
                onOpenChange={(open) => !open && setEditItem(null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      setEditItem({
                        id: testimonial.id,
                        text: testimonial.text,
                        author: testimonial.author,
                        rating: testimonial.rating,
                        photo: testimonial.photo ?? "",
                        order: testimonial.order,
                      })
                    }
                  >
                    <PencilIcon />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Depoimento</DialogTitle>
                  </DialogHeader>
                  {editItem && (
                    <TestimonialForm
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
                  <Button variant="ghost" size="icon-sm">
                    <Trash2Icon className="text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover depoimento?</AlertDialogTitle>
                    <AlertDialogDescription>
                      O depoimento de &quot;{testimonial.author}&quot; será
                      removido permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(testimonial.id)}
                      className="bg-destructive text-white hover:bg-destructive/90"
                    >
                      Remover
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
