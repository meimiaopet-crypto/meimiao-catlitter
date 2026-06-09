"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";

interface TagsManagerProps {
  initialTags: Tag[];
}

export function TagsManager({ initialTags }: TagsManagerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [tags, setTags] = useState(initialTags);
  const [form, setForm] = useState({ name: "", slug: "", color: "#16a34a" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const supabase = createClient();

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: editingId ? prev.slug : slugify(name),
    }));
  };

  const handleEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setForm({ name: tag.name, slug: tag.slug, color: tag.color });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from("tags")
          .update(form)
          .eq("id", editingId);
        if (error) throw error;
        setTags((prev) =>
          prev.map((t) => (t.id === editingId ? { ...t, ...form } : t))
        );
        toast({ title: "标签已更新" });
      } else {
        const { data, error } = await supabase
          .from("tags")
          .insert(form)
          .select()
          .single();
        if (error) throw error;
        setTags((prev) => [...prev, data]);
        toast({ title: "标签已创建" });
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ name: "", slug: "", color: "#16a34a" });
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
    if (!confirm("确定删除该标签吗？")) return;
    try {
      const { error } = await supabase.from("tags").delete().eq("id", id);
      if (error) throw error;
      setTags((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "标签已删除" });
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
        <h1 className="text-2xl font-bold">标签管理</h1>
        <Button
          variant="brand"
          size="sm"
          onClick={() => {
            setEditingId(null);
            setForm({ name: "", slug: "", color: "#16a34a" });
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          新建标签
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 border-brand-200">
          <CardHeader>
            <CardTitle className="text-sm">
              {editingId ? "编辑标签" : "新建标签"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>标签名称 *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="信用证"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="letter-of-credit"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>颜色</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                    className="h-9 w-14 rounded border cursor-pointer"
                  />
                  <Input
                    value={form.color}
                    onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="sm:col-span-3 flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  取消
                </Button>
                <Button type="submit" variant="brand" disabled={loading}>
                  {loading ? "保存中..." : editingId ? "更新" : "创建"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {tags.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground text-sm">暂无标签</p>
          ) : (
            <div className="divide-y">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30"
                >
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{tag.name}</span>
                      <Badge variant="outline" className="text-xs">
                        /{tag.slug}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEdit(tag)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:text-destructive"
                      onClick={() => handleDelete(tag.id)}
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
