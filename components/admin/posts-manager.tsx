"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDate, getDifficultyLabel } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  difficulty: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  categories: { name: string; icon: string | null } | null;
}

interface PostsManagerProps {
  initialPosts: Post[];
  categories: Category[];
}

export function PostsManager({ initialPosts, categories }: PostsManagerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const supabase = createClient();

  const filteredPosts = posts.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" || p.status === filterStatus;
    const matchCategory =
      filterCategory === "all" ||
      (p.categories && (p.categories as { name: string }).name ===
        categories.find((c) => c.id === filterCategory)?.name);
    return matchSearch && matchStatus && matchCategory;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这篇文章吗？此操作不可撤销。")) return;
    try {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "文章已删除" });
      router.refresh();
    } catch (err) {
      toast({
        title: "删除失败",
        description: err instanceof Error ? err.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "published": return <Badge variant="brand" className="text-xs">已发布</Badge>;
      case "draft": return <Badge variant="secondary" className="text-xs">草稿</Badge>;
      case "archived": return <Badge variant="outline" className="text-xs">归档</Badge>;
      default: return null;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Button variant="brand" size="sm" asChild>
          <Link href="/admin/posts/new">
            <Plus className="h-4 w-4 mr-1.5" />
            新建文章
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索文章标题..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="published">已发布</SelectItem>
            <SelectItem value="draft">草稿</SelectItem>
            <SelectItem value="archived">归档</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="栏目" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部栏目</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground mb-3">
        共 {filteredPosts.length} 篇文章
      </p>

      <Card>
        <CardContent className="p-0">
          {filteredPosts.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground text-sm">
              暂无文章
            </p>
          ) : (
            <div className="divide-y">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm truncate max-w-[300px]">
                        {post.title}
                      </span>
                      {statusBadge(post.status)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {post.categories && (
                        <span>
                          {post.categories.icon} {post.categories.name}
                        </span>
                      )}
                      <span>{getDifficultyLabel(post.difficulty)}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.view_count}
                      </span>
                      <span>{formatDate(post.updated_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {post.status === "published" && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                        <Link href={`/post/${post.slug}`} target="_blank">
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                      <Link href={`/admin/posts/${post.id}`}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:text-destructive"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
