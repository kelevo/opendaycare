"use client";

import { useState } from "react";
import { kids } from "@/lib/kids";
import CrearPublicacionModal from "@/components/feed/CrearPublicacionModal";

export default function SidebarNewPostButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "100%",
          padding: 12,
          borderRadius: 14,
          background: "linear-gradient(180deg,#F4977E,#EE8164)",
          color: "#fff",
          fontWeight: 800,
          fontSize: 14.5,
          boxShadow: "0 8px 18px -8px rgba(238,129,100,.75)",
          marginBottom: 18,
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
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
        Nueva publicación
      </button>

      {showModal && (
        <CrearPublicacionModal kids={kids} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
