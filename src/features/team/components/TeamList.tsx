"use client";
import { PencilIcon, PlusIcon, ShieldIcon, Trash2Icon } from "lucide-react";
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
import { useCreateTeamMember } from "../hooks/useCreateTeamMember";
import { useDeleteTeamMember } from "../hooks/useDeleteTeamMember";
import { useTeam } from "../hooks/useTeam";
import { useUpdateTeamMember } from "../hooks/useUpdateTeamMember";
import { TeamMemberForm, type TeamMemberFormData } from "./TeamMemberForm";

export function TeamList() {
  const { data: members, isLoading } = useTeam();
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const deleteMember = useDeleteTeamMember();

  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<
    (TeamMemberFormData & { id: string }) | null
  >(null);

  async function handleCreate(data: TeamMemberFormData) {
    try {
      await createMember.mutateAsync(data);
      toast.success("Profissional adicionado.");
      setCreateOpen(false);
    } catch {
      toast.error("Erro ao adicionar profissional.");
    }
  }

  async function handleUpdate(data: TeamMemberFormData) {
    if (!editItem) return;
    try {
      await updateMember.mutateAsync({ ...data, id: editItem.id });
      toast.success("Profissional atualizado.");
      setEditItem(null);
    } catch {
      toast.error("Erro ao atualizar profissional.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteMember.mutateAsync({ id });
      toast.success("Profissional removido.");
    } catch {
      toast.error("Erro ao remover profissional.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon /> Novo Profissional
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Profissional</DialogTitle>
            </DialogHeader>
            <TeamMemberForm
              onSubmit={handleCreate}
              isPending={createMember.isPending}
              submitLabel="Adicionar"
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      )}

      {members && members.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          Nenhum profissional cadastrado ainda.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {members?.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-4 rounded-lg border bg-card px-4 py-3"
          >
            <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted">
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex size-full items-center justify-center text-lg font-medium text-muted-foreground">
                  {member.name[0]}
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">
                  {member.name}
                </span>
                {member.isLeader && (
                  <Badge variant="secondary" className="gap-1 shrink-0 text-xs">
                    <ShieldIcon className="size-3" />
                    Líder
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {member.role}
              </span>
              <div className="flex flex-wrap gap-1">
                {member.specialties.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Dialog
                open={editItem?.id === member.id}
                onOpenChange={(open) => !open && setEditItem(null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      setEditItem({
                        id: member.id,
                        name: member.name,
                        role: member.role,
                        specialties: member.specialties,
                        photo: member.photo ?? "",
                        isLeader: member.isLeader,
                        bio: member.bio ?? "",
                        order: member.order,
                      })
                    }
                  >
                    <PencilIcon />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Editar Profissional</DialogTitle>
                  </DialogHeader>
                  {editItem && (
                    <TeamMemberForm
                      defaultValues={editItem}
                      onSubmit={handleUpdate}
                      isPending={updateMember.isPending}
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
                    <AlertDialogTitle>Remover profissional?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {member.name} será removido(a) permanentemente da equipe.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(member.id)}
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
