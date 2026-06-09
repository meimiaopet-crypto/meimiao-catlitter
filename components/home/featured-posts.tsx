import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDifficultyLabel, getDifficultyColor, formatDate } from "@/lib/utils";

interface FeaturedPostsProps {
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    summary: string | null;
    cover_image: string | null;
    difficulty: string;
    read_time: number;
    view_count: number;
    published_at: string | null;
    categories: { name: string; slug: string; icon: string | null; color: string } | null;
    post_tags: Array<{ tags: { name: string; slug: string; color: string } }>;
  }>;
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  if (!posts.length) return null;

  return (
    <section className="py-16 border-t">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">最新知识</h2>
          <p className="text-muted-foreground">最近更新的外贸实战文章</p>
        </div>
        <Button variant="ghost" asChild className="text-brand-600 hover:text-brand-700">
          <Link href="/search">
            查看全部 <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col rounded-xl border bg-card hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Cover Image */}
            <div className="relative h-44 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/30 dark:to-brand-800/30 overflow-hidden">
              {post.cover_image ? (
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-5xl opacity-60">
                    {post.categories?.icon || "📄"}
                  </span>
                </div>
              )}
              {/* Category badge */}
              {post.categories && (
                <div className="absolute top-3 left-3">
                  <Link
                    href={`/category/${post.categories.slug}`}
                    className="inline-flex items-center gap-1 bg-white/90 dark:bg-black/60 text-xs px-2.5 py-1 rounded-full font-medium hover:bg-white"
                  >
                    <span>{post.categories.icon}</span>
                    {post.categories.name}
                  </Link>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5">
              {/* Difficulty */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(post.difficulty)}`}>
                  {getDifficultyLabel(post.difficulty)}
                </span>
                {post.published_at && (
                  <span className="text-xs text-muted-foreground">
                    {formatDate(post.published_at)}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                <Link href={`/post/${post.slug}`}>{post.title}</Link>
              </h3>

              {/* Summary */}
              {post.summary && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
                  {post.summary}
                </p>
              )}

              {/* Tags */}
              {post.post_tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.post_tags.slice(0, 3).map(({ tags }) => (
                    <Badge key={tags.slug} variant="brand" className="text-xs py-0">
                      {tags.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.read_time} 分钟
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.view_count.toLocaleString()}
                  </span>
                </div>
                <Link
                  href={`/post/${post.slug}`}
                  className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                >
                  阅读 <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
