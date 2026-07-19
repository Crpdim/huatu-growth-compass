import type { Metadata } from "next";
import { ProductManualPage } from "../components/product-manual-page";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "产品使用手册｜职途有声",
  description: "了解职途有声从成长规划、任务管理到多 Agent 协作的完整产品功能。",
};

export default function ManualPage() {
  return <ProductManualPage basePath={basePath} />;
}
