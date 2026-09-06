"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import KidCard from "@/components/kids/KidCard";
import AddKidModal, { type SavedKid } from "@/components/kids/AddKidModal";
import { createClient } from "@/lib/supabase/client";

const fredoka = { fontFamily: "var(--font-fredoka)" } as const;

type RoomRow = { id: string; name: string };

type ChildRow = { id: string; room_id: string };

export default function KidsPage() {
  const supabase = createClient();
  const [addedKids, setAddedKids] = useState<SavedKid[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [childrenByRoom, setChildrenByRoom] = useState<Record<string, ChildRow[]>>({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [roomsResult, childrenResult] = await Promise.all([
        supabase.from("rooms").select("id, name"),
        supabase.from("children").select("id, room_id"),
      ]);

      if (cancelled) return;

      if (roomsResult.data) setRooms(roomsResult.data);

      if (childrenResult.data) {
        const grouped: Record<string, ChildRow[]> = {};
        for (const child of childrenResult.data) {
          if (!grouped[child.room_id]) grouped[child.room_id] = [];
          grouped[child.room_id].push(child);
        }
        setChildrenByRoom(grouped);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const roomSections = useMemo(() => {
    const normalize = (value: string) => value.trim().toLowerCase();

    const addedByRoom = new Map<string, SavedKid[]>();
    for (const kid of addedKids) {
      const key = normalize(kid.room);
      const list = addedByRoom.get(key);
      if (list) list.push(kid);
      else addedByRoom.set(key, [kid]);
    }

    const sections: { key: string; name: string; count: number; added: SavedKid[] }[] = rooms.map(
      (room) => ({
        key: room.id,
        name: room.name,
        count: (childrenByRoom[room.id]?.length ?? 0) + (addedByRoom.get(normalize(room.name))?.length ?? 0),
        added: addedByRoom.get(normalize(room.name)) ?? [],
      }),
    );

    const covered = new Set(sections.map((section) => normalize(section.name)));
    for (const [roomKey, kids] of addedByRoom) {
      if (covered.has(roomKey)) continue;
      sections.push({ key: `added-${roomKey}`, name: kids[0].room, count: kids.length, added: kids });
      covered.add(roomKey);
    }

    return sections;
  }, [rooms, childrenByRoom, addedKids]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F6ECDF" }}>
      <Sidebar active="kids" />

      <main style={{ flex: 1, minWidth: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ maxWidth: 880, width: "100%", margin: "0 auto", padding: "34px 40px 80px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 22,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  letterSpacing: ".8px",
                  color: "#D9583C",
                  marginBottom: 4,
                }}
              >
                GESTIÓN
              </div>
              <h1 style={{ ...fredoka, fontWeight: 600, fontSize: 30, margin: 0, color: "#3F362E" }}>Niños</h1>
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 18px",
                borderRadius: 14,
                background: "linear-gradient(180deg,#F4977E,#EE8164)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14.5,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 18px -8px rgba(238,129,100,.7)",
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
              Agregar niño
            </button>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              background: "#FFFDF9",
              border: "1px solid #ECE0D0",
              borderRadius: 14,
              padding: "12px 16px",
              marginBottom: 22,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#B0A290"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              placeholder="Buscar niño…"
              style={{ flex: 1, border: "none", background: "none", fontSize: 15, color: "#3F362E" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            {roomSections.map((section) => (
              <div key={section.key}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: ".8px", color: "#3F362E" }}>
                    SALA {section.name.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 13, color: "#A89A8B" }}>{section.count} niños</span>
                  <span style={{ flex: 1, height: 1, background: "#E7DAC8" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
                  {section.added.map((kid) => (
                    <KidCard key={kid.slug} kid={kid} href="#" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showModal && (
        <AddKidModal
          rooms={rooms.map((room) => room.name)}
          existingSlugs={addedKids.map((kid) => kid.slug)}
          onClose={() => setShowModal(false)}
          onSave={(kid) => {
            setAddedKids((prev) => [...prev, kid]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}