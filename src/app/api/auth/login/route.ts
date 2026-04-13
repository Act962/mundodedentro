import {
  createSessionToken,
  validateAdminCredentials,
  COOKIE_NAME,
  MAX_AGE,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body as { email: string; password: string };

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !validateAdminCredentials(email, password)
  ) {
    return Response.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  const token = await createSessionToken(email);

  return Response.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}`,
      },
    },
  );
}
