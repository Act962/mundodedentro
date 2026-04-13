"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "@/components/admin/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@/lib/zodResolver";

const schema = z.object({
  title: z.string().min(1, "Obrigatório"),
  description: z.string().min(1, "Obrigatório"),
  icon: z.string().min(1, "Obrigatório"),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
});
export type ServiceFormData = z.infer<typeof schema>;

interface ServiceFormProps {
  defaultValues?: Partial<ServiceFormData>;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  isPending: boolean;
  submitLabel?: string;
}

export function ServiceForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = "Salvar",
}: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(schema),
    defaultValues: { featured: false, order: 0, ...defaultValues },
  });

  useEffect(() => {
    if (defaultValues) reset({ featured: false, order: 0, ...defaultValues });
  }, [defaultValues, reset]);

  const featured = watch("featured");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField label="Título" required error={errors.title?.message}>
        <Input {...register("title")} aria-invalid={!!errors.title} />
      </FormField>
      <FormField label="Descrição" required error={errors.description?.message}>
        <Textarea
          rows={3}
          {...register("description")}
          aria-invalid={!!errors.description}
        />
      </FormField>
      <FormField
        label="Ícone (nome do lucide-react)"
        required
        error={errors.icon?.message}
      >
        <Input
          {...register("icon")}
          placeholder="Brain"
          aria-invalid={!!errors.icon}
        />
      </FormField>
      <FormField label="Ordem" error={errors.order?.message}>
        <Input type="number" {...register("order")} className="w-24" />
      </FormField>
      <div className="flex items-center gap-2">
        <Switch
          id="featured"
          checked={featured}
          onCheckedChange={(v) => setValue("featured", v)}
        />
        <Label htmlFor="featured">Serviço em destaque</Label>
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
