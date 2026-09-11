import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const fredoka = { fontFamily: "var(--font-fredoka)" } as const;

export default async function FamilyFeedPage() {
  const supabase = createClient(await cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: linkedChildren } = await supabase
    .from("parent_children")
    .select("child_id")
    .eq("parent_id", user.id);

  const childIds = (linkedChildren ?? []).map((l) => l.child_id);

  let posts: {
    id: string;
    title: string;
    body: string;
    post_type: string;
    created_at: string;
  }[] = [];

  if (childIds.length > 0) {
    const { data } = await supabase
      .from("posts")
      .select("id, title, body, post_type, created_at")
      .in("child_id", childIds)
      .order("created_at", { ascending: false });

    posts = data ?? [];
  }

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
          Feed
        </h1>
        <p style={{ margin: "5px 0 0", color: "#94887B", fontSize: 14.5 }}>
          Publicaciones de tus hijos
        </p>
      </div>

      {posts.length === 0 ? (
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
          No hay publicaciones recientes de tus hijos.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {posts.map((post) => (
            <article
              key={post.id}
              style={{
                background: "#FFFDF9",
                border: "1px solid #ECE0D0",
                borderRadius: 20,
                padding: "20px 22px",
                boxShadow: "0 4px 16px -12px rgba(120,90,60,.5)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div
                  style={{
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
                  }}
                >
                  {(post.title?.[0] ?? "?").toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...fredoka, fontWeight: 600, fontSize: 16.5, color: "#3F362E" }}>
                    {post.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#A89A8B" }}>
                    {new Date(post.created_at).toLocaleDateString("es-AR")}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 15.5, lineHeight: 1.55, color: "#4A4038", margin: 0 }}>
                {post.body}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
