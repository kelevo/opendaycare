import type { Kid } from "@/lib/kids";

const fredoka = { fontFamily: "var(--font-fredoka)" } as const;

export default function KidCard({ kid }: { kid: Kid }) {
  const parentCount = kid.linkedParents.length;
  const parentLabel =
    parentCount === 0 ? "sin padres vinculados" : parentCount === 1 ? "1 padre vinculado" : `${parentCount} padres vinculados`;

  return (
    <a
      className="kid"
      href={`/kids/${kid.slug}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        minWidth: 0,
        background: "#FFFDF9",
        border: "1px solid #ECE0D0",
        borderRadius: 18,
        padding: 16,
        boxShadow: "0 4px 14px -12px rgba(120,90,60,.5)",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: kid.avatarBg,
          color: kid.avatarColor,
          ...fredoka,
          fontWeight: 600,
          fontSize: 19,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "none",
        }}
      >
        {kid.firstName[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...fredoka, fontWeight: 600, fontSize: 16, color: "#3F362E" }}>
          {kid.firstName} {kid.lastName}
        </div>
        <div style={{ fontSize: 13, color: "#A89A8B" }}>
          {kid.age} años · {parentLabel}
        </div>
      </div>
      {kid.needsLink ? (
        <span
          style={{
            flex: "none",
            fontSize: 11,
            fontWeight: 800,
            padding: "5px 9px",
            borderRadius: 999,
            background: "#F9D2DE",
            color: "#C56486",
          }}
        >
          VINCULAR
        </span>
      ) : kid.allergy ? (
        <span
          style={{
            flex: "none",
            fontSize: 11,
            fontWeight: 800,
            padding: "5px 9px",
            borderRadius: 999,
            background: "#FBD8CC",
            color: "#D9684A",
          }}
        >
          {kid.allergy.label}
        </span>
      ) : (
        <svg
          style={{ flex: "none" }}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#CBB89F"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </a>
  );
}
