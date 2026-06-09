import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [
    { count: totalPosts },
    { count: publishedPosts },
    { count: totalCategories },
    { data: recentPosts },
  ] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("id, title, slug, status, created_at, view_count, categories(name)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <AdminShell>
      <AdminDashboard
        stats={{ totalPosts: totalPosts || 0, publishedPosts: publishedPosts || 0, totalCategories: totalCategories || 0 }}
        recentPosts={recentPosts || []}
      />
    </AdminShell>
  );
}
