"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import KidCard from "@/components/kids/KidCard";
import AddKidModal from "@/components/kids/AddKidModal";
import { kids, type Kid } from "@/lib/kids";

const fredoka = { fontFamily: "var(--font-fredoka)" } as const;

export default function KidsPage() {
  const [addedKids, setAddedKids] = useState<Kid[]>([]);
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F6ECDF" }}>
      <Sidebar active="kids" />

      <main style={{ flex: 1, minWidth: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ maxWidth: 880, width: "100%", margin: "0 auto", padding: "34px 40px 80px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 22,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  letterSpacing: ".8px",
                  color: "#D9583C",
                  marginBottom: 4,
                }}
              >
                GESTIÓN
              </div>
              <h1 style={{ ...fredoka, fontWeight: 600, fontSize: 30, margin: 0, color: "#3F362E" }}>Niños</h1>
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 18px",
                borderRadius: 14,
                background: "linear-gradient(180deg,#F4977E,#EE8164)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14.5,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 18px -8px rgba(238,129,100,.7)",
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Agregar niño
            </button>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              background: "#FFFDF9",
              border: "1px solid #ECE0D0",
              borderRadius: 14,
              padding: "12px 16px",
              marginBottom: 22,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#B0A290"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              placeholder="Buscar niño…"
              style={{ flex: 1, border: "none", background: "none", fontSize: 15, color: "#3F362E" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: ".8px", color: "#3F362E" }}>SALA SOLES</span>
            <span style={{ fontSize: 13, color: "#A89A8B" }}>{kids.length} niños</span>
            <span style={{ flex: 1, height: 1, background: "#E7DAC8" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
            {kids.map((kid) => (
              <KidCard key={kid.slug} kid={kid} />
            ))}
            {addedKids.map((kid) => (
              <KidCard key={kid.slug} kid={kid} href="#" />
            ))}
          </div>
        </div>
      </main>

      {showModal && (
        <AddKidModal
          existingSlugs={addedKids.map((kid) => kid.slug)}
          onClose={() => setShowModal(false)}
          onSave={(kid) => {
            setAddedKids((prev) => [...prev, kid]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
