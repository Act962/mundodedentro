"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@/lib/zodResolver";
import { useAbout } from "../hooks/useAbout";
import { useUpdateAbout } from "../hooks/useUpdateAbout";

const schema = z.object({
  title: z.string().min(1, "Obrigatório"),
  historyText: z.string().min(1, "Obrigatório"),
  philosophyTitle: z.string().min(1, "Obrigatório"),
  philosophyText: z.string().min(1, "Obrigatório"),
  targetAudience: z.string().min(1, "Obrigatório"),
  yearsExperience: z.coerce.number().int().min(0),
  photo: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function AboutForm() {
  const { data, isLoading, error } = useAbout();
  const update = useUpdateAbout();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (data) reset({ ...data, photo: data.photo ?? "" });
  }, [data, reset]);

  async function onSubmit(values: FormData) {
    try {
      await update.mutateAsync(values);
      toast.success("Seção Sobre atualizada com sucesso.");
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    }
  }

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Carregando…</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Nossa História</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FormField
            label="Título da seção"
            required
            error={errors.title?.message}
          >
            <Input
              {...register("title")}
              placeholder="Nossa História"
              aria-invalid={!!errors.title}
            />
          </FormField>
          <FormField
            label="Texto da história"
            required
            error={errors.historyText?.message}
          >
            <Textarea
              rows={6}
              {...register("historyText")}
              aria-invalid={!!errors.historyText}
            />
          </FormField>
          <FormField
            label="Anos de experiência"
            required
            error={errors.yearsExperience?.message}
          >
            <Input
              type="number"
              {...register("yearsExperience")}
              className="w-28"
              aria-invalid={!!errors.yearsExperience}
            />
          </FormField>
          <FormField
            label="Público-alvo"
            required
            error={errors.targetAudience?.message}
          >
            <Input
              {...register("targetAudience")}
              placeholder="Atendemos de 1 a 99 anos…"
              aria-invalid={!!errors.targetAudience}
            />
          </FormField>
          <ImageUpload
            label="Foto da seção"
            value={watch("photo") ?? ""}
            onChange={(v) => setValue("photo", v, { shouldDirty: true })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filosofia</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FormField
            label="Título da filosofia"
            required
            error={errors.philosophyTitle?.message}
          >
            <Input
              {...register("philosophyTitle")}
              placeholder="Nossa Filosofia"
              aria-invalid={!!errors.philosophyTitle}
            />
          </FormField>
          <FormField
            label="Texto da filosofia"
            required
            error={errors.philosophyText?.message}
          >
            <Textarea
              rows={4}
              {...register("philosophyText")}
              aria-invalid={!!errors.philosophyText}
            />
          </FormField>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || update.isPending}>
          {update.isPending ? "Salvando…" : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
