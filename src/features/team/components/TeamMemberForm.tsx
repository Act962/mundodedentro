"use client";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@/lib/zodResolver";

const schema = z.object({
  name: z.string().min(1, "Obrigatório"),
  role: z.string().min(1, "Obrigatório"),
  specialties: z
    .array(z.string().min(1))
    .min(1, "Adicione ao menos uma especialidade"),
  photo: z.string().optional(),
  isLeader: z.boolean().default(false),
  bio: z.string().optional(),
  order: z.coerce.number().int().min(0).default(0),
});
export type TeamMemberFormData = z.infer<typeof schema>;

interface TeamMemberFormProps {
  defaultValues?: Partial<TeamMemberFormData>;
  onSubmit: (data: TeamMemberFormData) => Promise<void>;
  isPending: boolean;
  submitLabel?: string;
}

export function TeamMemberForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = "Salvar",
}: TeamMemberFormProps) {
  const [specialtyInput, setSpecialtyInput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isLeader: false,
      order: 0,
      specialties: [],
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues)
      reset({ isLeader: false, order: 0, specialties: [], ...defaultValues });
  }, [defaultValues, reset]);

  const specialties = watch("specialties") ?? [];
  const isLeader = watch("isLeader");

  function addSpecialty() {
    const val = specialtyInput.trim();
    if (!val) return;
    setValue("specialties", [...specialties, val], { shouldValidate: true });
    setSpecialtyInput("");
  }

  function removeSpecialty(index: number) {
    setValue(
      "specialties",
      specialties.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField label="Nome completo" required error={errors.name?.message}>
        <Input {...register("name")} aria-invalid={!!errors.name} />
      </FormField>
      <FormField label="Cargo / Função" required error={errors.role?.message}>
        <Input
          {...register("role")}
          placeholder="Psicóloga e Neuropsicóloga"
          aria-invalid={!!errors.role}
        />
      </FormField>
      <FormField
        label="Especialidades"
        required
        error={errors.specialties?.message}
      >
        <div className="flex gap-2">
          <Input
            value={specialtyInput}
            onChange={(e) => setSpecialtyInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSpecialty();
              }
            }}
            placeholder="Digite e pressione Enter"
          />
          <Button type="button" variant="outline" onClick={addSpecialty}>
            Adicionar
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {specialties.map((s, i) => (
            <Badge key={i} variant="secondary" className="gap-1">
              {s}
              <button
                type="button"
                onClick={() => removeSpecialty(i)}
                className="ml-0.5 rounded-full hover:text-destructive"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      </FormField>
      <FormField label="Biografia (opcional)" error={errors.bio?.message}>
        <Textarea rows={3} {...register("bio")} />
      </FormField>
      <ImageUpload
        label="Foto"
        value={watch("photo") ?? ""}
        onChange={(v) => setValue("photo", v, { shouldDirty: true })}
      />
      <FormField label="Ordem" error={errors.order?.message}>
        <Input type="number" {...register("order")} className="w-24" />
      </FormField>
      <div className="flex items-center gap-2">
        <Switch
          id="isLeader"
          checked={isLeader}
          onCheckedChange={(v) => setValue("isLeader", v)}
        />
        <Label htmlFor="isLeader">Líder da equipe</Label>
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
