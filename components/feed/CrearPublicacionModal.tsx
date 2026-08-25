"use client";

import { useState } from "react";
import type { Kid } from "@/lib/kids";
import { postTypes } from "@/lib/posts";

const fredoka = { fontFamily: "var(--font-fredoka)" } as const;

const labelStyle = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: ".7px",
  color: "#94887B",
  marginBottom: 10,
} as const;

const kidAvatarSize = 26;

export default function CrearPublicacionModal({
  kids,
  onClose,
}: {
  kids: Kid[];
  onClose: () => void;
}) {
  const [selectedKids, setSelectedKids] = useState<Set<string>>(new Set());
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState("Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón.");

  const toggleKid = (slug: string) => {
    setSelectedKids((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const toggleAllKids = () => {
    setSelectedKids((prev) => {
      if (prev.size === kids.length) return new Set();
      return new Set(kids.map((k) => k.slug));
    });
  };

  const allSelected = selectedKids.size === kids.length && kids.length > 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(63,54,46,.35)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 24px",
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 580,
          background: "#FBF4EC",
          border: "1px solid #ECE0D0",
          borderRadius: 24,
          boxShadow: "0 20px 50px -24px rgba(63,54,46,.35)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 26px",
            borderBottom: "1px solid #ECE0D0",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94887B",
              fontWeight: 700,
              fontSize: 15,
              padding: 0,
            }}
          >
            Cancelar
          </button>
          <span style={{ ...fredoka, fontWeight: 600, fontSize: 18, color: "#3F362E" }}>
            Nueva publicación
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#D9583C",
              fontWeight: 800,
              fontSize: 15,
              padding: 0,
            }}
          >
            Publicar
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 26px" }}>
          {/* PARA */}
          <div style={labelStyle}>PARA</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 22 }}>
            {kids.map((kid) => {
              const isSelected = selectedKids.has(kid.slug);
              return (
                <button
                  key={kid.slug}
                  onClick={() => toggleKid(kid.slug)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 14px 6px 6px",
                    borderRadius: 999,
                    border: isSelected ? "1.5px solid #3F362E" : "1.5px solid #ECE0D0",
                    background: isSelected ? "#3F362E" : "#FFFDF9",
                    color: isSelected ? "#fff" : "#6E6359",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      width: kidAvatarSize,
                      height: kidAvatarSize,
                      borderRadius: "50%",
                      background: kid.avatarBg,
                      color: kid.avatarColor,
                      ...fredoka,
                      fontWeight: 600,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {kid.firstName[0]}
                  </span>
                  {kid.firstName}
                </button>
              );
            })}
            <button
              onClick={toggleAllKids}
              style={{
                padding: "6px 16px",
                borderRadius: 999,
                border: allSelected ? "1.5px solid #3F362E" : "1.5px solid #ECE0D0",
                background: allSelected ? "#3F362E" : "#FFFDF9",
                color: allSelected ? "#fff" : "#6E6359",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Toda la sala
            </button>
          </div>

          {/* TIPO */}
          <div style={labelStyle}>TIPO</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 22 }}>
            {postTypes.map((pt) => {
              const isSelected = selectedType === pt.key;
              return (
                <button
                  key={pt.key}
                  onClick={() => setSelectedType(isSelected ? null : pt.key)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    border: "none",
                    background: isSelected ? pt.bg : (pt.bg === "#9A7B1E" || pt.bg === "#2E89A6" ? "#E7DCF6" : pt.bg),
                    color: pt.color,
                    fontWeight: 800,
                    fontSize: 13.5,
                    cursor: "pointer",
                    opacity: isSelected ? 1 : 0.7,
                  }}
                >
                  {pt.key}
                </button>
              );
            })}
          </div>

          {/* DESCRIPCIÓN */}
          <div style={labelStyle}>DESCRIPCIÓN</div>
          <textarea
            placeholder="Contá cómo le fue hoy…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              minHeight: 120,
              resize: "vertical",
              padding: "14px 16px",
              borderRadius: 14,
              border: "1.5px solid #EADFD0",
              background: "#fff",
              fontSize: 15,
              color: "#3F362E",
              lineHeight: 1.5,
              marginBottom: 22,
            }}
          />

          {/* FOTOS */}
          <div style={labelStyle}>FOTOS</div>
          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 14,
                background: "#F4ECE1",
                border: "1px solid #ECE0D0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#CBB89F",
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
              </svg>
            </div>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 14,
                border: "1.5px dashed #DBCDBA",
                background: "#F4ECE1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                color: "#B0A290",
                cursor: "pointer",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C5503A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span style={{ fontSize: 12 }}>Agregar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
