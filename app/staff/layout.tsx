import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";
import type { SidebarRole } from "@/components/layout/Sidebar";

function userRoleLabel(role: string): string {
  if (role === "admin") return "Admin";
  if (role === "parent") return "Familia";
  return "Maestra";
}

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient(await cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, avatar_url, role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role;

  if (role !== "admin" && role !== "staff") {
    redirect("/family");
  }

  const sidebarUser = profile
    ? {
        fullName: profile.full_name,
        avatarUrl: profile.avatar_url,
        initial: (profile.full_name?.[0] ?? "?").toUpperCase(),
        roleLabel: `${userRoleLabel(profile.role)} · Soles`,
      }
    : null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F6ECDF" }}>
      <Sidebar active="feed" role={role as SidebarRole} user={sidebarUser} />
      <main style={{ flex: 1, minWidth: 0, height: "100vh", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
