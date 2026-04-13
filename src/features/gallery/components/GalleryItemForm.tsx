"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@/lib/zodResolver";

const schema = z.object({
  src: z.string().min(1, "Obrigatório"),
  alt: z.string().min(1, "Obrigatório"),
  label: z.string().min(1, "Obrigatório"),
  order: z.coerce.number().int().min(0).default(0),
});
export type GalleryItemFormData = z.infer<typeof schema>;

interface GalleryItemFormProps {
  defaultValues?: Partial<GalleryItemFormData>;
  onSubmit: (data: GalleryItemFormData) => Promise<void>;
  isPending: boolean;
  submitLabel?: string;
}

export function GalleryItemForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = "Salvar",
}: GalleryItemFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GalleryItemFormData>({
    resolver: zodResolver(schema),
    defaultValues: { order: 0, ...defaultValues },
  });

  useEffect(() => {
    if (defaultValues) reset({ order: 0, ...defaultValues });
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <ImageUpload
        label="Foto"
        value={watch("src") ?? ""}
        onChange={(v) => setValue("src", v, { shouldValidate: true })}
      />
      {errors.src && (
        <p className="text-sm text-destructive">{errors.src.message}</p>
      )}
      <FormField
        label="Texto alternativo (acessibilidade)"
        required
        error={errors.alt?.message}
      >
        <Input
          {...register("alt")}
          placeholder="Sala infantil com mesa e brinquedos"
          aria-invalid={!!errors.alt}
        />
      </FormField>
      <FormField label="Legenda" required error={errors.label?.message}>
        <Input
          {...register("label")}
          placeholder="Sala Lúdica"
          aria-invalid={!!errors.label}
        />
      </FormField>
      <FormField label="Ordem" error={errors.order?.message}>
        <Input type="number" {...register("order")} className="w-24" />
      </FormField>
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
