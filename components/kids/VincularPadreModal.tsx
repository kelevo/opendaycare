"use client";

import { useState } from "react";
import { generateInviteCode } from "@/lib/invite";

const fredoka = { fontFamily: "var(--font-fredoka)" } as const;

const labelStyle = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: ".7px",
  color: "#94887B",
  marginBottom: 8,
} as const;

const inputBase = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: 14,
  border: "1.5px solid #EADFD0",
  background: "#fff",
  fontSize: 15,
  color: "#3F362E",
} as const;

const PARENTES = ["Mamá", "Papá", "Tutor/a"] as const;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function VincularPadreModal({
  kidName,
  onClose,
}: {
  kidName: string;
  onClose: () => void;
}) {
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [parentesco, setParentesco] = useState<(typeof PARENTES)[number]>("Mamá");
  const [inviteCode] = useState(generateInviteCode);

  const nameError = parentName.trim() === "" ? "Ingresá el nombre del padre/madre" : null;
  const emailError = email.trim() === "" ? "Ingresá un email" : !isValidEmail(email) ? "Ingresá un email válido" : null;

  const borderFor = (hasError: boolean) =>
    hasError ? "1.5px solid #D9583C" : "1.5px solid #EADFD0";

  const handleSubmit = () => {
    onClose();
  };

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
          maxWidth: 480,
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
          <div>
            <div style={{ ...fredoka, fontWeight: 600, fontSize: 18, color: "#3F362E" }}>
              Vincular padre
            </div>
            <div style={{ fontSize: 13, color: "#A89A8B" }}>a {kidName}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "#F0E6D8",
              color: "#94887B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
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
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 26px" }}>
          {/* Alerta informativa */}
          <div
            style={{
              display: "flex",
              gap: 11,
              background: "#E3ECFB",
              borderRadius: 14,
              padding: "13px 16px",
              marginBottom: 20,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4E72C8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flex: "none", marginTop: 1 }}
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span style={{ fontSize: 13.5, color: "#3F5694", lineHeight: 1.45 }}>
              Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed de{" "}
              {kidName}.
            </span>
          </div>

          {/* NOMBRE DEL PADRE/MADRE */}
          <div style={labelStyle}>NOMBRE DEL PADRE/MADRE</div>
          <input
            placeholder="Ej. Diego Fernández"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            style={{ ...inputBase, border: borderFor(nameError !== null), marginBottom: 18 }}
          />
          {nameError && <div style={{ fontSize: 13, color: "#C5503A", marginTop: 4, marginBottom: 10 }}>{nameError}</div>}

          {/* EMAIL */}
          <div style={labelStyle}>EMAIL</div>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ ...inputBase, border: borderFor(emailError !== null), marginBottom: 18 }}
          />
          {emailError && <div style={{ fontSize: 13, color: "#C5503A", marginTop: 4, marginBottom: 10 }}>{emailError}</div>}

          {/* PARENTESCO */}
          <div style={labelStyle}>PARENTESCO</div>
          <div style={{ display: "flex", gap: 9, marginBottom: 20 }}>
            {PARENTES.map((p) => {
              const isActive = parentesco === p;
              return (
                <button
                  key={p}
                  onClick={() => setParentesco(p)}
                  style={{
                    flex: 1,
                    padding: "11px 0",
                    borderRadius: 999,
                    border: isActive ? "1.5px solid #9FB8EC" : "1.5px solid #ECE0D0",
                    background: isActive ? "#CCD8F4" : "#FFFDF9",
                    color: isActive ? "#4E72C8" : "#6E6359",
                    fontWeight: 800,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* Código de invitación */}
          <div
            style={{
              background: "#FBF1D6",
              border: "1.5px dashed #E6D08A",
              borderRadius: 16,
              padding: 18,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: ".7px",
                color: "#A88526",
                marginBottom: 8,
              }}
            >
              CÓDIGO DE INVITACIÓN
            </div>
            <div style={{ ...fredoka, fontWeight: 600, fontSize: 34, letterSpacing: 7, color: "#8A7234" }}>
              {inviteCode}
            </div>
            <div style={{ fontSize: 13, color: "#A88526", marginTop: 6 }}>Vence en 7 días</div>
          </div>

          {/* Enviar invitación */}
          <button
            onClick={handleSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              width: "100%",
              padding: 14,
              borderRadius: 14,
              background: "linear-gradient(180deg,#F4977E,#EE8164)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 15.5,
              boxShadow: "0 10px 22px -8px rgba(238,129,100,.7)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4z" />
              <path d="M22 2 11 13" />
            </svg>
            Enviar invitación
          </button>
        </div>
      </div>
    </div>
  );
}
