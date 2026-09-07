"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const fredoka = { fontFamily: "var(--font-fredoka)" } as const;

const labelStyle = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: ".7px",
  color: "#94887B",
  marginBottom: 8,
} as const;

const inputBase = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1.5px solid #EADFD0",
  background: "#fff",
  fontSize: 15,
  color: "#3F362E",
  marginBottom: 18,
} as const;

export default function ActivarCuentaForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const prefill = useMemo(
    () => ({
      code: searchParams.get("code") ?? "",
      email: searchParams.get("email") ?? "",
      fullName: searchParams.get("fullName") ?? "",
      child: searchParams.get("child") ?? "",
      sala: searchParams.get("sala") ?? "",
    }),
    [searchParams],
  );

  const [code, setCode] = useState(prefill.code);
  const [email] = useState(prefill.email);
  const [customName, setCustomName] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordError =
    password.length > 0 && password.length < 6
      ? "La contraseña debe tener al menos 6 caracteres"
      : null;

  const borderFor = (hasError: boolean) =>
    hasError ? "1.5px solid #D9583C" : "1.5px solid #EADFD0";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, email, password }),
      });

      const payload = (await res.json().catch(() => null)) as { error?: string } | null;

      if (!res.ok) {
        setError(payload?.error ?? "No se pudo activar la cuenta.");
        setSubmitting(false);
        return;
      }

      router.replace("/login?activated=1");
    } catch {
      setError("Hubo un error de red. Intentalo de nuevo.");
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FBF4EC",
        padding: 40,
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 18,
            background: "linear-gradient(155deg,#F8C3A8,#F2937A)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 22,
            boxShadow: "0 12px 26px -10px rgba(238,129,100,.65)",
          }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        </div>
        <h1
          style={{
            ...fredoka,
            fontWeight: 600,
            fontSize: 32,
            lineHeight: 1.15,
            margin: "0 0 8px",
            color: "#3F362E",
          }}
        >
          Bienvenida a OpenDayCare
        </h1>
        <p style={{ margin: "0 0 26px", color: "#94887B", fontSize: 15.5, lineHeight: 1.55 }}>
          Te invitaron a seguir el día de tu hijo. Creá tu contraseña para activar la cuenta.
        </p>

        {prefill.child && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: "#fff",
              border: "1.5px solid #EADFD0",
              borderRadius: 16,
              padding: "14px 16px",
              marginBottom: 22,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#A9D9E8",
                color: "#1F7A93",
                ...fredoka,
                fontWeight: 600,
                fontSize: 19,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "none",
              }}
            >
              {(prefill.child || "M")[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#94887B" }}>Te invitaron a seguir a</div>
              <div style={{ ...fredoka, fontWeight: 600, fontSize: 17, color: "#3F362E" }}>
                {prefill.child}
                {prefill.sala ? ` · ${prefill.sala}` : ""}
              </div>
            </div>
          </div>
        )}

        <div style={labelStyle}>NOMBRE</div>
        {prefill.fullName ? (
          <input
            value={prefill.fullName}
            readOnly
            disabled
            style={{
              ...inputBase,
              background: "#F0E6D8",
              color: "#94887B",
              border: "1.5px solid #EADFD0",
            }}
          />
        ) : (
          <input
            placeholder="Tu nombre y apellido"
            value={customName}
            onChange={(event) => setCustomName(event.target.value)}
            style={inputBase}
          />
        )}

        <div style={labelStyle}>CÓDIGO DE INVITACIÓN</div>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="Ej. 7K4P9"
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 14,
            border: "1.5px solid #EADFD0",
            background: "#fff",
            fontSize: 18,
            letterSpacing: 3,
            fontWeight: 700,
            color: "#3F362E",
            marginBottom: 18,
            ...fredoka,
          }}
        />

        <div style={labelStyle}>EMAIL</div>
        <input
          type="email"
          value={email}
          readOnly
          disabled
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 14,
            border: "1.5px solid #EADFD0",
            background: "#F0E6D8",
            fontSize: 15,
            color: "#94887B",
            marginBottom: 10,
          }}
        />
        <div style={{ fontSize: 12.5, color: "#A89A8B", marginBottom: 18 }}>
          El email viene del link y no se puede cambiar.
        </div>

        <div style={labelStyle}>CREAR CONTRASEÑA</div>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Mínimo 6 caracteres"
          style={{
            ...inputBase,
            border: borderFor(passwordError !== null),
          }}
        />
        {passwordError && (
          <div style={{ fontSize: 13, color: "#C5503A", marginTop: 4, marginBottom: 10 }}>
            {passwordError}
          </div>
        )}

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            background: agreed ? "#E7F6EC" : "#FBF1D6",
            borderRadius: 14,
            padding: "14px 16px",
            marginBottom: 24,
            cursor: "pointer",
          }}
        >
          <span
            style={{
              flex: "none",
              width: 24,
              height: 24,
              borderRadius: 8,
              background: agreed ? "#5FB97E" : "#fff",
              border: "1.5px solid #D8CBBA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 1,
            }}
          >
            {agreed && (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </span>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            style={{ display: "none" }}
          />
          <span style={{ fontSize: 14, color: "#8A7234", lineHeight: 1.45 }}>
            Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de la app.
            <span style={{ color: agreed ? "#2F7A50" : "#C5503A", fontWeight: 800 }}> (obligatorio)</span>
          </span>
        </label>

        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              display: "block",
              textAlign: "center",
              width: "100%",
              padding: 15,
              borderRadius: 15,
              background: "linear-gradient(180deg,#F4977E,#EE8164)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 16,
              boxShadow: "0 10px 22px -8px rgba(238,129,100,.7)",
              border: "none",
              cursor: submitting ? "default" : "pointer",
              opacity: submitting ? 0.7 : 1,
              fontFamily: "inherit",
            }}
          >
            {submitting ? "Activando…" : "Activar mi cuenta"}
          </button>
        </form>

        {error && (
          <div
            style={{
              marginTop: 18,
              background: "#FBDAD6",
              color: "#B5413A",
              borderRadius: 12,
              padding: "12px 14px",
              fontSize: 13.5,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <p style={{ textAlign: "center", margin: "22px 0 0", color: "#94887B", fontSize: 14.5 }}>
          ¿Ya tenés cuenta?{" "}
          <a href="/login" style={{ color: "#C5503A", fontWeight: 800 }}>
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
}