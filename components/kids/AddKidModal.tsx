"use client";

import { useState } from "react";
import type { Kid, KidInput } from "@/lib/kids";
import { buildKidFromInput } from "@/lib/kids";
import { rooms } from "@/lib/rooms";

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

const errorStyle = { fontSize: 13, color: "#C5503A", marginTop: 6 } as const;

function applyDateMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function isValidDate(birthday: string): boolean {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthday)) return false;
  const [day, month, year] = birthday.split("/").map(Number);
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) return false;
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  );
}

export default function AddKidModal({
  existingSlugs,
  onClose,
  onSave,
}: {
  existingSlugs: string[];
  onClose: () => void;
  onSave: (kid: Kid) => void;
}) {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [room, setRoom] = useState("");
  const [allergies, setAllergies] = useState("");
  const [notes, setNotes] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const nameError = name.trim() === "" ? "Ingresá el nombre completo" : null;
  const birthdayError = !isValidDate(birthday) ? "Ingresá una fecha válida (dd/mm/aaaa)" : null;
  const roomError = room === "" ? "Elegí una sala" : null;

  const canSave = !nameError && !birthdayError && !roomError;

  const touch = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSave = () => {
    if (!canSave) return;
    const input: KidInput = { name, birthday, room, allergies, medicalNotes: notes };
    onSave(buildKidFromInput(input, existingSlugs));
  };

  const borderFor = (field: string, hasError: boolean) =>
    touched[field] && hasError ? "1.5px solid #D9583C" : "1.5px solid #EADFD0";

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
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "#FBF4EC",
          border: "1px solid #ECE0D0",
          borderRadius: 24,
          boxShadow: "0 20px 50px -24px rgba(63,54,46,.35)",
          overflow: "hidden",
        }}
      >
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
            Agregar niño
          </span>
          <button
            onClick={handleSave}
            disabled={!canSave}
            style={{
              background: "none",
              border: "none",
              cursor: canSave ? "pointer" : "default",
              color: canSave ? "#D9583C" : "#CBB89F",
              fontWeight: 800,
              fontSize: 15,
              padding: 0,
            }}
          >
            Guardar
          </button>
        </div>

        <div style={{ padding: "24px 26px" }}>
          <div style={labelStyle}>NOMBRE COMPLETO</div>
          <input
            placeholder="Ej. Martina López"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => touch("name")}
            style={{ ...inputBase, border: borderFor("name", !!nameError) }}
          />
          {touched.name && nameError && <div style={errorStyle}>{nameError}</div>}

          <div style={{ display: "flex", gap: 14, marginTop: 18, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>FECHA DE NACIMIENTO</div>
              <input
                placeholder="dd/mm/aaaa"
                value={birthday}
                onChange={(e) => setBirthday(applyDateMask(e.target.value))}
                onBlur={() => touch("birthday")}
                inputMode="numeric"
                style={{ ...inputBase, border: borderFor("birthday", !!birthdayError) }}
              />
              {touched.birthday && birthdayError && <div style={errorStyle}>{birthdayError}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>SALA</div>
              <div style={{ position: "relative" }}>
                <select
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  onBlur={() => touch("room")}
                  style={{
                    ...inputBase,
                    fontWeight: 700,
                    appearance: "none",
                    WebkitAppearance: "none",
                    color: room === "" ? "#B6A99B" : "#3F362E",
                    paddingRight: 40,
                    border: borderFor("room", !!roomError),
                    cursor: "pointer",
                  }}
                >
                  <option value="" disabled>
                    Elegí sala
                  </option>
                  {rooms.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <span
                  style={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    pointerEvents: "none",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#B0A290"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
              {touched.room && roomError && <div style={errorStyle}>{roomError}</div>}
            </div>
          </div>

          <div style={{ ...labelStyle, marginTop: 18 }}>ALERGIAS (ETIQUETAS)</div>
          <input
            placeholder="Ej. Maní, Lactosa"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            style={inputBase}
          />
          <div style={{ ...labelStyle, marginTop: 18 }}>NOTAS MÉDICAS</div>
          <textarea
            placeholder="Indicaciones, medicación, contactos…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              ...inputBase,
              minHeight: 90,
              resize: "vertical",
              lineHeight: 1.5,
            }}
          />
        </div>
      </div>
    </div>
  );
}
