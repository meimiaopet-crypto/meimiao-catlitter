import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-6">🐱</div>
        <h1 className="text-4xl font-bold mb-3">404</h1>
        <h2 className="text-xl font-semibold mb-3">页面不存在</h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          抱歉，您访问的页面不存在或已被删除。请检查URL或返回首页。
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="brand" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              返回首页
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/search">
              <Search className="h-4 w-4 mr-2" />
              搜索文章
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
