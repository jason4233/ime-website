import type { Metadata } from "next";
import { AboutPageClient } from "./AboutPageClient";

export const metadata: Metadata = {
  title: "品牌故事 — 由內而外的科技美學｜I ME 外泌體新美業品牌",
  description:
    "I ME 由周沫璃 Moli Chou 創立，融合 25 年中醫五行營養學底蘊與現代外泌體生技。攜手星誠細胞生醫、博訊生技 CDMO、台中榮總楊孟寅醫師專利技術，打造新美業革命品牌。",
  keywords: [
    "I ME 品牌故事", "周沫璃", "Moli Chou", "外泌體品牌", "新美業",
    "中醫五行美容", "外泌體美容", "I ME 創辦人", "星誠合作品牌",
  ],
  alternates: { canonical: "https://ime-beauty.com/about" },
  openGraph: {
    title: "品牌故事 — I ME 外泌體新美業品牌",
    description: "從中醫五行營養學到外泌體生技，I ME 用 25 年經驗定義新美業。",
    url: "https://ime-beauty.com/about",
    images: ["/images/653613_0.jpg"],
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
