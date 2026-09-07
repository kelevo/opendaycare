import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ActivateBody = {
  code?: unknown;
  email?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  let raw: ActivateBody;
  try {
    raw = (await request.json()) as ActivateBody;
  } catch {
    return Response.json({ error: "Body inválido." }, { status: 400 });
  }

  const code = typeof raw.code === "string" ? raw.code.trim().toUpperCase() : "";
  const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  const password = typeof raw.password === "string" ? raw.password : "";

  if (!code) {
    return Response.json({ error: "Ingresá el código de invitación." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: "Ingresá un email válido." }, { status: 400 });
  }
  if (password.length < 6) {
    return Response.json({ error: "La contraseña debe tener al menos 6 caracteres." }, { status: 400 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: invitation } = await admin
    .from("invitations")
    .select("id, child_id, full_name, relationship, status, expires_at")
    .eq("code", code)
    .eq("email", email)
    .maybeSingle();

  if (!invitation) {
    return Response.json({ error: "Código o email inválido." }, { status: 400 });
  }
  if (invitation.status !== "pending") {
    return Response.json(
      { error: "Esta invitación ya fue usada o no está vigente." },
      { status: 400 },
    );
  }
  if (new Date(invitation.expires_at).getTime() < Date.now()) {
    return Response.json({ error: "El código venció. Pedí una invitación nueva." }, { status: 400 });
  }

  const { data: child } = await admin
    .from("children")
    .select("room_id")
    .eq("id", invitation.child_id)
    .maybeSingle();

  if (!child) {
    return Response.json({ error: "El niño ya no se encuentra en la guardería." }, { status: 400 });
  }

  const { data: room } = await admin
    .from("rooms")
    .select("daycare_id")
    .eq("id", child.room_id)
    .maybeSingle();

  const {
    data: created,
    error: createUserError,
  } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: "parent",
      daycare_id: room?.daycare_id ?? null,
      full_name: invitation.full_name,
    },
  });

  if (createUserError) {
    if (
      createUserError.status === 422 ||
      /already\s+(been\s+)?regist/i.test(createUserError.message)
    ) {
      return Response.json(
        { error: "Ya existe una cuenta con este email." },
        { status: 409 },
      );
    }
    console.error("activate createUser failed", createUserError);
    return Response.json({ error: "No se pudo crear la cuenta." }, { status: 500 });
  }

  const parentId = created.user.id;

  const { error: updateError } = await admin
    .from("invitations")
    .update({ status: "accepted", accepted_at: new Date().toISOString() })
    .eq("id", invitation.id);

  if (updateError) {
    console.error("activate invitation update failed", updateError);
    return Response.json({ error: "No se pudo aceptar la invitación." }, { status: 500 });
  }

  const { error: linkError } = await admin
    .from("parent_children")
    .upsert(
      {
        parent_id: parentId,
        child_id: invitation.child_id,
        relationship: invitation.relationship,
      },
      { onConflict: "parent_id,child_id", ignoreDuplicates: true },
    );

  if (linkError) {
    console.error("activate parent_children insert failed", linkError);
    return Response.json({ error: "No se pudo vincular al niño." }, { status: 500 });
  }

  return Response.json({ ok: true });
}