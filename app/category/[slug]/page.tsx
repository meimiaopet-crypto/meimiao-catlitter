import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CategorySidebar } from "@/components/category/category-sidebar";
import { PostCard } from "@/components/posts/post-card";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) return { title: "栏目不存在" };

  return {
    title: `${category.name} | CatLitter Trade Academy`,
    description: category.description || `${category.name}相关外贸知识文章`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: category }, { data: allCategories }, { data: posts }] =
    await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single(),
      supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("posts")
        .select(`
          id, title, slug, summary, cover_image, difficulty, read_time, view_count, published_at,
          categories(name, slug, icon, color),
          post_tags(tags(name, slug, color))
        `)
        .eq("status", "published")
        .eq("categories.slug", slug)
        .order("published_at", { ascending: false }),
    ]);

  if (!category) notFound();

  // Filter posts for this category
  const filteredPosts = (posts || []).filter(
    (p) => p.categories && (p.categories as { slug: string }).slug === slug
  );

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{category.icon}</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground mt-1">{category.description}</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          共 {filteredPosts.length} 篇文章
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <CategorySidebar
            categories={allCategories || []}
            currentSlug={slug}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <div className="text-5xl mb-4">{category.icon}</div>
              <p className="text-lg font-medium mb-2">暂无文章</p>
              <p className="text-sm">该栏目下的知识文章即将上线，敬请期待。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post as Parameters<typeof PostCard>[0]['post']} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
