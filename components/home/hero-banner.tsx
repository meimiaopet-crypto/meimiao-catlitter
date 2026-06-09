"use client";

import Link from "next/link";
import { Search, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroBanner() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="hero-gradient py-20 md:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-300/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          {/* Tag */}
          <div className="inline-flex items-center gap-1.5 bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
            <Star className="h-3.5 w-3.5 fill-current" />
            专业外贸知识库 · 猫砂行业首选
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            掌握猫砂外贸
            <span className="text-brand-600 dark:text-brand-400 block mt-2">
              从产品到出口，一站通
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            从豆腐猫砂产品知识到信用证单证审核，从海关合规到阿里国际站运营——
            覆盖猫砂B2B外贸全链路的专业知识库。
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索知识文章，如：信用证、FOB、豆腐猫砂..."
                className="pl-9 h-12 bg-white dark:bg-background"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" variant="brand" size="lg" className="h-12">
              搜索
            </Button>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="brand" size="xl" asChild>
              <Link href="/category/documents-payment">
                开始学习单证付款
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button variant="brand-outline" size="xl" asChild>
              <Link href="/category/product-knowledge">
                产品知识大全
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-brand-200 dark:border-brand-800/50">
            {[
              { value: "10+", label: "专业栏目" },
              { value: "100+", label: "知识文章" },
              { value: "5", label: "猫砂产品线" },
              { value: "免费", label: "完全开放" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-brand-700 dark:text-brand-400">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
