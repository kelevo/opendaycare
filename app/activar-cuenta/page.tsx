const fredoka = { fontFamily: "var(--font-fredoka)" } as const;

export default function ActivarCuentaPage() {
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
            }}
          >
            M
          </div>
          <div>
            <div style={{ fontSize: 13, color: "#94887B" }}>Te invitaron a seguir a</div>
            <div style={{ ...fredoka, fontWeight: 600, fontSize: 17, color: "#3F362E" }}>
              Mateo · Sala Soles
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".7px",
            color: "#94887B",
            marginBottom: 8,
          }}
        >
          CÓDIGO DE INVITACIÓN
        </div>
        <input
          defaultValue="7K4P9"
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
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".7px",
            color: "#94887B",
            marginBottom: 8,
          }}
        >
          EMAIL
        </div>
        <input
          type="email"
          defaultValue="lucia.fernandez@gmail.com"
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 14,
            border: "1.5px solid #EADFD0",
            background: "#fff",
            fontSize: 15,
            color: "#3F362E",
            marginBottom: 18,
          }}
        />
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".7px",
            color: "#94887B",
            marginBottom: 8,
          }}
        >
          CREAR CONTRASEÑA
        </div>
        <input
          type="password"
          defaultValue="contraseña"
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 14,
            border: "1.5px solid #F2A78E",
            background: "#fff",
            fontSize: 15,
            color: "#3F362E",
            marginBottom: 18,
          }}
        />

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            background: "#FBF1D6",
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
              background: "#5FB97E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 1,
            }}
          >
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
          </span>
          <span style={{ fontSize: 14, color: "#8A7234", lineHeight: 1.45 }}>
            Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de la app.
          </span>
        </label>

        <a
          href="#"
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
          }}
        >
          Activar mi cuenta
        </a>
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
