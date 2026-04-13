"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@/lib/zodResolver";

const schema = z.object({
  text: z.string().min(1, "Obrigatório"),
  author: z.string().min(1, "Obrigatório"),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  photo: z.string().optional(),
  order: z.coerce.number().int().min(0).default(0),
});
export type TestimonialFormData = z.infer<typeof schema>;

interface TestimonialFormProps {
  defaultValues?: Partial<TestimonialFormData>;
  onSubmit: (data: TestimonialFormData) => Promise<void>;
  isPending: boolean;
  submitLabel?: string;
}

export function TestimonialForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = "Salvar",
}: TestimonialFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5, order: 0, ...defaultValues },
  });

  useEffect(() => {
    if (defaultValues) reset({ rating: 5, order: 0, ...defaultValues });
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField label="Depoimento" required error={errors.text?.message}>
        <Textarea rows={4} {...register("text")} aria-invalid={!!errors.text} />
      </FormField>
      <FormField label="Autor" required error={errors.author?.message}>
        <Input
          {...register("author")}
          placeholder="Mãe da Maria, 8 anos"
          aria-invalid={!!errors.author}
        />
      </FormField>
      <FormField label="Nota (1–5)" required error={errors.rating?.message}>
        <Input
          type="number"
          min={1}
          max={5}
          {...register("rating")}
          className="w-20"
        />
      </FormField>
      <FormField label="Ordem" error={errors.order?.message}>
        <Input type="number" {...register("order")} className="w-24" />
      </FormField>
      <ImageUpload
        label="Foto do autor (opcional)"
        value={watch("photo") ?? ""}
        onChange={(v) => setValue("photo", v, { shouldDirty: true })}
      />
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
