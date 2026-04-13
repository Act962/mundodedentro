"use client";
import { PencilIcon, PlusIcon, StarIcon, Trash2Icon } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateService } from "../hooks/useCreateService";
import { useDeleteService } from "../hooks/useDeleteService";
import { useServices } from "../hooks/useServices";
import { useUpdateService } from "../hooks/useUpdateService";
import { ServiceForm, type ServiceFormData } from "./ServiceForm";

export function ServicesList() {
  const { data: services, isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<
    (ServiceFormData & { id: string }) | null
  >(null);

  async function handleCreate(data: ServiceFormData) {
    try {
      await createService.mutateAsync(data);
      toast.success("Serviço criado.");
      setCreateOpen(false);
    } catch {
      toast.error("Erro ao criar serviço.");
    }
  }

  async function handleUpdate(data: ServiceFormData) {
    if (!editItem) return;
    try {
      await updateService.mutateAsync({ ...data, id: editItem.id });
      toast.success("Serviço atualizado.");
      setEditItem(null);
    } catch {
      toast.error("Erro ao atualizar serviço.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteService.mutateAsync({ id });
      toast.success("Serviço removido.");
    } catch {
      toast.error("Erro ao remover serviço.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon /> Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Serviço</DialogTitle>
            </DialogHeader>
            <ServiceForm
              onSubmit={handleCreate}
              isPending={createService.isPending}
              submitLabel="Criar"
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )}

      {services && services.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          Nenhum serviço cadastrado ainda.
        </p>
      )}

      {services?.map((service) => (
        <div
          key={service.id}
          className="flex items-start justify-between gap-4 rounded-lg border bg-card px-4 py-3"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{service.title}</span>
              {service.featured && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <StarIcon className="size-3" />
                  Destaque
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {service.description}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Dialog
              open={editItem?.id === service.id}
              onOpenChange={(open) => !open && setEditItem(null)}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    setEditItem({
                      id: service.id,
                      title: service.title,
                      description: service.description,
                      icon: service.icon,
                      featured: service.featured,
                      order: service.order,
                    })
                  }
                >
                  <PencilIcon />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Serviço</DialogTitle>
                </DialogHeader>
                {editItem && (
                  <ServiceForm
                    defaultValues={editItem}
                    onSubmit={handleUpdate}
                    isPending={updateService.isPending}
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
                  <AlertDialogTitle>Remover serviço?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. O serviço &quot;
                    {service.title}&quot; será removido permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(service.id)}
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
  );
}
