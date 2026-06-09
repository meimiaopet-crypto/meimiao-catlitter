"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Category } from "@/lib/database.types";
import { cn } from "@/lib/utils";

interface CategorySidebarProps {
  categories: Category[];
  currentSlug: string;
}

export function CategorySidebar({ categories, currentSlug }: CategorySidebarProps) {
  return (
    <div className="sticky top-24">
      <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3 px-2">
        全部栏目
      </h3>
      <nav className="space-y-0.5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className={cn(
              "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors",
              cat.slug === currentSlug
                ? "bg-brand-100 text-brand-700 font-medium dark:bg-brand-900/40 dark:text-brand-300"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <span className="text-base">{cat.icon}</span>
            <span className="flex-1">{cat.name}</span>
            {cat.slug === currentSlug && (
              <ChevronRight className="h-3.5 w-3.5 text-brand-500" />
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
