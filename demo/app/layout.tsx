import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "华图成长罗盘｜AI 大学生成长实验系统",
  description:
    "用 3 分钟看见成长起点，用每一次行动校准未来。体验证据画像、多路径推演、成长实验与动态校准。",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
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
