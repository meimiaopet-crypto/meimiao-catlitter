import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";
import { TagsManager } from "@/components/admin/tags-manager";

export default async function AdminTagsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: tags } = await supabase
    .from("tags")
    .select("*")
    .order("name");

  return (
    <AdminShell>
      <TagsManager initialTags={tags || []} />
    </AdminShell>
  );
}
