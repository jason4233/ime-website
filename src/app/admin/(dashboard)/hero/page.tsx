"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import type { Column } from "@/components/admin/AdminTable";

interface HeroSection {
  id: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  bgImageUrl: string;
  isActive: boolean;
  order?: number;
}

const columns: Column<HeroSection>[] = [
  { key: "headline", label: "主標題" },
  {
    key: "isActive",
    label: "啟用狀態",
    render: (item) =>
      item.isActive ? (
        <span className="px-2 py-0.5 text-[0.6rem] rounded-full bg-emerald-500/10 text-emerald-400">
          啟用中
        </span>
      ) : (
        <span className="px-2 py-0.5 text-[0.6rem] rounded-full bg-ivory/5 text-ivory/30">
          未啟用
        </span>
      ),
  },
];

const fields = [
  { name: "headline", label: "主標題", type: "text" as const, required: true },
  { name: "subheadline", label: "副標題", type: "textarea" as const, required: true },
  { name: "ctaText", label: "按鈕文字", type: "text" as const },
  { name: "ctaLink", label: "按鈕連結", type: "text" as const },
  { name: "bgImageUrl", label: "背景圖片網址", type: "text" as const },
  { name: "isActive", label: "啟用此區塊", type: "checkbox" as const },
];

export default function AdminHeroPage() {
  return (
    <CrudPage<HeroSection>
      title="Hero 區塊"
      icon="🎯"
      apiPath="/api/admin/hero"
      columns={columns}
      fields={fields}
    />
  );
}
