import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { generateInviteCode } from "@/lib/invite";
import { Resend } from "resend";

type Relationship = "father" | "mother" | "guardian";

const RELATIONSHIP_FROM_UI: Record<string, Relationship> = {
  "Mamá": "mother",
  "Papá": "father",
  "Tutor/a": "guardian",
  mother: "mother",
  father: "father",
  guardian: "guardian",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_RE = /^[A-Z2-9]{5}$/i;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type InviteBody = {
  childId?: unknown;
  fullName?: unknown;
  email?: unknown;
  relationship?: unknown;
  code?: unknown;
};

export async function POST(request: Request) {
  let raw: InviteBody;
  try {
    raw = (await request.json()) as InviteBody;
  } catch {
    return Response.json({ error: "Body inválido." }, { status: 400 });
  }

  const childId = typeof raw.childId === "string" ? raw.childId.trim() : "";
  const fullName = typeof raw.fullName === "string" ? raw.fullName.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  const requestedCode =
    typeof raw.code === "string" && CODE_RE.test(raw.code.trim())
      ? raw.code.trim().toUpperCase()
      : null;
  const relationshipRaw = typeof raw.relationship === "string" ? raw.relationship.trim() : "";

  const relationship = RELATIONSHIP_FROM_UI[relationshipRaw];
  if (!relationship) {
    return Response.json(
      { error: "El parentesco debe ser Mamá, Papá o Tutor/a." },
      { status: 400 },
    );
  }

  if (!UUID_RE.test(childId)) {
    return Response.json({ error: "Niño inválido." }, { status: 400 });
  }
  if (!fullName) {
    return Response.json({ error: "Ingresá el nombre del padre/madre." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: "Ingresá un email válido." }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "No autenticado." }, { status: 401 });
  }

  const { data: hasAccess } = await supabase.rpc("has_staff_access_to_child", {
    p_child_id: childId,
  });
  if (hasAccess !== true) {
    return Response.json({ error: "No tenés acceso a este niño." }, { status: 403 });
  }

  const { data: child } = await supabase
    .from("children")
    .select("id, full_name, room_id")
    .eq("id", childId)
    .maybeSingle();

  if (!child) {
    return Response.json({ error: "Niño no encontrado." }, { status: 404 });
  }

  const { data: room } = await supabase
    .from("rooms")
    .select("name")
    .eq("id", child.room_id)
    .maybeSingle();

  const { data: existing } = await supabase
    .from("invitations")
    .select("id")
    .eq("email", email)
    .eq("child_id", childId)
    .eq("status", "pending")
    .maybeSingle();

  if (existing) {
    return Response.json(
      { error: "Este email ya tiene una invitación pendiente para este niño." },
      { status: 409 },
    );
  }

  let inserted: { id: string; code: string } | null = null;
  let insertError: Error | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    const code = attempt === 0 && requestedCode ? requestedCode : generateInviteCode();
    const { data, error } = await supabase
      .from("invitations")
      .insert({
        child_id: childId,
        invited_by: user.id,
        full_name: fullName,
        email,
        relationship,
        code,
        status: "pending",
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select("id, code")
      .single();

    if (!error && data) {
      inserted = { id: data.id, code: data.code };
      break;
    }
    insertError = error;
  }

  if (!inserted) {
    console.error("invitations insert failed", insertError?.message);
    return Response.json({ error: "No se pudo guardar la invitación." }, { status: 500 });
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";
  const activateUrl = `${origin}/activar-cuenta?code=${encodeURIComponent(
    inserted.code,
  )}&email=${encodeURIComponent(email)}&child=${encodeURIComponent(
    child.full_name,
  )}&sala=${encodeURIComponent(room?.name ?? "")}&fullName=${encodeURIComponent(fullName)}`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "OpenDayCare <onboarding@resend.dev>",
      to: email,
      subject: `Invitación a OpenDayCare · ${escapeHtml(child.full_name)}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;background:#F7EFE4;padding:32px 0;">
          <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
            <div style="background:#F2937A;padding:26px 32px;">
              <div style="font-size:22px;font-weight:700;color:#ffffff;">OpenDayCare</div>
            </div>
            <div style="padding:32px;">
              <p style="color:#3F362E;font-size:16px;margin:0 0 18px;">Hola <strong>${escapeHtml(fullName)}</strong>,</p>
              <p style="color:#6E6359;font-size:15px;line-height:1.5;margin:0 0 6px;">
                Te invitamos a ver el día de <strong>${escapeHtml(child.full_name)}</strong> en la sala
                <strong>${escapeHtml(room?.name ?? "—")}</strong>.
              </p>
              <p style="color:#6E6359;font-size:15px;line-height:1.5;margin:0 0 24px;">
                Ingresá el código de invitación para crear tu cuenta y vincularte.
              </p>
              <div style="background:#FBF1D6;border:1.5px dashed #E6D08A;border-radius:14px;text-align:center;padding:20px;margin-bottom:24px;">
                <div style="font-size:12px;font-weight:800;letter-spacing:1px;color:#A88526;margin-bottom:10px;">CÓDIGO DE INVITACIÓN</div>
                <div style="font-size:36px;font-weight:800;letter-spacing:8px;color:#8A7234;">${escapeHtml(inserted.code)}</div>
                <div style="font-size:13px;color:#A88526;margin-top:8px;">Vence en 7 días</div>
              </div>
              <a href="${activateUrl}"
                 style="display:block;text-align:center;background:linear-gradient(180deg,#F4977E,#EE8164);color:#ffffff;text-decoration:none;font-weight:800;font-size:16px;padding:14px 0;border-radius:14px;">
                Crear mi cuenta y vincularme
              </a>
              <p style="font-size:13px;color:#A89A8B;line-height:1.5;margin:24px 0 0;">
                Si no podés abrir el botón, copiá este link: ${activateUrl}
              </p>
            </div>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("resend email failed", error);
    return Response.json(
      { error: "La invitación se guardó pero no se pudo enviar el email." },
      { status: 502 },
    );
  }

  return Response.json(
    {
      id: inserted.id,
      code: inserted.code,
      email,
      full_name: fullName,
    },
    { status: 201 },
  );
}