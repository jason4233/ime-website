import type { Metadata } from "next";
import { ProductsPageClient } from "./ProductsPageClient";

export const metadata: Metadata = {
  title: "核心技術 — 外泌體凍晶 USC-E / SiUPi POWDER｜I ME",
  description:
    "星誠細胞生醫 × 博訊生技 CDMO 3A-GTP 全自動化製程。USC-E / SiUPi POWDER / 修秘凍晶：每 1mL 含 2,000 億顆外泌體，粒徑 76.8–99.4 nm，表達 CD9、CD63 標誌物。INCI Mono ID 40148、TFDA 008446、中韓發明專利。台中榮總楊孟寅醫師專利技術轉移。",
  keywords: [
    "USC-E", "USC-D", "SiUPi POWDER", "修秘晶露", "修秘凍晶",
    "外泌體凍晶", "外泌體原液", "外泌體精華", "外泌體安瓶",
    "2000 億顆外泌體", "76.8nm", "99.4nm", "CD9", "CD63",
    "INCI Mono ID 40148", "TFDA 008446", "衛部醫器製字",
    "星誠細胞生醫", "StellarCell Bio", "博訊生技", "Dr.SIGNAL",
    "3A-GTP", "CDMO", "臍帶間質幹細胞", "UC-MSC",
    "台中榮總", "楊孟寅醫師", "外泌體專利",
  ],
  alternates: { canonical: "https://ime-beauty.com/products" },
  openGraph: {
    title: "核心技術 — 外泌體凍晶 USC-E | I ME",
    description: "每 1mL 2,000 億顆外泌體。INCI、TFDA、中韓專利認證。台中榮總楊孟寅醫師專利技術。",
    url: "https://ime-beauty.com/products",
    images: ["/images/42706_0.jpg"],
  },
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}
