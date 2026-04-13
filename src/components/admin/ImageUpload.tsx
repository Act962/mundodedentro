"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  value,
  onChange,
  label = "Imagem",
  maxSizeMB = 5,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Apenas arquivos de imagem são aceitos.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Falha no upload");
      const data = (await res.json()) as { url: string };
      onChange(data.url);
      toast.success("Imagem enviada com sucesso.");
    } catch {
      toast.error("Erro ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="space-y-1">
        <Label>{label}</Label>
        <p className="text-xs text-muted-foreground">
          Tamanho máximo: {maxSizeMB}MB. Formatos: JPG, PNG, WEBP, GIF, SVG.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/assets/exemplo.jpg ou URL"
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <UploadIcon />
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onChange("")}
          >
            <XIcon />
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {value && (
        <div className="relative h-32 w-full overflow-hidden rounded-md border bg-muted">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      )}
    </div>
  );
}
