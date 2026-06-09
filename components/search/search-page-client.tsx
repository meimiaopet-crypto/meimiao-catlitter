"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/posts/post-card";
import { Category } from "@/lib/database.types";

interface SearchPageClientProps {
  initialQuery: string;
  initialPosts: unknown[];
  categories: Category[];
}

export function SearchPageClient({
  initialQuery,
  initialPosts,
  categories,
}: SearchPageClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router]
  );

  const posts = initialPosts as Array<{
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

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">搜索知识文章</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索文章标题、内容、标签..."
            className="pl-9 h-12"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <Button type="submit" variant="brand" size="lg" className="h-12">
          搜索
        </Button>
      </form>

      {/* Popular searches */}
      {!initialQuery && (
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-3">热门搜索：</p>
          <div className="flex flex-wrap gap-2">
            {["信用证", "FOB", "豆腐猫砂", "膨润土", "HS编码", "TT付款", "海运", "阿里国际站"].map(
              (term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
                >
                  {term}
                </Button>
              )
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {initialQuery && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            关键词 "<strong className="text-foreground">{initialQuery}</strong>" 共找到{" "}
            <strong className="text-foreground">{posts.length}</strong> 篇文章
          </p>

          {posts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">未找到相关文章</p>
              <p className="text-sm">请尝试其他关键词，或浏览下方栏目</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Browse by category */}
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-lg font-semibold mb-4">按栏目浏览</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="flex items-center gap-2 p-3 rounded-lg border hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-colors text-sm"
            >
              <span>{cat.icon}</span>
              <span className="truncate">{cat.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
