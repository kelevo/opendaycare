import { notFound } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import { getKidBySlug, kids } from "@/lib/kids";
import VincularPadreModalWrapper from "@/components/kids/VincularPadreModalWrapper";

const fredoka = { fontFamily: "var(--font-fredoka)" } as const;

export function generateStaticParams() {
  return kids.map((kid) => ({ slug: kid.slug }));
}

export default async function KidProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kid = getKidBySlug(slug);
  if (!kid) notFound();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F6ECDF" }}>
      <Sidebar active="kids" />

      <main style={{ flex: 1, minWidth: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ maxWidth: 820, width: "100%", margin: "0 auto", padding: "34px 40px 80px" }}>
          <Link
            href="/kids"
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
            Volver a Niños
          </Link>
          <div style={{ display: "flex", gap: 26, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
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
                <div style={{ flex: 1 }}>
                  <h1 style={{ ...fredoka, fontWeight: 600, fontSize: 28, margin: 0, color: "#3F362E" }}>
                    {kid.firstName} {kid.lastName}
                  </h1>
                  <p style={{ margin: "3px 0 0", color: "#94887B", fontSize: 15 }}>
                    {kid.age} años · Sala {kid.room}
                  </p>
                </div>
                <a
                  href="#"
                  style={{
                    border: "1.5px solid #ECE0D0",
                    background: "#FFFDF9",
                    color: "#6E6359",
                    fontWeight: 700,
                    fontSize: 14,
                    padding: "9px 16px",
                    borderRadius: 12,
                  }}
                >
                  Editar
                </a>
              </div>
              {kid.allergy && (
                <div style={{ display: "flex", gap: 14, background: "#FBDAD6", borderRadius: 16, padding: "16px 18px" }}>
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
            <div style={{ width: 300, flex: "none", display: "flex", flexDirection: "column", gap: 14 }}>
              <a
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 9,
                  width: "100%",
                  padding: 13,
                  borderRadius: 14,
                  background: "#3F362E",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 15,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
                Resumen del día
              </a>
              <VincularPadreModalWrapper
                kidName={`${kid.firstName} ${kid.lastName}`}
                linkedParents={kid.linkedParents}
              />
            </div>
          </div>
        </div>
      </main>
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
