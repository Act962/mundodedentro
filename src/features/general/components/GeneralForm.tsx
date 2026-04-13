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
import { zodResolver } from "@/lib/zodResolver";
import { useGeneral } from "../hooks/useGeneral";
import { useUpdateGeneral } from "../hooks/useUpdateGeneral";

const schema = z.object({
  siteName: z.string().min(1, "Obrigatório"),
  tagline: z.string().min(1, "Obrigatório"),
  logo: z.string().min(1, "Obrigatório"),
  whatsapp: z.string().min(1, "Obrigatório"),
  email: z.string().email("E-mail inválido"),
  hours: z.string().min(1, "Obrigatório"),
  location: z.string().min(1, "Obrigatório"),
  mapEmbed: z.string().optional(),
  instagramUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function GeneralForm() {
  const { data, isLoading, error } = useGeneral();
  const update = useUpdateGeneral();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (data)
      reset({
        ...data,
        mapEmbed: data.mapEmbed ?? "",
        instagramUrl: data.instagramUrl ?? "",
        facebookUrl: data.facebookUrl ?? "",
      });
  }, [data, reset]);

  async function onSubmit(values: FormData) {
    try {
      await update.mutateAsync(values);
      toast.success("Configurações salvas com sucesso.");
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
          <CardTitle>Identidade</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FormField
            label="Nome do Instituto"
            required
            error={errors.siteName?.message}
          >
            <Input {...register("siteName")} aria-invalid={!!errors.siteName} />
          </FormField>
          <FormField label="Tagline" required error={errors.tagline?.message}>
            <Input {...register("tagline")} aria-invalid={!!errors.tagline} />
          </FormField>
          <ImageUpload
            label="Logo"
            value={watch("logo") ?? ""}
            onChange={(v) => setValue("logo", v, { shouldDirty: true })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contato</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FormField
            label="WhatsApp (com código do país)"
            required
            error={errors.whatsapp?.message}
          >
            <Input
              {...register("whatsapp")}
              placeholder="5586981181575"
              aria-invalid={!!errors.whatsapp}
            />
          </FormField>
          <FormField label="E-mail" required error={errors.email?.message}>
            <Input
              type="email"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
          </FormField>
          <FormField
            label="Horário de Atendimento"
            required
            error={errors.hours?.message}
          >
            <Input
              {...register("hours")}
              placeholder="Segunda a Sexta: 8h às 21h"
              aria-invalid={!!errors.hours}
            />
          </FormField>
          <FormField
            label="Localização"
            required
            error={errors.location?.message}
          >
            <Input
              {...register("location")}
              placeholder="Teresina, Piauí"
              aria-invalid={!!errors.location}
            />
          </FormField>
          <FormField
            label="Embed do Google Maps (iframe src)"
            error={errors.mapEmbed?.message}
          >
            <Input
              {...register("mapEmbed")}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Redes Sociais</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FormField label="Instagram" error={errors.instagramUrl?.message}>
            <Input
              {...register("instagramUrl")}
              placeholder="https://instagram.com/..."
            />
          </FormField>
          <FormField label="Facebook" error={errors.facebookUrl?.message}>
            <Input
              {...register("facebookUrl")}
              placeholder="https://facebook.com/..."
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
