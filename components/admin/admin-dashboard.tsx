"use client";

import Link from "next/link";
import { FileText, FolderOpen, Eye, TrendingUp, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface AdminDashboardProps {
  stats: {
    totalPosts: number;
    publishedPosts: number;
    totalCategories: number;
  };
  recentPosts: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    created_at: string;
    view_count: number;
    categories: { name: string } | null;
  }>;
}

export function AdminDashboard({ stats, recentPosts }: AdminDashboardProps) {
  const draftPosts = stats.totalPosts - stats.publishedPosts;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">仪表盘</h1>
        <Button variant="brand" asChild size="sm">
          <Link href="/admin/posts/new">
            <Plus className="h-4 w-4 mr-1.5" />
            新建文章
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              文章总数
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              已发布 {stats.publishedPosts} 篇
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              已发布
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-600">{stats.publishedPosts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              草稿 {draftPosts} 篇
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              知识栏目
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground mt-1">活跃栏目</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              总阅读量
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {recentPosts
                .reduce((sum, p) => sum + (p.view_count || 0), 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">来自最近5篇</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">最近文章</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/posts">查看全部</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              暂无文章，
              <Link href="/admin/posts/new" className="text-brand-600 hover:underline">
                立即创建第一篇
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start justify-between gap-3 py-2 border-b last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-sm font-medium hover:text-brand-600 line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      {post.categories && (
                        <span className="text-xs text-muted-foreground">
                          {post.categories.name}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(post.created_at)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {post.view_count}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={post.status === "published" ? "brand" : "secondary"}
                    className="flex-shrink-0 text-xs"
                  >
                    {post.status === "published" ? "已发布" : post.status === "draft" ? "草稿" : "归档"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
