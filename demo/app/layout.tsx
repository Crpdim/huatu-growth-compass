import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const metadataBase = process.env.GITHUB_ACTIONS === "true"
  ? new URL("https://crpdim.github.io/")
  : new URL("http://localhost:3000");

export const metadata: Metadata = {
  metadataBase,
  title: "华图成长罗盘｜AI 大学生成长实验系统",
  description:
    "从动态画像和多路径体验出发，用 AI 伴学、真实任务与周期复盘持续校准大学生成长计划。",
  icons: {
    icon: `${basePath}/logo.png`,
    shortcut: `${basePath}/logo.png`,
    apple: `${basePath}/logo.png`,
  },
  openGraph: {
    title: "你迷茫吗？｜华图成长罗盘",
    description: "先体验一种未来，再用真实行动和持续反馈校准成长计划。",
    type: "website",
    images: [{
      url: `${basePath}/og.png`,
      width: 1200,
      height: 630,
      alt: "华图成长罗盘：你迷茫吗？",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "你迷茫吗？｜华图成长罗盘",
    description: "先体验一种未来，再用真实行动和持续反馈校准成长计划。",
    images: [`${basePath}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
