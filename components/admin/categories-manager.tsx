"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";

interface CategoriesManagerProps {
  initialCategories: Category[];
}

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  icon: "📚",
  sort_order: 0,
};

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const supabase = createClient();

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      icon: cat.icon || "📚",
      sort_order: cat.sort_order,
    });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: editingId ? prev.slug : slugify(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from("categories")
          .update(form)
          .eq("id", editingId);
        if (error) throw error;
        setCategories((prev) =>
          prev.map((c) => (c.id === editingId ? { ...c, ...form } : c))
        );
        toast({ title: "更新成功" });
      } else {
        const { data, error } = await supabase
          .from("categories")
          .insert(form)
          .select()
          .single();
        if (error) throw error;
        setCategories((prev) => [...prev, data]);
        toast({ title: "创建成功" });
      }
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      router.refresh();
    } catch (err) {
      toast({
        title: "操作失败",
        description: err instanceof Error ? err.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除该栏目吗？该栏目下的文章将不再有栏目分类。")) return;
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "删除成功" });
      router.refresh();
    } catch (err) {
      toast({
        title: "删除失败",
        description: err instanceof Error ? err.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">栏目管理</h1>
        <Button variant="brand" size="sm" onClick={handleNew}>
          <Plus className="h-4 w-4 mr-1.5" />
          新建栏目
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="mb-6 border-brand-200">
          <CardHeader>
            <CardTitle className="text-base">
              {editingId ? "编辑栏目" : "新建栏目"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">栏目名称 *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="例如：单证与付款"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug（URL路径）*</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="documents-payment"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">图标（Emoji）</Label>
                <Input
                  id="icon"
                  value={form.icon}
                  onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                  placeholder="📚"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">排序权重</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="栏目简介..."
                  rows={2}
                />
              </div>
              <div className="sm:col-span-2 flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  取消
                </Button>
                <Button type="submit" variant="brand" disabled={loading}>
                  {loading ? "保存中..." : editingId ? "更新栏目" : "创建栏目"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <Card>
        <CardContent className="p-0">
          {categories.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground text-sm">
              暂无栏目，点击右上角"新建栏目"开始
            </p>
          ) : (
            <div className="divide-y">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab flex-shrink-0" />
                  <span className="text-xl flex-shrink-0">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{cat.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      /{cat.slug} · {cat.description || "暂无描述"}
                    </div>
                  </div>
                  <Badge variant={cat.is_active ? "brand" : "secondary"} className="text-xs flex-shrink-0">
                    {cat.is_active ? "启用" : "禁用"}
                  </Badge>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEdit(cat)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:text-destructive"
                      onClick={() => handleDelete(cat.id)}
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
