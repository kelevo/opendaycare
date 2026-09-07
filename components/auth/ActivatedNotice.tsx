"use client";

import { useSearchParams } from "next/navigation";

export default function ActivatedNotice() {
  const searchParams = useSearchParams();
  if (searchParams.get("activated") !== "1") return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "#E7F6EC",
        border: "1.5px solid #BFE3CB",
        borderRadius: 14,
        padding: "12px 14px",
        marginBottom: 20,
      }}
    >
      <span
        style={{
          flex: "none",
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "#5FB97E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="14"
          height="14"
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
      <span style={{ fontSize: 14, color: "#2F7A50", fontWeight: 700, lineHeight: 1.4 }}>
        Tu cuenta fue activada. Ingresá para empezar.
      </span>
    </div>
  );
}