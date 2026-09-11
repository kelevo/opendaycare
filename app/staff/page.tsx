const fredoka = { fontFamily: "var(--font-fredoka)" } as const;

export default async function StaffFeedPage() {
  return (
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
          Feed
        </h1>
        <p style={{ margin: "5px 0 0", color: "#94887B", fontSize: 14.5 }}>Publicaciones recientes</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <article style={postCardStyle}>
          <div style={postHeaderStyle}>
            <div style={avatarStyle}>M</div>
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
        </article>

        <article style={postCardStyle}>
          <div style={postHeaderStyle}>
            <div style={avatarStyle}>M</div>
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
        </article>
      </div>
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

const avatarStyle = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  background: "#A9D9E8",
  color: "#1F7A93",
  fontFamily: "var(--font-fredoka)",
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
