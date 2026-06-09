"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Save, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Category, Tag } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";

// Dynamic import for MD editor (client-only)
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

interface PostEditorProps {
  post: {
    id: string;
    title: string;
    slug: string;
    summary: string | null;
    content: string;
    cover_image: string | null;
    category_id: string | null;
    difficulty: string;
    status: string;
    read_time: number;
  } | null;
  categories: Category[];
  allTags: Tag[];
  selectedTagIds: string[];
  isNew: boolean;
}

export function PostEditor({
  post,
  categories,
  allTags,
  selectedTagIds: initialTagIds,
  isNew,
}: PostEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    summary: post?.summary || "",
    content: post?.content || "# 文章标题\n\n在这里写你的文章内容...\n\n## 章节一\n\n正文内容...",
    cover_image: post?.cover_image || "",
    category_id: post?.category_id || "",
    difficulty: post?.difficulty || "beginner",
    status: post?.status || "draft",
    read_time: post?.read_time || 5,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTagIds);
  const [saving, setSaving] = useState(false);

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: isNew && !prev.slug ? slugify(title) : prev.slug,
    }));
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSave = useCallback(
    async (saveStatus?: string) => {
      setSaving(true);
      const statusToSave = saveStatus || form.status;
      const dataToSave = {
        ...form,
        status: statusToSave,
        published_at:
          statusToSave === "published" && (!post?.status || post.status !== "published")
            ? new Date().toISOString()
            : undefined,
      };

      try {
        let postId = post?.id;

        if (isNew) {
          const { data, error } = await supabase
            .from("posts")
            .insert(dataToSave)
            .select("id")
            .single();
          if (error) throw error;
          postId = data.id;
        } else {
          const { error } = await supabase
            .from("posts")
            .update(dataToSave)
            .eq("id", post!.id);
          if (error) throw error;
        }

        // Sync tags
        if (postId) {
          await supabase.from("post_tags").delete().eq("post_id", postId);
          if (selectedTags.length > 0) {
            await supabase.from("post_tags").insert(
              selectedTags.map((tagId) => ({ post_id: postId!, tag_id: tagId }))
            );
          }
        }

        toast({
          title: isNew ? "文章已创建" : "文章已更新",
          description: statusToSave === "published" ? "文章已发布到前台" : "已保存为草稿",
        });

        if (isNew && postId) {
          router.push(`/admin/posts/${postId}`);
        }
        router.refresh();
      } catch (err) {
        toast({
          title: "保存失败",
          description: err instanceof Error ? err.message : "未知错误",
          variant: "destructive",
        });
      } finally {
        setSaving(false);
      }
    },
    [form, post, isNew, selectedTags, supabase, toast, router]
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/posts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold flex-1">
          {isNew ? "新建文章" : "编辑文章"}
        </h1>
        <div className="flex items-center gap-2">
          {form.status === "published" && !isNew && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/post/${form.slug}`} target="_blank">
                <Eye className="h-4 w-4 mr-1.5" />
                预览
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave("draft")}
            disabled={saving}
          >
            存草稿
          </Button>
          <Button
            variant="brand"
            size="sm"
            onClick={() => handleSave("published")}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-1.5" />
            {saving ? "保存中..." : "发布"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">文章标题 *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="输入文章标题..."
              className="text-base font-semibold"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="article-url-slug"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">文章摘要</Label>
            <Textarea
              id="summary"
              value={form.summary}
              onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
              placeholder="一两句话概括文章内容，用于卡片展示和SEO..."
              rows={2}
            />
          </div>

          {/* Markdown Editor */}
          <div className="space-y-2">
            <Label>正文内容（Markdown）</Label>
            <div data-color-mode="light" className="border rounded-lg overflow-hidden">
              <MDEditor
                value={form.content}
                onChange={(val) => setForm((p) => ({ ...p, content: val || "" }))}
                height={500}
                preview="live"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-4">
          {/* Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">发布设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>状态</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                    <SelectItem value="archived">归档</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>难度级别</Label>
                <Select
                  value={form.difficulty}
                  onValueChange={(v) => setForm((p) => ({ ...p, difficulty: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">入门</SelectItem>
                    <SelectItem value="intermediate">进阶</SelectItem>
                    <SelectItem value="advanced">高级</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>预计阅读时间（分钟）</Label>
                <Input
                  type="number"
                  value={form.read_time}
                  onChange={(e) => setForm((p) => ({ ...p, read_time: Number(e.target.value) }))}
                  min={1}
                  max={60}
                />
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">所属栏目</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={form.category_id}
                onValueChange={(v) => setForm((p) => ({ ...p, category_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择栏目" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">封面图片</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={form.cover_image}
                onChange={(e) => setForm((p) => ({ ...p, cover_image: e.target.value }))}
                placeholder="输入图片URL..."
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                可使用 Supabase Storage 上传图片后粘贴URL
              </p>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">标签</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      selectedTags.includes(tag.id)
                        ? "bg-brand-100 border-brand-400 text-brand-700 dark:bg-brand-900/40"
                        : "bg-background border-border text-muted-foreground hover:border-brand-300"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
              {allTags.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  先在标签管理页面创建标签
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
