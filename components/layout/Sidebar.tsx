import type { ReactNode } from "react";

const fredoka = { fontFamily: "var(--font-fredoka)" } as const;

type NavKey = "feed" | "kids" | "avisos" | "mi-cuenta";

type SidebarProps = {
  active: "feed" | "kids";
};

export default function Sidebar({ active }: SidebarProps) {
  const navItems: { key: NavKey; label: string; href: string; icon: ReactNode }[] = [
    { key: "feed", label: "Feed", href: "/", icon: <HomeIcon /> },
    { key: "kids", label: "Niños", href: "/kids", icon: <KidsIcon /> },
    { key: "avisos", label: "Avisos", href: "#", icon: <BellIcon /> },
    { key: "mi-cuenta", label: "Mi cuenta", href: "#", icon: <UserIcon /> },
  ];

  return (
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
        href="/"
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
        {navItems.map((item) => {
          const isActive = item.key === active;
          return (
            <a
              key={item.key}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 12px",
                borderRadius: 12,
                background: isActive ? "#FBE3D8" : "transparent",
                color: isActive ? "#D9583C" : "#6E6359",
                fontWeight: isActive ? 800 : 600,
                fontSize: 14.5,
              }}
            >
              {item.icon}
              {item.label}
            </a>
          );
        })}
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
  );
}

function HomeIcon() {
  return (
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
  );
}

function KidsIcon() {
  return (
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
  );
}

function BellIcon() {
  return (
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
  );
}

function UserIcon() {
  return (
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
  );
}
