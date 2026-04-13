"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@/lib/zodResolver";
import { useSeoAll } from "../hooks/useSeo";
import { useUpsertSeo } from "../hooks/useUpsertSeo";

const pages = [
  { key: "home", label: "Início" },
  { key: "about", label: "Sobre" },
  { key: "services", label: "Serviços" },
  { key: "team", label: "Equipe" },
  { key: "contact", label: "Contato" },
];

const schema = z.object({
  title: z.string().min(1, "Obrigatório"),
  description: z.string().min(1, "Obrigatório"),
  ogImage: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function SeoPageForm({ pageKey }: { pageKey: string }) {
  const { data: seoList } = useSeoAll();
  const upsert = useUpsertSeo();
  const existing = seoList?.find((s) => s.page === pageKey);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", ogImage: "" },
  });

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        description: existing.description,
        ogImage: existing.ogImage ?? "",
      });
    }
  }, [existing, reset]);

  async function onSubmit(values: FormData) {
    try {
      await upsert.mutateAsync({ page: pageKey, ...values });
      toast.success("SEO salvo.");
    } catch {
      toast.error("Erro ao salvar SEO.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField
        label="Título da página"
        required
        error={errors.title?.message}
      >
        <Input {...register("title")} aria-invalid={!!errors.title} />
      </FormField>
      <FormField
        label="Meta descrição"
        required
        error={errors.description?.message}
      >
        <Textarea
          rows={3}
          {...register("description")}
          aria-invalid={!!errors.description}
        />
      </FormField>
      <ImageUpload
        label="OG Image (Open Graph)"
        value={watch("ogImage") ?? ""}
        onChange={(v) => setValue("ogImage", v, { shouldDirty: true })}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || upsert.isPending}>
          {upsert.isPending ? "Salvando…" : "Salvar"}
        </Button>
      </div>
    </form>
  );
}

export function SeoForm() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações SEO por página</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            {pages.map((page) => (
              <TabsTrigger key={page.key} value={page.key}>
                {page.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {pages.map((page) => (
            <TabsContent key={page.key} value={page.key}>
              <SeoPageForm pageKey={page.key} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
