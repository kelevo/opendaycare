const fredoka = { fontFamily: "var(--font-fredoka)" } as const;

export default function Home() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F6ECDF" }}>
      <aside
        style={{
          width: 248,
          flex: "none",
          background: "#FFFDF9",
          borderRight: "1px solid #ECE0D0",
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <a
          href="#"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            padding: "4px 8px 22px",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "linear-gradient(155deg,#F8C3A8,#F2937A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "none",
            }}
          >
            <svg
              width="21"
              height="21"
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
          <div>
            <div style={{ ...fredoka, fontWeight: 600, fontSize: 17, color: "#3F362E", lineHeight: 1 }}>
              OpenDayCare
            </div>
            <div style={{ fontSize: 11.5, color: "#A89A8B", marginTop: 2 }}>Sala Soles</div>
          </div>
        </a>
        <a
          href="#"
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
        </a>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 12px",
              borderRadius: 12,
              background: "#FBE3D8",
              color: "#D9583C",
              fontWeight: 800,
              fontSize: 14.5,
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
            </svg>
            Feed
          </a>
          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 12px",
              borderRadius: 12,
              background: "transparent",
              color: "#6E6359",
              fontWeight: 600,
              fontSize: 14.5,
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="7" r="3" />
              <circle cx="17" cy="9" r="2.4" />
              <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 20a5 5 0 0 1 5.5-4.9" />
            </svg>
            Niños
          </a>
          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 12px",
              borderRadius: 12,
              background: "transparent",
              color: "#6E6359",
              fontWeight: 600,
              fontSize: 14.5,
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
            </svg>
            Avisos
          </a>
          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 12px",
              borderRadius: 12,
              background: "transparent",
              color: "#6E6359",
              fontWeight: 600,
              fontSize: 14.5,
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Mi cuenta
          </a>
        </nav>
        <div style={{ borderTop: "1px solid #ECE0D0", paddingTop: 14, marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "6px 8px" }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#F2937A",
                color: "#fff",
                ...fredoka,
                fontWeight: 600,
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "none",
              }}
            >
              C
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#3F362E" }}>Caro Giménez</div>
              <div style={{ fontSize: 12, color: "#A89A8B" }}>Maestra · Soles</div>
            </div>
            <a
              href="#"
              title="Cerrar sesión"
              style={{
                flex: "none",
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "#F6ECDF",
                color: "#94887B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </a>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ maxWidth: 760, width: "100%", margin: "0 auto", padding: "34px 40px 80px" }}>
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 800,
                letterSpacing: ".8px",
                color: "#D9583C",
                marginBottom: 4,
              }}
            >
              GUARDERÍA · SALA SOLES
            </div>
            <h1 style={{ ...fredoka, fontWeight: 600, fontSize: 30, margin: 0, color: "#3F362E" }}>
              Buenas, Caro
            </h1>
            <p style={{ margin: "5px 0 0", color: "#94887B", fontSize: 14.5 }}>12 niños · martes 17 jun</p>
          </div>

          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: "#FFFDF9",
              border: "1px solid #ECE0D0",
              borderRadius: 18,
              padding: "14px 18px",
              marginBottom: 24,
              boxShadow: "0 4px 14px -10px rgba(120,90,60,.4)",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#F2937A",
                color: "#fff",
                ...fredoka,
                fontWeight: 600,
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "none",
              }}
            >
              C
            </div>
            <span style={{ flex: 1, color: "#A89A8B", fontSize: 15 }}>Compartí un momento…</span>
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: "#FBE3D8",
                color: "#E0654A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </span>
          </a>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: ".8px", color: "#8A7C6D" }}>
              PUBLICADO HOY
            </span>
            <span style={{ flex: 1, height: 1, background: "#E7DAC8" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <article style={postCardStyle}>
              <div style={postHeaderStyle}>
                <div style={mateoAvatarStyle}>M</div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...fredoka, fontWeight: 600, fontSize: 16.5, color: "#3F362E" }}>Mateo</div>
                  <div style={{ fontSize: 12.5, color: "#A89A8B" }}>14:20 · publicado por vos</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 12px", borderRadius: 999, background: "#CFEBD8" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3E9B6C" }} />
                  <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".5px", color: "#3E9B6C" }}>LOGRO</span>
                </div>
              </div>
              <div style={{ fontSize: 12.5, color: "#A89A8B", marginBottom: 10 }}>Para: familia de Mateo</div>
              <p style={postBodyStyle}>
                ¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.
              </p>
              <div style={postFooterStyle}>
                <span style={heartCountStyle}>
                  <HeartIcon />
                  3
                </span>
                <a href="#" style={commentLinkStyle}>
                  <CommentIcon />
                  1
                </a>
                <span style={{ flex: 1 }} />
                <a href="#" style={editLinkStyle}>
                  Editar
                </a>
              </div>
            </article>

            <article style={postCardStyle}>
              <div style={postHeaderStyle}>
                <div style={mateoAvatarStyle}>M</div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...fredoka, fontWeight: 600, fontSize: 16.5, color: "#3F362E" }}>Mateo</div>
                  <div style={{ fontSize: 12.5, color: "#A89A8B" }}>09:40 · publicado por vos</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 12px", borderRadius: 999, background: "#C7E7F1" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2E89A6" }} />
                  <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".5px", color: "#2E89A6" }}>ACTIVIDAD</span>
                </div>
              </div>
              <div style={{ fontSize: 12.5, color: "#A89A8B", marginBottom: 10 }}>Para: familia de Mateo</div>
              <p style={postBodyStyle}>
                Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.
              </p>
              <a
                href="#"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 14,
                  border: "1.5px dashed #DBCDBA",
                  borderRadius: 16,
                  background: "#F4ECE1",
                  height: 200,
                  color: "#B0A290",
                }}
              >
                <svg
                  width="30"
                  height="30"
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
                <span style={{ fontSize: 13.5 }}>Foto · pintando con témperas</span>
              </a>
              <div style={postFooterStyle}>
                <span style={heartCountStyle}>
                  <HeartIcon />
                  5
                </span>
                <a href="#" style={commentLinkStyle}>
                  <CommentIcon />
                  2
                </a>
                <span style={{ flex: 1 }} />
                <a href="#" style={editLinkStyle}>
                  Editar
                </a>
              </div>
            </article>

            <article style={postCardStyle}>
              <div style={postHeaderStyle}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "#CCD8F4",
                    color: "#4E72C8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "none",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...fredoka, fontWeight: 600, fontSize: 16.5, color: "#3F362E" }}>Anuncio general</div>
                  <div style={{ fontSize: 12.5, color: "#A89A8B" }}>07:50 · publicado por vos</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 12px", borderRadius: 999, background: "#CCD8F4" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4E72C8" }} />
                  <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".5px", color: "#4E72C8" }}>ANUNCIO</span>
                </div>
              </div>
              <div style={{ fontSize: 12.5, color: "#A89A8B", marginBottom: 10 }}>Para: toda la sala</div>
              <p style={postBodyStyle}>
                El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.
              </p>
              <div style={postFooterStyle}>
                <span style={heartCountStyle}>
                  <HeartIcon />
                  8
                </span>
                <a href="#" style={commentLinkStyle}>
                  <CommentIcon />
                  0
                </a>
                <span style={{ flex: 1 }} />
                <a href="#" style={editLinkStyle}>
                  Editar
                </a>
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
}

const postCardStyle = {
  background: "#FFFDF9",
  border: "1px solid #ECE0D0",
  borderRadius: 20,
  padding: "20px 22px",
  boxShadow: "0 4px 16px -12px rgba(120,90,60,.5)",
} as const;

const postHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 14,
} as const;

const mateoAvatarStyle = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  background: "#A9D9E8",
  color: "#1F7A93",
  ...fredoka,
  fontWeight: 600,
  fontSize: 17,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "none",
} as const;

const postBodyStyle = {
  fontSize: 15.5,
  lineHeight: 1.55,
  color: "#4A4038",
  margin: 0,
} as const;

const postFooterStyle = {
  display: "flex",
  alignItems: "center",
  gap: 18,
  marginTop: 16,
  paddingTop: 14,
  borderTop: "1px solid #F0E6D8",
} as const;

const heartCountStyle = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  color: "#E0654A",
  fontWeight: 700,
  fontSize: 14,
} as const;

const commentLinkStyle = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  color: "#94887B",
  fontWeight: 700,
  fontSize: 14,
} as const;

const editLinkStyle = {
  color: "#C5503A",
  fontWeight: 800,
  fontSize: 14,
} as const;

function HeartIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="#E0654A"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
    </svg>
  );
}
