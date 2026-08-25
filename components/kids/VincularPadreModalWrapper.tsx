"use client";

import { useState } from "react";
import type { ParentLink } from "@/lib/kids";
import VincularPadreModal from "./VincularPadreModal";

const parentAvatarPalette: { bg: string; color: string }[] = [
  { bg: "#C9B6E8", color: "#fff" },
  { bg: "#A9C7E8", color: "#fff" },
  { bg: "#A9D9E8", color: "#fff" },
  { bg: "#F4B8CC", color: "#fff" },
];

export default function VincularPadreModalWrapper({
  kidName,
  linkedParents,
}: {
  kidName: string;
  linkedParents: ParentLink[];
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div style={{ background: "#FFFDF9", border: "1px solid #ECE0D0", borderRadius: 16, padding: "16px 18px" }}>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 800,
            letterSpacing: ".8px",
            color: "#8A7C6D",
            marginBottom: 14,
          }}
        >
          PADRES VINCULADOS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {linkedParents.map((parent, index) => (
            <ParentRow key={parent.id} parent={parent} index={index} />
          ))}
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 0 0",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "1.5px dashed #D8CBBA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#B0A290",
                flex: "none",
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
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
            <span style={{ fontWeight: 800, fontSize: 14.5, color: "#C5503A" }}>Vincular otro padre</span>
          </button>
        </div>
      </div>

      {showModal && (
        <VincularPadreModal kidName={kidName} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

function ParentRow({ parent, index }: { parent: ParentLink; index: number }) {
  const avatar = parentAvatarPalette[index % parentAvatarPalette.length];
  const sub = parent.status === "active" ? `${parent.role} · activa` : `${parent.role} · invitación enviada`;
  const active = parent.status === "active";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: avatar.bg,
          color: avatar.color,
          fontFamily: "var(--font-fredoka)",
          fontWeight: 600,
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "none",
        }}
      >
        {parent.name[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 14.5, color: "#3F362E" }}>{parent.name}</div>
        <div style={{ fontSize: 12.5, color: "#A89A8B" }}>{sub}</div>
      </div>
      <span
        style={{
          flex: "none",
          fontSize: 10.5,
          fontWeight: 800,
          padding: "4px 9px",
          borderRadius: 999,
          background: active ? "#CFEBD8" : "#F7E7A6",
          color: active ? "#3E9B6C" : "#9A7B1E",
        }}
      >
        {active ? "ACTIVA" : "PENDIENTE"}
      </span>
    </div>
  );
}
