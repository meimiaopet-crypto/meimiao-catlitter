import { Metadata } from "next";
import { CheckCircle, Globe, Package, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "关于我们",
  description: "了解 CatLitter Trade Academy 的使命与愿景",
};

const FEATURES = [
  {
    icon: "🐱",
    title: "专注猫砂品类",
    desc: "深耕猫砂行业10年，深度覆盖豆腐、膨润土、活性炭、纸猫砂、松木5大品类",
  },
  {
    icon: "📚",
    title: "全链路知识体系",
    desc: "从产品知识到信用证、从海关合规到平台运营，覆盖外贸全流程100+知识点",
  },
  {
    icon: "🌍",
    title: "面向全球买家",
    desc: "专为对接欧洲、北美、东南亚批量采购商的B2B外贸团队打造",
  },
  {
    icon: "🆓",
    title: "完全免费开放",
    desc: "所有知识文章永久免费，支持所有中国猫砂出口企业提升专业能力",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-4xl mb-6">
          🐾
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          关于 CatLitter Trade Academy
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          我们是专注于猫砂行业B2B外贸的专业知识库，致力于帮助中国猫砂出口企业
          掌握从产品到合规的全链路外贸技能，赢得更多全球优质客户。
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="flex gap-4 p-6 rounded-xl border bg-card hover:shadow-sm transition-shadow"
          >
            <div className="text-3xl flex-shrink-0">{f.icon}</div>
            <div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Products */}
      <div className="bg-gradient-to-br from-brand-50 to-emerald-50 dark:from-brand-950/20 dark:to-emerald-950/20 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Package className="h-6 w-6 text-brand-600" />
          我们的产品线
        </h2>
        <p className="text-muted-foreground mb-6">
          完整覆盖国际市场主流猫砂品类，支持OEM/ODM定制
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "豆腐猫砂", en: "Tofu Cat Litter", emoji: "🌿" },
            { name: "膨润土猫砂", en: "Bentonite Cat Litter", emoji: "🪨" },
            { name: "活性炭猫砂", en: "Activated Carbon Litter", emoji: "⚫" },
            { name: "纸猫砂", en: "Paper Cat Litter", emoji: "📄" },
            { name: "松木猫砂", en: "Pine Pellet Litter", emoji: "🌲" },
            { name: "宠物尿垫", en: "Pet Urine Pads", emoji: "🧻" },
          ].map((p) => (
            <div key={p.name} className="flex items-center gap-3 bg-white dark:bg-black/20 rounded-lg p-3">
              <span className="text-2xl">{p.emoji}</span>
              <div>
                <div className="font-medium text-sm">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.en}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Award className="h-6 w-6 text-brand-600" />
          质量认证体系
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["ISO 9001", "CE认证", "REACH合规", "FDA认证", "BRC标准", "MSDS安全", "SGS检测", "CITES合规"].map(
            (cert) => (
              <div
                key={cert}
                className="flex items-center gap-2 p-3 rounded-lg border text-sm font-medium"
              >
                <CheckCircle className="h-4 w-4 text-brand-500 flex-shrink-0" />
                {cert}
              </div>
            )
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="text-center p-8 rounded-2xl border bg-card">
        <h2 className="text-2xl font-bold mb-3 flex items-center justify-center gap-2">
          <Globe className="h-6 w-6 text-brand-600" />
          联系我们
        </h2>
        <p className="text-muted-foreground mb-4">
          如需产品咨询、OEM定制或外贸合作，欢迎联系我们
        </p>
        <div className="space-y-2 text-sm">
          <p>📧 Email: <a href="mailto:info@catlitteracademy.com" className="text-brand-600 hover:underline">info@catlitteracademy.com</a></p>
          <p>🌐 Website: <a href="https://www.catlitteracademy.com" className="text-brand-600 hover:underline">www.catlitteracademy.com</a></p>
          <p>📍 Location: Hebei Province, China — Cat Litter Production Base</p>
        </div>
      </div>
    </div>
  );
}
