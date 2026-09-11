const fredoka = { fontFamily: "var(--font-fredoka)" } as const;

export default function FamilyNotificacionesPage() {
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
          FAMILIA
        </div>
        <h1 style={{ ...fredoka, fontWeight: 600, fontSize: 30, margin: 0, color: "#3F362E" }}>
          Notificaciones
        </h1>
        <p style={{ margin: "5px 0 0", color: "#94887B", fontSize: 14.5 }}>
          Notificaciones relevantes para vos
        </p>
      </div>

      <div
        style={{
          background: "#FFFDF9",
          border: "1px solid #ECE0D0",
          borderRadius: 20,
          padding: "40px 22px",
          textAlign: "center",
          color: "#94887B",
          fontSize: 15,
        }}
      >
        Próximamente
      </div>
    </div>
  );
}
