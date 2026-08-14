const fredoka = { fontFamily: "var(--font-fredoka)" } as const;

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1.05fr 1fr",
        background: "#FBF4EC",
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(155deg,#F6A98E 0%,#F2937A 45%,#EC7E62 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 60px",
          color: "#fff",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(255,255,255,.12)",
            top: -140,
            right: -120,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,.10)",
            bottom: -110,
            left: -80,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 13, position: "relative" }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: "rgba(255,255,255,.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="26"
              height="26"
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
          <span
            style={{
              ...fredoka,
              fontWeight: 600,
              fontSize: 21,
              letterSpacing: ".5px",
            }}
          >
            OpenDayCare
          </span>
        </div>
        <div style={{ position: "relative" }}>
          <h1
            style={{
              ...fredoka,
              fontWeight: 600,
              fontSize: 42,
              lineHeight: 1.12,
              margin: "0 0 18px",
            }}
          >
            El día de cada niño,
            <br />
            compartido con su familia.
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 430,
              color: "rgba(255,255,255,.92)",
            }}
          >
            Publicá momentos, gestioná las salas y mantené a las familias cerca, desde un solo lugar.
          </p>
        </div>
        <div style={{ position: "relative", fontSize: 14, color: "rgba(255,255,255,.9)" }}>
          🌿 Guardería Sala Soles
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
        }}
      >
        <div style={{ width: "100%", maxWidth: 392 }}>
          <h2
            style={{
              ...fredoka,
              fontWeight: 600,
              fontSize: 30,
              margin: "0 0 6px",
              color: "#3F362E",
            }}
          >
            Iniciar sesión
          </h2>
          <p style={{ margin: "0 0 28px", color: "#94887B", fontSize: 15 }}>
            Ingresá para ver el día de hoy.
          </p>

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
            defaultValue="caro@opendaycare.com"
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
            CONTRASEÑA
          </div>
          <input
            type="password"
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 14,
              border: "1.5px solid #EADFD0",
              background: "#fff",
              fontSize: 15,
              color: "#3F362E",
              marginBottom: 10,
            }}
          />
          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <a
              href="#"
              style={{
                color: "#C5503A",
                fontSize: 13.5,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <a
            href="/"
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
              cursor: "pointer",
              boxShadow: "0 10px 22px -8px rgba(238,129,100,.7)",
            }}
          >
            Iniciar sesión
          </a>

          <p style={{ textAlign: "center", margin: "24px 0 0", color: "#94887B", fontSize: 14.5 }}>
            ¿Te invitó la guardería?{" "}
            <a href="/activar-cuenta" style={{ color: "#C5503A", fontWeight: 800 }}>
              Activá tu cuenta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
