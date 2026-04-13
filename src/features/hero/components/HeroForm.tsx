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
import { useHero } from "../hooks/useHero";
import { useUpdateHero } from "../hooks/useUpdateHero";

const schema = z.object({
  tagline: z.string().min(1, "Obrigatório"),
  description: z.string().min(1, "Obrigatório"),
  ctaPrimary: z.string().min(1, "Obrigatório"),
  ctaSecondary: z.string().min(1, "Obrigatório"),
  whatsapp: z.string().min(1, "Obrigatório"),
  bgImage: z.string().min(1, "Obrigatório"),
});
type FormData = z.infer<typeof schema>;

export function HeroForm() {
  const { data, isLoading, error } = useHero();
  const update = useUpdateHero();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  async function onSubmit(values: FormData) {
    try {
      await update.mutateAsync(values);
      toast.success("Hero atualizado com sucesso.");
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
          <CardTitle>Textos</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FormField
            label="Tagline principal"
            required
            error={errors.tagline?.message}
          >
            <Input {...register("tagline")} aria-invalid={!!errors.tagline} />
          </FormField>
          <FormField
            label="Descrição"
            required
            error={errors.description?.message}
          >
            <Textarea
              rows={4}
              {...register("description")}
              aria-invalid={!!errors.description}
            />
          </FormField>
          <FormField
            label="Botão primário (CTA)"
            required
            error={errors.ctaPrimary?.message}
          >
            <Input
              {...register("ctaPrimary")}
              placeholder="Agendar Consulta"
              aria-invalid={!!errors.ctaPrimary}
            />
          </FormField>
          <FormField
            label="Botão secundário (CTA)"
            required
            error={errors.ctaSecondary?.message}
          >
            <Input
              {...register("ctaSecondary")}
              placeholder="Conhecer Serviços"
              aria-invalid={!!errors.ctaSecondary}
            />
          </FormField>
          <FormField
            label="WhatsApp (link completo)"
            required
            error={errors.whatsapp?.message}
          >
            <Input
              {...register("whatsapp")}
              placeholder="https://wa.me/5586981181575"
              aria-invalid={!!errors.whatsapp}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Imagem de Fundo</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            label="Imagem de fundo do hero"
            value={watch("bgImage") ?? ""}
            onChange={(v) => setValue("bgImage", v, { shouldDirty: true })}
          />
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
