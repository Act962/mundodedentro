"use client";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/admin/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@/lib/zodResolver";
import { type ParentsQueryData, useParents } from "../hooks/useParents";
import { useUpdateParents } from "../hooks/useUpdateParents";

const iconOptions = [
  "Heart",
  "Brain",
  "Lightbulb",
  "BookOpen",
  "Users",
  "Activity",
  "Sparkles",
  "School",
  "GraduationCap",
  "MessageCircle",
];

const approachSchema = z.object({
  icon: z.string().min(1, "Obrigatorio"),
  title: z.string().min(1, "Obrigatorio"),
  description: z.string().min(1, "Obrigatorio"),
});

const schema = z.object({
  badge: z.string().min(1, "Obrigatorio"),
  title: z.string().min(1, "Obrigatorio"),
  description: z.string().min(1, "Obrigatorio"),
  approaches: z.array(approachSchema).min(1),
  warningTitle: z.string().min(1, "Obrigatorio"),
  warningDescription: z.string().min(1, "Obrigatorio"),
  warningSignals: z.array(
    z.object({ value: z.string().min(1, "Obrigatorio") }),
  ),
  warningFooter: z.string().min(1, "Obrigatorio"),
});

type FormData = z.infer<typeof schema>;
type ParentsPayload = Omit<FormData, "warningSignals"> & {
  warningSignals: string[];
};
type ParentsData = ParentsQueryData;

const emptyApproach = {
  icon: "Heart",
  title: "",
  description: "",
};

function normalizeApproaches(value: unknown): FormData["approaches"] {
  if (!Array.isArray(value)) return [emptyApproach];
  const approaches = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const approach = item as Record<string, unknown>;
      return {
        icon: typeof approach.icon === "string" ? approach.icon : "Heart",
        title: typeof approach.title === "string" ? approach.title : "",
        description:
          typeof approach.description === "string" ? approach.description : "",
      };
    })
    .filter((item): item is FormData["approaches"][number] => !!item);
  return approaches.length > 0 ? approaches : [emptyApproach];
}

export function ParentsForm() {
  const { data, isLoading } = useParents();
  const update = useUpdateParents();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      approaches: [emptyApproach],
      warningSignals: [{ value: "" }],
    },
  });

  const approaches = useFieldArray({ control, name: "approaches" });
  const warningSignals = useFieldArray({ control, name: "warningSignals" });

  useEffect(() => {
    if (!data) return;
    const parents: ParentsData = data;
    const nextValues: FormData = {
      badge: parents.badge,
      title: parents.title,
      description: parents.description,
      approaches: normalizeApproaches(parents.approaches),
      warningTitle: parents.warningTitle,
      warningDescription: parents.warningDescription,
      warningSignals: parents.warningSignals.map((value) => ({ value })),
      warningFooter: parents.warningFooter,
    };
    reset(nextValues);
  }, [data, reset]);

  async function onSubmit(values: FormData) {
    const payload: ParentsPayload = {
      badge: values.badge,
      title: values.title,
      description: values.description,
      approaches: values.approaches,
      warningTitle: values.warningTitle,
      warningDescription: values.warningDescription,
      warningSignals: values.warningSignals.map((signal) => signal.value),
      warningFooter: values.warningFooter,
    };
    const saveParents = update.mutateAsync as (
      input: ParentsPayload,
    ) => Promise<unknown>;

    try {
      await saveParents(payload);
      toast.success("Secao de pais atualizada com sucesso.");
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    }
  }

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Carregando...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Introducao</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FormField label="Selo" required error={errors.badge?.message}>
            <Input {...register("badge")} aria-invalid={!!errors.badge} />
          </FormField>
          <FormField label="Titulo" required error={errors.title?.message}>
            <Input {...register("title")} aria-invalid={!!errors.title} />
          </FormField>
          <FormField
            label="Descricao"
            required
            error={errors.description?.message}
          >
            <Textarea
              rows={3}
              {...register("description")}
              aria-invalid={!!errors.description}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Abordagens</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => approaches.append(emptyApproach)}
          >
            <Plus className="size-4" />
            Adicionar
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {approaches.fields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-4 rounded-md border p-4 md:grid-cols-[160px_1fr_auto]"
            >
              <FormField
                label="Icone"
                required
                error={errors.approaches?.[index]?.icon?.message}
              >
                <NativeSelect
                  className="w-full"
                  {...register(`approaches.${index}.icon`)}
                  aria-invalid={!!errors.approaches?.[index]?.icon}
                >
                  {iconOptions.map((icon) => (
                    <NativeSelectOption key={icon} value={icon}>
                      {icon}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </FormField>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  label="Titulo"
                  required
                  error={errors.approaches?.[index]?.title?.message}
                >
                  <Input
                    {...register(`approaches.${index}.title`)}
                    aria-invalid={!!errors.approaches?.[index]?.title}
                  />
                </FormField>
                <FormField
                  label="Descricao"
                  required
                  error={errors.approaches?.[index]?.description?.message}
                >
                  <Textarea
                    rows={2}
                    {...register(`approaches.${index}.description`)}
                    aria-invalid={!!errors.approaches?.[index]?.description}
                  />
                </FormField>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="self-end"
                disabled={approaches.fields.length === 1}
                onClick={() => approaches.remove(index)}
                aria-label="Remover abordagem"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sinais de Alerta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FormField
            label="Titulo"
            required
            error={errors.warningTitle?.message}
          >
            <Input
              {...register("warningTitle")}
              aria-invalid={!!errors.warningTitle}
            />
          </FormField>
          <FormField
            label="Descricao"
            required
            error={errors.warningDescription?.message}
          >
            <Textarea
              rows={3}
              {...register("warningDescription")}
              aria-invalid={!!errors.warningDescription}
            />
          </FormField>
          <div className="flex flex-col gap-3">
            {warningSignals.fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2">
                <FormField
                  label={`Sinal ${index + 1}`}
                  required
                  error={errors.warningSignals?.[index]?.value?.message}
                >
                  <Input
                    {...register(`warningSignals.${index}.value`)}
                    aria-invalid={!!errors.warningSignals?.[index]?.value}
                  />
                </FormField>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={warningSignals.fields.length === 1}
                  onClick={() => warningSignals.remove(index)}
                  aria-label="Remover sinal"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-fit"
              onClick={() => warningSignals.append({ value: "" })}
            >
              <Plus className="size-4" />
              Adicionar sinal
            </Button>
          </div>
          <FormField
            label="Texto final"
            required
            error={errors.warningFooter?.message}
          >
            <Textarea
              rows={3}
              {...register("warningFooter")}
              aria-invalid={!!errors.warningFooter}
            />
          </FormField>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || update.isPending}>
          {update.isPending ? "Salvando..." : "Salvar Alteracoes"}
        </Button>
      </div>
    </form>
  );
}
