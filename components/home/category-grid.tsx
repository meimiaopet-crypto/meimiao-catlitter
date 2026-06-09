import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Category } from "@/lib/database.types";

interface CategoryGridProps {
  categories: (Category & { post_count?: { count: number }[] })[];
}

const CATEGORY_BG_GRADIENTS = [
  "from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/30",
  "from-blue-50 to-sky-100 dark:from-blue-950/30 dark:to-sky-900/30",
  "from-amber-50 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-900/30",
  "from-teal-50 to-cyan-100 dark:from-teal-950/30 dark:to-cyan-900/30",
  "from-rose-50 to-pink-100 dark:from-rose-950/30 dark:to-pink-900/30",
  "from-violet-50 to-purple-100 dark:from-violet-950/30 dark:to-purple-900/30",
  "from-orange-50 to-amber-100 dark:from-orange-950/30 dark:to-amber-900/30",
  "from-indigo-50 to-blue-100 dark:from-indigo-950/30 dark:to-blue-900/30",
  "from-fuchsia-50 to-pink-100 dark:from-fuchsia-950/30 dark:to-pink-900/30",
  "from-lime-50 to-green-100 dark:from-lime-950/30 dark:to-green-900/30",
];

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            知识栏目
          </h2>
          <p className="text-muted-foreground">
            涵盖猫砂外贸全链路的10大专业栏目
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category, index) => {
          const postCount =
            Array.isArray(category.post_count) && category.post_count[0]
              ? (category.post_count[0] as { count: number }).count
              : 0;

          return (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className={`group relative flex flex-col p-5 rounded-xl bg-gradient-to-br ${CATEGORY_BG_GRADIENTS[index % CATEGORY_BG_GRADIENTS.length]} border border-transparent hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all duration-200`}
            >
              <div className="text-3xl mb-3">{category.icon || "📚"}</div>
              <h3 className="font-semibold text-sm leading-tight mb-1">
                {category.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
                {category.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {postCount} 篇
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
