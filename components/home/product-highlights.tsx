import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRODUCTS = [
  {
    emoji: "🌿",
    name: "Tofu Cat Litter",
    chName: "豆腐猫砂",
    desc: "天然豌豆纤维制成，可溶于水冲厕，零粉尘，轻量型，是宠物友好型明星产品",
    features: ["可冲马桶", "超低粉尘", "植物天然", "OEM定制"],
    color: "from-green-500 to-emerald-600",
    bg: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
  },
  {
    emoji: "🪨",
    name: "Bentonite Cat Litter",
    chName: "膨润土猫砂",
    desc: "钠基膨润土，强力结团，快速锁臭，是全球外贸出口量最大的猫砂品类",
    features: ["快速结团", "持续锁臭", "高吸水率", "经济实惠"],
    color: "from-amber-500 to-yellow-600",
    bg: "from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20",
  },
  {
    emoji: "⚫",
    name: "Activated Carbon",
    chName: "活性炭猫砂",
    desc: "椰壳活性炭添加，深度除臭，高端消费者首选，适合中高端市场定位",
    features: ["深度除臭", "抗菌防霉", "高端定位", "混合配方"],
    color: "from-gray-600 to-slate-700",
    bg: "from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20",
  },
  {
    emoji: "📄",
    name: "Paper Cat Litter",
    chName: "纸猫砂",
    desc: "再生纸浆制成，极度轻盈，适合幼猫术后护理，欧洲宠物市场热销品",
    features: ["超轻量", "防过敏", "可堆肥", "兽医推荐"],
    color: "from-blue-500 to-cyan-600",
    bg: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
  },
  {
    emoji: "🌲",
    name: "Pine Pellet Litter",
    chName: "松木猫砂",
    desc: "天然松木颗粒，自然清香，高吸水性，北美及欧洲市场增长最快品类之一",
    features: ["天然松香", "高吸水", "可堆肥", "环保认证"],
    color: "from-teal-500 to-green-600",
    bg: "from-teal-50 to-green-50 dark:from-teal-950/20 dark:to-green-950/20",
  },
];

export function ProductHighlights() {
  return (
    <section className="py-16 border-t">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">核心产品线</h2>
          <p className="text-muted-foreground">
            深入了解5大猫砂产品，掌握出口卖点与竞争优势
          </p>
        </div>
        <Button variant="ghost" asChild className="text-brand-600 hover:text-brand-700">
          <Link href="/category/product-knowledge">
            全部产品知识 <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {PRODUCTS.map((product) => (
          <div
            key={product.name}
            className={`flex flex-col rounded-xl bg-gradient-to-br ${product.bg} border p-5 hover:shadow-md transition-all`}
          >
            <div className="text-4xl mb-3">{product.emoji}</div>
            <h3 className="font-bold text-sm mb-0.5">{product.chName}</h3>
            <p className="text-xs text-brand-600 font-medium mb-2">{product.name}</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">
              {product.desc}
            </p>
            <ul className="space-y-1">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-xs">
                  <CheckCircle className="h-3 w-3 text-brand-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/category/product-knowledge`}
              className="mt-4 text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
            >
              了解更多 <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
