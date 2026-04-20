import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import { TrainingPageClient } from "./TrainingPageClient";

export const metadata: Metadata = {
  title: "新美業培訓課程 — 泌容術認證班｜I ME 外泌體美容學院",
  description:
    "I ME 泌容術新美業培訓：從初次體驗、煥膚修護到深度抗老。CDMO 認證外泌體原料（星誠 USC-E）× 創始總代理一對一指導。結業取得專業認證，可開業接案。適合美容師、護理師、想轉職新美業者。",
  keywords: [
    "新美業培訓", "新美業課程", "美業教育", "美容師培訓", "外泌體培訓",
    "泌容術", "泌容術培訓", "泌容術認證", "醫美培訓", "美業轉職",
    "I ME 培訓", "I ME 認證", "外泌體療程培訓", "創始總代理",
    "煥膚培訓", "抗老培訓", "美容開業", "美業加盟",
  ],
  alternates: { canonical: `${SITE_URL}/training` },
  openGraph: {
    title: "新美業培訓 — 泌容術認證班 | I ME",
    description: "新美業養成:泌容術認證培訓,CDMO 原料 × 一對一指導,結業可接案。",
    url: `${SITE_URL}/training`,
    images: ["/images/663112_0.jpg"],
  },
};

export default function TrainingPage() {
  return <TrainingPageClient />;
}
