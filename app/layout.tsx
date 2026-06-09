import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "CatLitter Trade Academy | 外贸猫砂学院",
    template: "%s | CatLitter Trade Academy",
  },
  description:
    "Professional knowledge base for cat litter foreign trade — from product expertise to customs compliance, your complete B2B trade toolkit.",
  keywords: [
    "cat litter",
    "tofu cat litter",
    "bentonite cat litter",
    "foreign trade",
    "B2B export",
    "猫砂出口",
    "外贸知识库",
    "信用证",
    "国际物流",
  ],
  authors: [{ name: "CatLitter Trade Academy" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "CatLitter Trade Academy",
    title: "CatLitter Trade Academy | 外贸猫砂学院",
    description:
      "Professional knowledge base for cat litter foreign trade. Master product knowledge, trade terms, logistics, and compliance.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CatLitter Trade Academy",
    description: "Your complete cat litter B2B trade knowledge hub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
