import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { HeroBanner } from "@/components/home/hero-banner";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedPosts } from "@/components/home/featured-posts";
import { ProductHighlights } from "@/components/home/product-highlights";

export const metadata: Metadata = {
  title: "CatLitter Trade Academy | 外贸猫砂学院",
  description:
    "Professional knowledge base for cat litter B2B foreign trade. Master product knowledge, trade terms, logistics, and compliance.",
};

export const revalidate = 3600; // ISR: revalidate every hour

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: latestPosts }] = await Promise.all([
    supabase
      .from("categories")
      .select("*, post_count:posts(count)")
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
      .order("published_at", { ascending: false })
      .limit(6),
  ]);

  return (
    <div>
      <HeroBanner />
      <div className="container mx-auto px-4">
        <CategoryGrid categories={categories || []} />
        <FeaturedPosts posts={latestPosts || []} />
        <ProductHighlights />
      </div>
    </div>
  );
}
