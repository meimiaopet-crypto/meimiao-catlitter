import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostsManager } from "@/components/admin/posts-manager";

export default async function AdminPostsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ data: posts }, { data: categories }] = await Promise.all([
    supabase
      .from("posts")
      .select(`
        id, title, slug, status, difficulty, view_count, created_at, updated_at,
        categories(name, icon)
      `)
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  return (
    <AdminShell>
      <PostsManager
        initialPosts={posts || []}
        categories={categories || []}
      />
    </AdminShell>
  );
}
