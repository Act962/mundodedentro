import { writeFile, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";
import { randomBytes } from "node:crypto";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return Response.json(
      { error: "Tipo de arquivo inválido. Apenas imagens são aceitas." },
      { status: 400 },
    );
  }

  const MAX_SIZE_MB = 5;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return Response.json(
      { error: `Arquivo muito grande. Tamanho máximo: ${MAX_SIZE_MB}MB.` },
      { status: 400 },
    );
  }

  try {
    const ext = extname(file.name) || ".jpg";
    const filename = `${randomBytes(16).toString("hex")}${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(uploadDir, filename), buffer);

    return Response.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Upload Error:", error);
    return Response.json(
      { error: "Erro interno no servidor ao salvar o arquivo." },
      { status: 500 },
    );
  }
}
