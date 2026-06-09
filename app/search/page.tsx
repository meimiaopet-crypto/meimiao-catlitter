import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SearchPageClient } from "@/components/search/search-page-client";

export const metadata: Metadata = {
  title: "搜索知识文章",
  description: "搜索猫砂外贸知识库中的文章",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: query } = await searchParams;
  const supabase = await createClient();

  let posts: unknown[] = [];

  if (query) {
    const { data } = await supabase
      .from("posts")
      .select(`
        id, title, slug, summary, cover_image, difficulty, read_time, view_count, published_at,
        categories(name, slug, icon, color),
        post_tags(tags(name, slug, color))
      `)
      .eq("status", "published")
      .textSearch("search_vector", query, { type: "plain" })
      .order("view_count", { ascending: false })
      .limit(20);
    posts = data || [];
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  return (
    <SearchPageClient
      initialQuery={query || ""}
      initialPosts={posts}
      categories={categories || []}
    />
  );
}
