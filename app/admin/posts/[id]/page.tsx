import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostEditor } from "@/components/admin/post-editor";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const isNew = id === "new";

  const [{ data: post }, { data: categories }, { data: tags }, { data: postTags }] = await Promise.all([
    isNew
      ? Promise.resolve({ data: null })
      : supabase.from("posts").select("*").eq("id", id).single(),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("tags").select("*").order("name"),
    isNew
      ? Promise.resolve({ data: [] })
      : supabase.from("post_tags").select("tag_id").eq("post_id", id),
  ]);

  if (!isNew && !post) notFound();

  const selectedTagIds = (postTags || []).map((pt: { tag_id: string }) => pt.tag_id);

  return (
    <AdminShell>
      <PostEditor
        post={post}
        categories={categories || []}
        allTags={tags || []}
        selectedTagIds={selectedTagIds}
        isNew={isNew}
      />
    </AdminShell>
  );
}
