import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { childRowToKid } from "@/lib/kids";
import { createClient } from "@/lib/supabase/server";

const fredoka = { fontFamily: "var(--font-fredoka)" } as const;

export default async function FamilyHijoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient(await cookies());
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: link } = await supabase
    .from("parent_children")
    .select("child_id")
    .eq("parent_id", user.id)
    .eq("child_id", id)
    .maybeSingle();

  if (!link) notFound();

  const { data: row } = await supabase
    .from("children")
    .select("id, room_id, full_name, birth_date, enrolled_at, medical_notes, allergy_tags")
    .eq("id", id)
    .maybeSingle();

  if (!row) notFound();

  const { data: room } = await supabase
    .from("rooms")
    .select("name")
    .eq("id", row.room_id)
    .maybeSingle();

  const kid = childRowToKid(row, room?.name ?? "—");

  return (
    <div style={{ maxWidth: 820, width: "100%", margin: "0 auto", padding: "34px 40px 80px" }}>
      <Link
        href="/family/hijos"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          color: "#94887B",
          fontWeight: 700,
          fontSize: 14,
          marginBottom: 20,
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Volver a Mis hijos
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18 }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: kid.avatarBg,
            color: kid.avatarColor,
            ...fredoka,
            fontWeight: 600,
            fontSize: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "none",
          }}
        >
          {kid.firstName[0]}
        </div>
        <div>
          <h1 style={{ ...fredoka, fontWeight: 600, fontSize: 28, margin: 0, color: "#3F362E" }}>
            {kid.firstName} {kid.lastName}
          </h1>
          <p style={{ margin: "3px 0 0", color: "#94887B", fontSize: 15 }}>
            {kid.age} años · Sala {kid.room}
          </p>
        </div>
      </div>

      {kid.allergy && (
        <div style={{ display: "flex", gap: 14, background: "#FBDAD6", borderRadius: 16, padding: "16px 18px", marginBottom: 18 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              background: "#F4A8A0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "none",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, color: "#C5413A", fontSize: 15, marginBottom: 2 }}>
              Alergias y notas
            </div>
            <div style={{ color: "#B25249", fontSize: 14.5, lineHeight: 1.5 }}>{kid.allergy.note}</div>
          </div>
        </div>
      )}

      <div style={{ background: "#FFFDF9", border: "1px solid #ECE0D0", borderRadius: 16, overflow: "hidden" }}>
        <DataRow label="Fecha de nacimiento" value={kid.birthday} />
        <DataRow label="Sala" value={kid.room} />
        <DataRow label="Ingreso" value={kid.enrollment} last />
      </div>
    </div>
  );
}

function DataRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 18px",
        ...(last ? {} : { borderBottom: "1px solid #F0E6D8" }),
      }}
    >
      <span style={{ color: "#94887B", fontSize: 14.5 }}>{label}</span>
      <span style={{ fontWeight: 800, color: "#3F362E", fontSize: 14.5 }}>{value}</span>
    </div>
  );
}
