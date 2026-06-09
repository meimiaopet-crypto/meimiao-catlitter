import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate, getDifficultyLabel, getDifficultyColor } from "@/lib/utils";
import { Clock, Eye, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { MarkdownContent } from "@/components/posts/markdown-content";
import { ViewTracker } from "@/components/posts/view-tracker";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, summary, cover_image, categories(name)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) return { title: "文章不存在" };

  return {
    title: post.title,
    description: post.summary || undefined,
    openGraph: {
      title: post.title,
      description: post.summary || undefined,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select(`
      *,
      categories(id, name, slug, icon),
      post_tags(tags(id, name, slug, color))
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  // Get prev/next posts in the same category
  const category = post.categories as { id: string; name: string; slug: string; icon: string } | null;

  const [{ data: prevPost }, { data: nextPost }] = await Promise.all([
    category
      ? supabase
          .from("posts")
          .select("id, title, slug")
          .eq("status", "published")
          .eq("category_id", category.id)
          .lt("published_at", post.published_at || new Date().toISOString())
          .order("published_at", { ascending: false })
          .limit(1)
          .single()
      : Promise.resolve({ data: null }),
    category
      ? supabase
          .from("posts")
          .select("id, title, slug")
          .eq("status", "published")
          .eq("category_id", category.id)
          .gt("published_at", post.published_at || "")
          .order("published_at", { ascending: true })
          .limit(1)
          .single()
      : Promise.resolve({ data: null }),
  ]);

  const tags = (post.post_tags as Array<{ tags: { id: string; name: string; slug: string; color: string } }>);

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <ViewTracker slug={slug} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">首页</Link>
        <span>/</span>
        {category && (
          <>
            <Link
              href={`/category/${category.slug}`}
              className="hover:text-foreground flex items-center gap-1"
            >
              <span>{category.icon}</span>
              {category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getDifficultyColor(post.difficulty)}`}>
            {getDifficultyLabel(post.difficulty)}
          </span>
          {tags.map(({ tags: tag }) => (
            <Badge key={tag.id} variant="brand" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
          {post.title}
        </h1>

        {post.summary && (
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            {post.summary}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            {getDifficultyLabel(post.difficulty)}级别
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            预计阅读 {post.read_time} 分钟
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            {post.view_count.toLocaleString()} 次阅读
          </span>
          {post.published_at && (
            <span>发布于 {formatDate(post.published_at)}</span>
          )}
        </div>
      </header>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <Separator className="mb-8" />

      {/* Article Content */}
      <div className="prose-content">
        <MarkdownContent content={post.content} />
      </div>

      <Separator className="my-8" />

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-sm font-medium">标签：</span>
          {tags.map(({ tags: tag }) => (
            <Badge key={tag.id} variant="outline" className="text-sm">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Prev / Next Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        {prevPost && (
          <Link
            href={`/post/${prevPost.slug}`}
            className="flex items-start gap-3 p-4 rounded-xl border hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground group-hover:text-brand-600" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground mb-1">上一篇</div>
              <div className="text-sm font-medium line-clamp-2 group-hover:text-brand-600">
                {prevPost.title}
              </div>
            </div>
          </Link>
        )}
        {nextPost && (
          <Link
            href={`/post/${nextPost.slug}`}
            className="flex items-start gap-3 p-4 rounded-xl border hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-colors group sm:ml-auto sm:text-right"
          >
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground mb-1">下一篇</div>
              <div className="text-sm font-medium line-clamp-2 group-hover:text-brand-600">
                {nextPost.title}
              </div>
            </div>
            <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground group-hover:text-brand-600" />
          </Link>
        )}
      </div>

      {/* Back to Category */}
      {category && (
        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link href={`/category/${category.slug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回 {category.name}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
