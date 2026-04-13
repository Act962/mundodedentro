"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/admin/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@/lib/zodResolver";
import { useContact } from "../hooks/useContact";
import { useUpdateContact } from "../hooks/useUpdateContact";

const schema = z.object({
  whatsapp: z.string().min(1, "Obrigatório"),
  email: z.string().email("E-mail inválido"),
  hours: z.string().min(1, "Obrigatório"),
  location: z.string().min(1, "Obrigatório"),
  mapEmbed: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const { data, isLoading, error } = useContact();
  const update = useUpdateContact();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (data) reset({ ...data, mapEmbed: data.mapEmbed ?? "" });
  }, [data, reset]);

  async function onSubmit(values: FormData) {
    try {
      await update.mutateAsync(values);
      toast.success("Informações de contato salvas.");
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    }
  }

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Carregando…</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <FormField
            label="WhatsApp (número com DDI)"
            required
            error={errors.whatsapp?.message}
          >
            <Input
              {...register("whatsapp")}
              placeholder="(86) 98118-1575"
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
            label="URL embed do Google Maps"
            error={errors.mapEmbed?.message}
          >
            <Textarea
              rows={3}
              {...register("mapEmbed")}
              placeholder="https://www.google.com/maps/embed?pb=..."
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
