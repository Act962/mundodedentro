import { readFile } from "node:fs/promises";
import { join, normalize } from "node:path";

function getUploadsDir() {
  return process.env.UPLOADS_DIR?.trim() || join(process.cwd(), "data", "uploads");
}

function getContentType(filename: string) {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  if (!path?.length) {
    return new Response("Not found", { status: 404 });
  }

  // Previne path traversal.
  const safeRel = normalize(path.join("/")).replace(/^(\.\.(\/|\\|$))+/, "");
  const absolute = join(getUploadsDir(), safeRel);

  try {
    const file = await readFile(absolute);
    return new Response(file, {
      headers: {
        "Content-Type": getContentType(safeRel),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

