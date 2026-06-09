import Link from "next/link";
import { BookOpen, Mail, Globe } from "lucide-react";

const FOOTER_LINKS = {
  "产品知识": [
    { href: "/category/product-knowledge", label: "猫砂产品大全" },
    { href: "/category/trade-terms", label: "外贸术语英语" },
    { href: "/category/documents-payment", label: "单证与付款" },
    { href: "/category/logistics", label: "国际物流" },
  ],
  "合规与风控": [
    { href: "/category/compliance", label: "海关合规认证" },
    { href: "/category/contracts-risk", label: "合同风险控制" },
    { href: "/category/marketing", label: "外贸营销" },
    { href: "/category/platform-ops", label: "平台运营" },
  ],
  "资源": [
    { href: "/category/tools-templates", label: "工具与模板" },
    { href: "/category/case-studies", label: "案例分析" },
    { href: "/search", label: "全站搜索" },
    { href: "/about", label: "关于我们" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40 mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
                <BookOpen className="h-3.5 w-3.5" />
              </div>
              <span className="text-brand-700 dark:text-brand-400">CatLitter Academy</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              专业的猫砂外贸知识库，帮助您掌握从产品到合规的全链路外贸技能。
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>info@catlitteracademy.com</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>www.catlitteracademy.com</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-3 text-sm">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-brand-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© 2024 CatLitter Trade Academy. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-brand-600 transition-colors">
              管理后台
            </Link>
            <Link href="/sitemap.xml" className="hover:text-brand-600 transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
