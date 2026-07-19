import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const metadataBase = process.env.GITHUB_ACTIONS === "true"
  ? new URL("https://crpdim.github.io/")
  : new URL("http://localhost:3000");

export const metadata: Metadata = {
  metadataBase,
  title: "华图成长罗盘｜先体验未来，再规划人生",
  description:
    "在模拟人生中体验一种未来，再由 AI 把选择、画像和真实行动连接成你的成长路径。",
  icons: {
    icon: `${basePath}/logo.png`,
    shortcut: `${basePath}/logo.png`,
    apple: `${basePath}/logo.png`,
  },
  openGraph: {
    title: "先看见一种未来｜华图成长罗盘",
    description: "进入模拟人生，体验选择如何变成一条可以行动的成长路径。",
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
    title: "先看见一种未来｜华图成长罗盘",
    description: "进入模拟人生，体验选择如何变成一条可以行动的成长路径。",
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
