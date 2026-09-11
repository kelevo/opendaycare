import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const fredoka = { fontFamily: "var(--font-fredoka)" } as const;

export default async function FamilyHijosPage() {
  const supabase = createClient(await cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: linkedChildren } = await supabase
    .from("parent_children")
    .select("child_id, children(id, full_name, room_id, rooms(name))")
    .eq("parent_id", user.id);

  const children = (linkedChildren ?? [])
    .map((link) => {
      const child = Array.isArray(link.children) ? link.children[0] : link.children;
      const room = child ? (Array.isArray(child.rooms) ? child.rooms[0] : child.rooms) : null;
      return child
        ? {
            id: child.id,
            name: child.full_name,
            room: room?.name ?? "—",
          }
        : null;
    })
    .filter(Boolean) as { id: string; name: string; room: string }[];

  return (
    <div style={{ maxWidth: 880, width: "100%", margin: "0 auto", padding: "34px 40px 80px" }}>
      <div style={{ marginBottom: 22 }}>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 800,
            letterSpacing: ".8px",
            color: "#D9583C",
            marginBottom: 4,
          }}
        >
          FAMILIA
        </div>
        <h1 style={{ ...fredoka, fontWeight: 600, fontSize: 30, margin: 0, color: "#3F362E" }}>
          Mis hijos
        </h1>
      </div>

      {children.length === 0 ? (
        <div
          style={{
            background: "#FFFDF9",
            border: "1px solid #ECE0D0",
            borderRadius: 20,
            padding: "40px 22px",
            textAlign: "center",
            color: "#94887B",
            fontSize: 15,
          }}
        >
          No tenés hijos vinculados a tu cuenta.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {children.map((child) => (
            <Link
              key={child.id}
              href={`/family/hijos/${child.id}`}
              style={{
                background: "#FFFDF9",
                border: "1px solid #ECE0D0",
                borderRadius: 16,
                padding: "18px 20px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 14,
                boxShadow: "0 4px 14px -10px rgba(120,90,60,.4)",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "#A9D9E8",
                  color: "#1F7A93",
                  ...fredoka,
                  fontWeight: 600,
                  fontSize: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "none",
                }}
              >
                {child.name[0]}
              </div>
              <div>
                <div style={{ ...fredoka, fontWeight: 600, fontSize: 16, color: "#3F362E" }}>
                  {child.name}
                </div>
                <div style={{ fontSize: 13, color: "#A89A8B" }}>Sala {child.room}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
